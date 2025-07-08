import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    
    //@ts-expect-error NextAuth v4 compatibility issue with App Router types
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, originalImageUrl, prompt } = await req.json();

    if (!imageUrl || !originalImageUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Received image URL:", imageUrl);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the original image by URL
    const originalImage = await prisma.images.findFirst({
      where: { url: originalImageUrl },
      select: { id: true }
    });
    if (!originalImage) {
      return NextResponse.json({ error: "Original image not found" }, { status: 404 });
    }

    try {
      // Download the image from the AI service
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const imageBuffer = await response.arrayBuffer();
      console.log("Successfully downloaded image");

      // Upload to Cloudinary
      const uploadRes = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rhinoplasty/generated',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else if (result) {
              console.log("Cloudinary upload success:", result);
              resolve(result);
            } else {
              reject(new Error("Upload failed: No result received"));
            }
          }
        );

        uploadStream.end(Buffer.from(imageBuffer));
      });

      console.log("Uploaded to Cloudinary:", uploadRes.secure_url);

      // Store in database
      const generatedImage = await prisma.aiGeneratedImage.create({
        data: {
          imageUrl: uploadRes.secure_url,
          userId: user.id,
          originalImageId: originalImage.id,
          description: prompt,
        },
      });

      // Increment user's aiGenerationCount
      await prisma.user.update({
        where: { id: user.id },
        data: { aiGenerationCount: { increment: 1 } },
      });

      console.log("Stored in database:", generatedImage);

      return NextResponse.json({
        url: uploadRes.secure_url,
        id: generatedImage.id,
      });

    } catch (error) {
      console.error("Image processing error:", error);
      throw error;
    }

  } catch (error) {
    console.error("Store generated image error:", error);
    return NextResponse.json(
      { error: "Failed to store generated image" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 