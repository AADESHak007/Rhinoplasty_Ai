import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helper";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer for cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to cloudinary with timeout and retry logic
    const uploadRes = await new Promise<UploadApiResponse>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Upload timed out after 120 seconds'));
      }, 120000); // 120 second timeout

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'rhinoplasty',
          timeout: 120000, // 120 second timeout for Cloudinary
          chunk_size: 6000000, // 6MB chunks for better reliability
          quality: 'auto:good', // Auto-optimize quality
          resource_type: 'image',
        },
        (error, result) => {
          clearTimeout(timeoutId);
          
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          } else if (!result) {
            reject(new Error('Upload failed: No result returned from Cloudinary'));
          } else {
            console.log('Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    // Store image in database
    const image = await prisma.images.create({
      data: {
        url: uploadRes.secure_url,
        userId: user.id,
      },
    });

    return NextResponse.json({ 
      url: uploadRes.secure_url,
      id: image.id 
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    let errorMessage = "Failed to upload image";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        errorMessage = "Unauthorized";
        statusCode = 401;
      } else if (error.message.includes('timeout')) {
        errorMessage = "Upload timed out. Please try with a smaller image or check your connection.";
        statusCode = 408;
      } else if (error.message.includes('size') || error.message.includes('large')) {
        errorMessage = "Image file is too large. Please compress your image and try again.";
        statusCode = 413;
      } else if (error.message.includes('format') || error.message.includes('type')) {
        errorMessage = "Invalid image format. Please use JPG, PNG, or WebP.";
        statusCode = 415;
      } else if (error.message.includes('network') || error.message.includes('connection')) {
        errorMessage = "Network error during upload. Please check your connection and try again.";
        statusCode = 503;
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
