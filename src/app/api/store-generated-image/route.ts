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
    
    // Early return if no session - don't log this as an error
    if (!session?.user?.email) {
      return NextResponse.json({ 
        status: "unauthorized",
        message: "User not authenticated" 
      }, { status: 401 });
    }

    const { imageUrl, originalImageUrl, prompt } = await req.json();

    // Validate required fields
    if (!imageUrl || !originalImageUrl) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Missing required fields: imageUrl and originalImageUrl" 
        },
        { status: 400 }
      );
    }

    // Validate imageUrl format
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      return NextResponse.json(
        { 
          status: "error",
          message: "Invalid imageUrl format" 
        },
        { status: 400 }
      );
    }

    console.log("Processing generated image for user:", session.user.email);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ 
        status: "error",
        message: "User not found in database" 
      }, { status: 404 });
    }

    // Find the original image by URL
    const originalImage = await prisma.images.findFirst({
      where: { 
        url: originalImageUrl,
        userId: user.id // Ensure the image belongs to the user
      },
      select: { id: true }
    });

    if (!originalImage) {
      return NextResponse.json({ 
        status: "error",
        message: "Original image not found or doesn't belong to user" 
      }, { status: 404 });
    }

    // Check if this image has already been processed (avoid duplicates)
    const existingGenerated = await prisma.aiGeneratedImage.findFirst({
      where: {
        originalImageId: originalImage.id,
        userId: user.id,
        description: prompt || null
      }
    });

    if (existingGenerated) {
      console.log("Image already processed, returning existing result");
      return NextResponse.json({
        status: "success",
        url: existingGenerated.imageUrl,
        id: existingGenerated.id,
        message: "Image already processed"
      });
    }

    try {
      // Download the image from the AI service
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const imageBuffer = await response.arrayBuffer();
      console.log("Successfully downloaded generated image");

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
              console.log("Cloudinary upload success:", result.secure_url);
              resolve(result);
            } else {
              reject(new Error("Upload failed: No result received"));
            }
          }
        );

        uploadStream.end(Buffer.from(imageBuffer));
      });

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

      console.log("Successfully stored generated image:", generatedImage.id);

      return NextResponse.json({
        status: "success",
        url: uploadRes.secure_url,
        id: generatedImage.id,
        message: "Image stored successfully"
      });

    } catch (error) {
      console.error("Image processing error:", error);
      return NextResponse.json(
        { 
          status: "error",
          message: "Failed to process and store image",
          error: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Store generated image error:", error);
    return NextResponse.json(
      { 
        status: "error",
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 