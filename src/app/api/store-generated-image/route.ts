import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, originalImageId, prompt } = await req.json();

    if (!imageUrl || !originalImageId) {
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

    try {
      // Download the image from the AI service
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const imageBuffer = await response.arrayBuffer();
      console.log("Successfully downloaded image");

      // Upload to Cloudinary
      const uploadRes = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rhinoplasty/generated',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result);
              resolve(result);
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
          originalImageId: originalImageId,
          description: prompt,
        },
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