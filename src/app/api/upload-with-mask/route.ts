import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Generate mask using the /api/mask-image route with FormData
    const maskFormData = new FormData();
    maskFormData.append('file', file);
    
    const maskRequest = new Request(`${process.env.NEXTAUTH_URL}/api/mask-image`, {
      method: 'POST',
      body: maskFormData,
    });
    
    const maskResponse = await fetch(maskRequest);
    if (!maskResponse.ok) {
      throw new Error('Mask generation failed');
    }
    
    const maskData = await maskResponse.json();
    const maskImageUrl = maskData.maskUrl;
    if (!maskImageUrl) {
      throw new Error('No mask returned from mask generation');
    }

    // 2. Upload original image to Cloudinary
    const uploadOriginal = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "rhinoplasty", resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result as UploadApiResponse);
        }
      );
      
      // Convert File to Buffer for cloudinary
      file.arrayBuffer().then(buffer => {
        stream.end(Buffer.from(buffer));
      }).catch(reject);
    });

    // 3. Upload mask image to Cloudinary (fetch from URL)
    const maskResponse2 = await fetch(maskImageUrl);
    if (!maskResponse2.ok) {
      throw new Error('Failed to fetch mask image from URL');
    }
    
    const maskBuffer = Buffer.from(await maskResponse2.arrayBuffer());
    
    const uploadMask = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "rhinoplasty", resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result as UploadApiResponse);
        }
      );
      stream.end(maskBuffer);
    });

    // 4. Store original image in DB
    //@ts-expect-error NextAuth v4 compatibility issue with App Router types
    const session = await getServerSession(authOptions);
    let imageDbId = null;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (user) {
        const dbImage = await prisma.images.create({
          data: {
            url: uploadOriginal.secure_url,
            userId: user.id,
          },
        });
        imageDbId = dbImage.id;
      }
    }

    // Return URLs and DB id
    return NextResponse.json({
      originalUrl: uploadOriginal.secure_url,
      maskUrl: uploadMask.secure_url,
      originalImageId: imageDbId
    });
  } catch (error) {
    console.error("Upload-with-mask error:", error);
    return NextResponse.json({ error: "Failed to upload and generate mask" }, { status: 500 });
  }
  finally {
    await prisma.$disconnect();
  }
} 