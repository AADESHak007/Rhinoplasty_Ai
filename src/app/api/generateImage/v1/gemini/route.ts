import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

// Initialize Gemini client
let geminiClient: Client | null = null;

async function getGeminiClient() {
  if (!geminiClient) {
    try {
      geminiClient = await Client.connect("taesiri/Gemini-Text-based-Image-Editor");
    } catch (error) {
      console.error("Failed to connect to Gemini:", error);
      throw new Error("Failed to initialize Gemini client");
    }
  }
  return geminiClient;
}

async function processImageWithGemini(imageUrl: string, instruction: string) {
  try {
    // Fetch the image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBlob = await response.blob();
    
    // Get Gemini client
    const client = await getGeminiClient();
    
    // Process the image
    const result = await client.predict("/process_image", {
      image: imageBlob,
      instruction: instruction
    });

    return result;
  } catch (error) {
    console.error("Gemini processing failed:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get request body
    const { imageUrl, instruction } = await req.json();

    // Validate input
    if (!imageUrl || !instruction) {
      return NextResponse.json(
        { msg: "Please provide both imageUrl and instruction" },
        { status: 400 }
      );
    }

    // Validate image URL format
    if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i)) {
      return NextResponse.json(
        { msg: "Please provide a valid direct image URL (ending in .jpg, .png, etc.)" },
        { status: 400 }
      );
    }

    console.log("Processing image with Gemini Text-based Image Editor...");
    console.log("Image URL:", imageUrl);
    console.log("Instruction:", instruction);

    const result = await processImageWithGemini(imageUrl, instruction);

    // The result contains [editedImage, geminiResponse, status]
    return NextResponse.json({
      status: "success",
      editedImage: (result.data as string[])[0],
      geminiResponse: (result.data as string[])[1],
      processingStatus: (result.data as string[])[2],
      message: "Image processed successfully with Gemini"
    });

  } catch (error: unknown) {
    console.error("Gemini processing failed:", error);
    
    let errorMessage = "Failed to process image";
    if (error instanceof Error) {
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        errorMessage = "Image URL not accessible. Please use a direct image link.";
      } else if (error.message.includes("Failed to fetch image")) {
        errorMessage = "Could not fetch the image from the provided URL.";
      }
    }

    return NextResponse.json(
      { 
        status: "error",
        msg: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Try with a different image URL or check your internet connection"
      },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  try {
    await getGeminiClient();
    return NextResponse.json({ status: "Gemini Image Editor service is available" });
  } catch {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 }
    );
  }
} 