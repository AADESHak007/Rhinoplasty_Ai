import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
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

    // Use system temp directory (cross-platform)
    const tempDir = process.env.TEMP || process.env.TMP || "/tmp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const inputPath = path.join(tempDir, `input_${Date.now()}.png`);
    const maskPath = path.join(tempDir, `mask_${Date.now()}.png`);

    // Save uploaded file to a temp location
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(inputPath, buffer);

    // Call Python script to generate mask
    await new Promise((resolve, reject) => {
      const py = spawn("python", [
        path.join(process.cwd(), "mask_nose.py"),
        inputPath,
        maskPath
      ]);
      py.on("close", (code) => {
        if (code === 0) resolve(0);
        else reject(new Error("Python mask generation failed"));
      });
      py.on("error", reject);
    });

    // Upload original image to Cloudinary
    const uploadOriginal = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "rhinoplasty", resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result as UploadApiResponse);
        }
      );
      fs.createReadStream(inputPath).pipe(stream);
    });

    // Upload mask image to Cloudinary
    const uploadMask = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "rhinoplasty", resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result as UploadApiResponse);
        }
      );
      fs.createReadStream(maskPath).pipe(stream);
    });

    // Clean up temp files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(maskPath);

    // Store original image in DB
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