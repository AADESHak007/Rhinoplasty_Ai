import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Helper function to wait for prediction completion
async function waitForPrediction(predictionId: string, maxAttempts = 60) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const prediction = await replicate.predictions.get(predictionId);
    
    console.log(`Attempt ${attempts + 1}/${maxAttempts} - Status: ${prediction.status}`);
    
    if (prediction.status === "succeeded") {
      console.log("Prediction succeeded!");
      return prediction;
    }
    
    if (prediction.status === "failed") {
      console.error("Prediction failed:", prediction.error);
      throw new Error("Prediction failed: " + (prediction.error || "Unknown error"));
    }
    
    if (prediction.status === "canceled") {
      throw new Error("Prediction was canceled");
    }
    
    // Wait for 3 seconds before next attempt (InstructPix2Pix can be slow)
    await new Promise(resolve => setTimeout(resolve, 3000));
    attempts++;
  }
  
  throw new Error(`Prediction timed out after ${maxAttempts * 3} seconds (${maxAttempts} attempts). The model may be overloaded or the image may be too complex.`);
}

// Method using InstructPix2Pix
async function generateWithInstructPix2Pix(
  imageUrl: string, 
  prompt: string, 
  imageGuidance: number = 1.5,
  textGuidance: number = 7.5,
  numInferenceSteps: number = 10
) {
  console.log("Creating InstructPix2Pix prediction...");
  console.log("Image URL:", imageUrl);
  console.log("Prompt:", prompt);
  
  const prediction = await replicate.predictions.create({
    version: "10e63b0e6361eb23a0374f4d9ee145824d9d09f7a31dcd70803193ebc7121430",
    input: {
      input_image: imageUrl,
      instruction_text: prompt, // Use the prompt directly without modification
      image_guidance: imageGuidance,
      guidance_scale: textGuidance,
      num_inference_steps: numInferenceSteps,
      seed: Math.floor(Math.random() * 1000000),
    },
  });

  console.log("Prediction created with ID:", prediction.id);
  console.log("Initial status:", prediction.status);

  return await waitForPrediction(prediction.id);
}

export async function POST(req: NextRequest) {
  try {
    // Verify Replicate token
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("REPLICATE_API_TOKEN is not set");
      return NextResponse.json(
        { msg: "API configuration error" },
        { status: 500 }
      );
    }

    // Get request body
    const { 
      imageUrl, 
      prompt, 
      imageGuidance = 1.9,
      textGuidance = 7.5,
      numInferenceSteps = 10
    } = await req.json();

    // Validate input
    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { msg: "Please provide both imageUrl and prompt" },
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

    // Validate parameters
    if (imageGuidance < 0.5 || imageGuidance > 4.0) {
      return NextResponse.json(
        { msg: "imageGuidance must be between 0.5 and 2.0" },
        { status: 400 }
      );
    }

    if (textGuidance < 1.0 || textGuidance > 20.0) {
      return NextResponse.json(
        { msg: "textGuidance must be between 1.0 and 20.0" },
        { status: 400 }
      );
    }

    if (numInferenceSteps < 5 || numInferenceSteps > 50) {
      return NextResponse.json(
        { msg: "numInferenceSteps must be between 5 and 50" },
        { status: 400 }
      );
    }

    console.log("Using InstructPix2Pix for image editing...");
    console.log("Parameters:", { imageGuidance, textGuidance, numInferenceSteps });

    const result = await generateWithInstructPix2Pix(
      imageUrl, 
      prompt, 
      imageGuidance, 
      textGuidance, 
      numInferenceSteps
    );

    // Extract output URL
    let outputUrl;
    if (Array.isArray(result.output)) {
      outputUrl = result.output[0];
    } else {
      outputUrl = result.output;
    }

    return NextResponse.json({
      status: "success",
      output: outputUrl,
      id: result.id,
      modelUsed: "instruct-pix2pix",
      parameters: {
        imageGuidance,
        textGuidance,
        numInferenceSteps
      },
      message: "Image edited successfully with InstructPix2Pix"
    });

  } catch (error: unknown) {
    console.error("InstructPix2Pix generation failed:", error);
    
    // Provide specific error messages
    let errorMessage = "Failed to edit image";
    if (error instanceof Error) {
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        errorMessage = "Image URL not accessible. Please use a direct image link.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Image editing timed out. Please try again.";
      } else if (error.message.includes("Invalid input")) {
        errorMessage = "Invalid input parameters. Please check your image URL and prompt.";
      }
    }

    return NextResponse.json(
      { 
        status: "error",
        msg: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Try with different parameters or a different image URL"
      },
      { status: 500 }
    );
  }
}