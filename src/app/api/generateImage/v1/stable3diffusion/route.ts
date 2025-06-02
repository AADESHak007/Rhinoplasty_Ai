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
    
    // Wait for 3 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 3000));
    attempts++;
  }
  
  throw new Error(`Prediction timed out after ${maxAttempts * 3} seconds (${maxAttempts} attempts). The model may be overloaded or the image may be too complex.`);
}

// Method using Stable Diffusion 3.5 Large
async function generateWithSD35Large(
  imageUrl: string,
  prompt: string,
  negativePrompt: string = "",
  strength: number = 0.7,
  guidanceScale: number = 7.5,
  numInferenceSteps: number = 28,
  width: number = 1024,
  height: number = 1024
) {
  console.log("Creating Stable Diffusion 3.5 Large prediction...");
  console.log("Image URL:", imageUrl);
  console.log("Prompt:", prompt);
  console.log("Parameters:", { strength, guidanceScale, numInferenceSteps });
  
  // Add medical/professional context to avoid NSFW filters
  const safePrompt = `Medical consultation, professional headshot photography: ${prompt}. Clinical setting, medical photography, healthcare professional documentation.`;
  
  const safeNegativePrompt = negativePrompt || "nsfw, nude, sexual, inappropriate, explicit, adult content, suggestive, blurry, low quality, distorted, deformed, disfigured, bad anatomy, wrong proportions, extra limbs, cloned face, malformed limbs, missing arms, missing legs, fused fingers, too many fingers, long neck, mutation, mutated, ugly, disgusting, poorly drawn, extra fingers, animal ears";
  
  const prediction = await replicate.predictions.create({
    version: "stability-ai/stable-diffusion-3.5-large",
    input: {
      image: imageUrl,
      prompt: safePrompt,
      negative_prompt: safeNegativePrompt,
      strength: strength,
      guidance_scale: guidanceScale,
      num_inference_steps: numInferenceSteps,
      width: width,
      height: height,
      seed: Math.floor(Math.random() * 1000000),
      output_format: "jpg",
      output_quality: 90,
      disable_safety_checker: false, // Keep safety checker but use safe prompts
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
      negativePrompt = "",
      strength = 0.45,
      guidanceScale = 6.78,
      numInferenceSteps = 28,
      width = 1024,
      height = 1024
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
    if (strength < 0.1 || strength > 1.0) {
      return NextResponse.json(
        { msg: "strength must be between 0.1 and 1.0 (0.7 recommended for nose editing)" },
        { status: 400 }
      );
    }

    if (guidanceScale < 1.0 || guidanceScale > 20.0) {
      return NextResponse.json(
        { msg: "guidanceScale must be between 1.0 and 20.0" },
        { status: 400 }
      );
    }

    if (numInferenceSteps < 10 || numInferenceSteps > 100) {
      return NextResponse.json(
        { msg: "numInferenceSteps must be between 10 and 100" },
        { status: 400 }
      );
    }

    if (width < 512 || width > 2048 || height < 512 || height > 2048) {
      return NextResponse.json(
        { msg: "width and height must be between 512 and 2048 pixels" },
        { status: 400 }
      );
    }

    console.log("Using Stable Diffusion 3.5 Large for image editing...");

    const result = await generateWithSD35Large(
      imageUrl, 
      prompt,
      negativePrompt,
      strength,
      guidanceScale,
      numInferenceSteps,
      width,
      height
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
      modelUsed: "stable-diffusion-3.5-large",
      parameters: {
        strength,
        guidanceScale,
        numInferenceSteps,
        width,
        height
      },
      message: "Image edited successfully with Stable Diffusion 3.5 Large"
    });

  } catch (error: unknown) {
    console.error("Stable Diffusion 3.5 Large generation failed:", error);
    
    // Provide specific error messages
    let errorMessage = "Failed to edit image";
    if (error instanceof Error) {
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        errorMessage = "Image URL not accessible. Please use a direct image link.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Image editing timed out. Please try again or reduce the number of inference steps.";
      } else if (error.message.includes("Invalid input")) {
        errorMessage = "Invalid input parameters. Please check your image URL and prompt.";
      } else if (error.message.includes("NSFW")) {
        errorMessage = "Content detected as inappropriate. Please try with a different image.";
      }
    }

    return NextResponse.json(
      { 
        status: "error",
        msg: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Try with different parameters, reduce strength value, or use a different image URL"
      },
      { status: 500 }
    );
  }
}