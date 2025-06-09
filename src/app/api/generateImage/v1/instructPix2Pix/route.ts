//INstruct-Pix2Pix
// import { NextRequest, NextResponse } from "next/server";
// import Replicate from "replicate";

// // Initialize Replicate client
// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

// // Helper function to wait for prediction completion
// async function waitForPrediction(predictionId: string, maxAttempts = 120) {
//   let attempts = 0;
  
//   while (attempts < maxAttempts) {
//     const prediction = await replicate.predictions.get(predictionId);
    
//     console.log(`Attempt ${attempts + 1}/${maxAttempts} - Status: ${prediction.status}`);
    
//     if (prediction.status === "succeeded") {
//       console.log("Prediction succeeded!");
//       return prediction;
//     }
    
//     if (prediction.status === "failed") {
//       console.error("Prediction failed:", prediction.error);
//       throw new Error("Prediction failed: " + (prediction.error || "Unknown error"));
//     }
    
//     if (prediction.status === "canceled") {
//       throw new Error("Prediction was canceled");
//     }
    
//     // Wait for 3 seconds before next attempt (InstructPix2Pix can be slow)
//     await new Promise(resolve => setTimeout(resolve, 3000));
//     attempts++;
//   }
  
//   throw new Error(`Prediction timed out after ${maxAttempts * 3} seconds (${maxAttempts} attempts). The model may be overloaded or the image may be too complex.`);
// }

// // Method using InstructPix2Pix
// async function generateWithInstructPix2Pix(
//   imageUrl: string, 
//   prompt: string, 
//   imageGuidance: number = 7.2,
//   textGuidance: number = 8.5,
//   numInferenceSteps: number = 10
// ) {
//   console.log("Creating InstructPix2Pix prediction...");
//   console.log("Image URL:", imageUrl);
//   console.log("Prompt:", prompt);
  
//   const prediction = await replicate.predictions.create({
//     version: "10e63b0e6361eb23a0374f4d9ee145824d9d09f7a31dcd70803193ebc7121430",
//     input: {
//       input_image: imageUrl,
//       instruction_text: prompt, // Use the prompt directly without modification
//       image_guidance: imageGuidance,
//       guidance_scale: textGuidance,
//       num_inference_steps: numInferenceSteps,
//       seed: Math.floor(Math.random() * 1000000),
//     },
//   });

//   console.log("Prediction created with ID:", prediction.id);
//   console.log("Initial status:", prediction.status);

//   return await waitForPrediction(prediction.id);
// }

// export async function POST(req: NextRequest) {
//   try {
//     // Verify Replicate token
//     if (!process.env.REPLICATE_API_TOKEN) {
//       console.error("REPLICATE_API_TOKEN is not set");
//       return NextResponse.json(
//         { msg: "API configuration error" },
//         { status: 500 }
//       );
//     }

//     // Get request body
//     const { 
//       imageUrl,
//       prompt, 
//       imageGuidance ,
//       textGuidance,
//       numInferenceSteps
//     } = await req.json();

//     // Validate input
//     if (!imageUrl || !prompt) {
//       return NextResponse.json(
//         { msg: "Please provide both imageUrl and prompt" },
//         { status: 400 }
//       );
//     }

//     // Validate image URL format
//     if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i)) {
//       return NextResponse.json(
//         { msg: "Please provide a valid direct image URL (ending in .jpg, .png, etc.)" },
//         { status: 400 }
//       );
//     }

//     // Validate parameters
//     if (imageGuidance < 0.5 || imageGuidance > 4.0) {
//       return NextResponse.json(
//         { msg: "imageGuidance must be between 0.5 and 2.0" },
//         { status: 400 }
//       );
//     }

//     if (textGuidance < 1.0 || textGuidance > 20.0) {
//       return NextResponse.json(
//         { msg: "textGuidance must be between 1.0 and 20.0" },
//         { status: 400 }
//       );
//     }

//     if (numInferenceSteps < 5 || numInferenceSteps > 50) {
//       return NextResponse.json(
//         { msg: "numInferenceSteps must be between 5 and 50" },
//         { status: 400 }
//       );
//     }

//     console.log("Using InstructPix2Pix for image editing...");
//     console.log("Parameters:", { imageGuidance, textGuidance, numInferenceSteps });

//     const result = await generateWithInstructPix2Pix(
//       imageUrl, 
//       prompt, 
//       imageGuidance, 
//       textGuidance, 
//       numInferenceSteps
//     );

//     // Extract output URL
//     let outputUrl;
//     if (Array.isArray(result.output)) {
//       outputUrl = result.output[0];
//     } else {
//       outputUrl = result.output;
//     }

//     return NextResponse.json({
//       status: "success",
//       output: outputUrl,
//       id: result.id,
//       modelUsed: "instruct-pix2pix",
//       parameters: {
//         imageGuidance,
//         textGuidance,
//         numInferenceSteps
//       },
//       message: "Image edited successfully with InstructPix2Pix"
//     });

//   } catch (error: unknown) {
//     console.error("InstructPix2Pix generation failed:", error);
    
//     // Provide specific error messages
//     let errorMessage = "Failed to edit image";
//     if (error instanceof Error) {
//       if (error.message.includes("403") || error.message.includes("Forbidden")) {
//         errorMessage = "Image URL not accessible. Please use a direct image link.";
//       } else if (error.message.includes("timeout")) {
//         errorMessage = "Image editing timed out. Please try again.";
//       } else if (error.message.includes("Invalid input")) {
//         errorMessage = "Invalid input parameters. Please check your image URL and prompt.";
//       }
//     }

//     return NextResponse.json(
//       { 
//         status: "error",
//         msg: errorMessage,
//         error: error instanceof Error ? error.message : "Unknown error",
//         suggestion: "Try with different parameters or a different image URL"
//       },
//       { status: 500 }
//     );
//   }
// }


//tedigan model which is cold 

import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Helper function to wait for prediction completion
async function waitForPrediction(predictionId: string, maxAttempts = 120) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const prediction = await replicate.predictions.get(predictionId);
    
    console.log(`Attempt ${attempts + 1}/${maxAttempts} - Status: ${prediction.status}`);
    
    if (prediction.status === "succeeded") {
      console.log("TEDiGAN prediction succeeded!");
      return prediction;
    }
    
    if (prediction.status === "failed") {
      console.error("TEDiGAN prediction failed:", prediction.error);
      throw new Error("Prediction failed: " + (prediction.error || "Unknown error"));
    }
    
    if (prediction.status === "canceled") {
      throw new Error("Prediction was canceled");
    }
    
    // Wait for 2 seconds before next attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error(`Prediction timed out after ${maxAttempts * 2} seconds (${maxAttempts} attempts). The model may be overloaded.`);
}

// Method using TEDiGAN for facial editing
async function generateWithTEDiGAN(
  imageUrl: string,
  description: string,
  numInferenceSteps: number = 50,
  guidanceScale: number = 7.5,
  seed?: number
) {
  console.log("Creating TEDiGAN prediction for rhinoplasty...");
  console.log("Image URL:", imageUrl);
  console.log("Description:", description);
  
  const prediction = await replicate.predictions.create({
    version: "9c4fbe199c72446ef23375d7e38729f7be9d1a73d2cdfee2d433c160f518f7c1",
    input: {
      image: imageUrl,
      description: description,
      num_inference_steps: numInferenceSteps,
      guidance_scale: guidanceScale,
      seed: seed || Math.floor(Math.random() * 1000000),
    },
  });

  console.log("TEDiGAN prediction created with ID:", prediction.id);
  console.log("Initial status:", prediction.status);

  return await waitForPrediction(prediction.id);
}

// Rhinoplasty-specific prompt templates
const RHINOPLASTY_PROMPTS = {
  refine: "refine and slightly narrow the nose bridge, make it more proportional",
  straighten: "straighten the nose bridge, remove any bumps or irregularities",
  narrow: "make the nose narrower and more refined, reduce nostril width",
  lift_tip: "lift the nose tip slightly, make it more defined and upturned",
  reduce_size: "reduce the overall size of the nose, make it more proportional to face",
  dorsal_hump: "remove the dorsal hump from the nose bridge, make it straight",
  bulbous_tip: "refine the bulbous nose tip, make it more defined and narrow",
  wide_nostrils: "narrow the wide nostrils, make them more proportional",
  custom: "" // For custom prompts
};

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
      rhinoplastyType = "custom", // Default rhinoplasty type
      customPrompt,
      numInferenceSteps = 50,
      guidanceScale = 7.5,
      seed
    } = await req.json();

    // Validate input
    if (!imageUrl) {
      return NextResponse.json(
        { msg: "Please provide an image URL" },
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

    // Determine the prompt to use
    let description: string;
    if (rhinoplastyType === "custom" && customPrompt) {
      description = customPrompt;
    } else if (RHINOPLASTY_PROMPTS[rhinoplastyType as keyof typeof RHINOPLASTY_PROMPTS]) {
      description = RHINOPLASTY_PROMPTS[rhinoplastyType as keyof typeof RHINOPLASTY_PROMPTS];
    } else {
      return NextResponse.json(
        { msg: "Invalid rhinoplasty type. Use: refine, straighten, narrow, lift_tip, reduce_size, dorsal_hump, bulbous_tip, wide_nostrils, or custom" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { msg: "Please provide a custom prompt when using rhinoplastyType 'custom'" },
        { status: 400 }
      );
    }

    // Validate parameters
    if (numInferenceSteps < 20 || numInferenceSteps > 100) {
      return NextResponse.json(
        { msg: "numInferenceSteps must be between 20 and 100" },
        { status: 400 }
      );
    }

    if (guidanceScale < 1.0 || guidanceScale > 20.0) {
      return NextResponse.json(
        { msg: "guidanceScale must be between 1.0 and 20.0" },
        { status: 400 }
      );
    }

    console.log("Using TEDiGAN for rhinoplasty simulation...");
    console.log("Rhinoplasty type:", rhinoplastyType);
    console.log("Parameters:", { numInferenceSteps, guidanceScale, seed });

    const result = await generateWithTEDiGAN(
      imageUrl, 
      description, 
      numInferenceSteps, 
      guidanceScale,
      seed
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
      modelUsed: "tedigan",
      rhinoplastyType: rhinoplastyType,
      description: description,
      parameters: {
        numInferenceSteps,
        guidanceScale,
        seed: seed || "random"
      },
      message: `Rhinoplasty simulation completed successfully using ${rhinoplastyType} technique`
    });

  } catch (error: unknown) {
    console.error("TEDiGAN rhinoplasty generation failed:", error);
    
    // Provide specific error messages
    let errorMessage = "Failed to generate rhinoplasty simulation";
    if (error instanceof Error) {
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        errorMessage = "Image URL not accessible. Please use a direct image link.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Rhinoplasty simulation timed out. Please try again with fewer inference steps.";
      } else if (error.message.includes("Invalid input")) {
        errorMessage = "Invalid input parameters. Please check your image URL and settings.";
      } else if (error.message.includes("face")) {
        errorMessage = "No clear face detected in the image. Please use a clear frontal face photo.";
      }
    }

    return NextResponse.json(
      { 
        status: "error",
        msg: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Try with a clear frontal face photo and different parameters"
      },
      { status: 500 }
    );
  }
}

// GET method to return available rhinoplasty types
export async function GET() {
  return NextResponse.json({
    availableRhinoplastyTypes: Object.keys(RHINOPLASTY_PROMPTS),
    defaultParameters: {
      numInferenceSteps: 50,
      guidanceScale: 7.5,
      seed: "random"
    },
    usage: {
      endpoint: "POST /api/rhinoplasty",
      requiredFields: ["imageUrl"],
      optionalFields: ["rhinoplastyType", "customPrompt", "numInferenceSteps", "guidanceScale", "seed"],
      example: {
        imageUrl: "https://example.com/face.jpg",
        rhinoplastyType: "refine",
        numInferenceSteps: 50,
        guidanceScale: 7.5
      }
    }
  });
}


//flux canny model ... 
// import { NextRequest, NextResponse } from "next/server";
// import Replicate from "replicate";

// // Initialize Replicate client
// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

// // Helper function to wait for prediction completion
// async function waitForPrediction(predictionId: string, maxAttempts = 120) {
//   let attempts = 0;
  
//   while (attempts < maxAttempts) {
//     const prediction = await replicate.predictions.get(predictionId);
    
//     console.log(`Attempt ${attempts + 1}/${maxAttempts} - Status: ${prediction.status}`);
    
//     if (prediction.status === "succeeded") {
//       console.log("FLUX Canny Pro prediction succeeded!");
//       return prediction;
//     }
    
//     if (prediction.status === "failed") {
//       console.error("FLUX Canny Pro prediction failed:", prediction.error);
//       throw new Error("Prediction failed: " + (prediction.error || "Unknown error"));
//     }
    
//     if (prediction.status === "canceled") {
//       throw new Error("Prediction was canceled");
//     }
    
//     // Wait for 2 seconds before next attempt
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     attempts++;
//   }
  
//   throw new Error(`Prediction timed out after ${maxAttempts * 2} seconds (${maxAttempts} attempts). The model may be overloaded.`);
// }

// // Method using FLUX Canny Pro for controlled facial editing
// async function generateWithFluxCanny(
//   controlImage: string,
//   prompt: string,
//   steps: number = 50,
//   guidance: number = 30,
//   seed?: number,
//   outputFormat: string = "jpg",
//   safetyTolerance: number = 2,
//   promptUpsampling: boolean = false
// ) {
//   console.log("Creating FLUX Canny Pro prediction for rhinoplasty...");
//   console.log("Control Image URL:", controlImage);
//   console.log("Prompt:", prompt);
  
//   const prediction = await replicate.predictions.create({
//     version: "black-forest-labs/flux-canny-pro",
//     input: {
//       control_image: controlImage,
//       prompt: prompt,
//       steps: steps,
//       guidance: guidance,
//       seed: seed || Math.floor(Math.random() * 1000000),
//       output_format: outputFormat,
//       safety_tolerance: safetyTolerance,
//       prompt_upsampling: promptUpsampling,
//     },
//   });

//   console.log("FLUX Canny Pro prediction created with ID:", prediction.id);
//   console.log("Initial status:", prediction.status);

//   return await waitForPrediction(prediction.id);
// }

// // Rhinoplasty-specific prompt templates optimized for FLUX Canny
// const RHINOPLASTY_PROMPTS = {
//   refine: "A professional portrait photo with a refined, proportional nose that is slightly narrower and more elegant, maintaining natural skin texture and facial harmony",
//   straighten: "A professional portrait photo with a perfectly straight nose bridge, removing any bumps or irregularities, natural lighting and skin texture",
//   narrow: "A professional portrait photo with a narrower, more refined nose that is proportional to the face, maintaining all other facial features exactly",
//   lift_tip: "A professional portrait photo with a slightly upturned, well-defined nose tip, creating better facial proportion and balance",
//   reduce_size: "A professional portrait photo with a smaller, more proportional nose that fits harmoniously with all other facial features",
//   dorsal_hump: "A professional portrait photo with a smooth, straight nose bridge without any dorsal hump, maintaining natural skin texture",
//   bulbous_tip: "A professional portrait photo with a refined, defined nose tip that is less bulbous and more proportional",
//   wide_nostrils: "A professional portrait photo with narrower, more proportional nostrils that complement the overall nose shape",
//   button_nose: "A professional portrait photo with a small, compact button nose that is soft and rounded, maintaining facial harmony",
//   custom: "" // For custom prompts
// };

// export async function POST(req: NextRequest) {
//   try {
//     // Verify Replicate token
//     if (!process.env.REPLICATE_API_TOKEN) {
//       console.error("REPLICATE_API_TOKEN is not set");
//       return NextResponse.json(
//         { msg: "API configuration error" },
//         { status: 500 }
//       );
//     }

//     // Get request body
//     const { 
//       imageUrl, 
//       rhinoplastyType = "refine", // Default rhinoplasty type
//       customPrompt,
//       steps = 50,
//       guidance = 30,
//       seed,
//       outputFormat = "jpg",
//       safetyTolerance = 2,
//       promptUpsampling = false
//     } = await req.json();

//     // Validate input
//     if (!imageUrl) {
//       return NextResponse.json(
//         { msg: "Please provide an image URL" },
//         { status: 400 }
//       );
//     }

//     // Validate image URL format
//     if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
//       return NextResponse.json(
//         { msg: "Please provide a valid direct image URL (jpg, jpeg, png, webp, gif)" },
//         { status: 400 }
//       );
//     }

//     // Determine the prompt to use
//     let finalPrompt: string;
//     if (rhinoplastyType === "custom" && customPrompt) {
//       finalPrompt = customPrompt;
//     } else if (RHINOPLASTY_PROMPTS[rhinoplastyType as keyof typeof RHINOPLASTY_PROMPTS]) {
//       finalPrompt = RHINOPLASTY_PROMPTS[rhinoplastyType as keyof typeof RHINOPLASTY_PROMPTS];
//     } else {
//       return NextResponse.json(
//         { msg: "Invalid rhinoplasty type. Available options: refine, straighten, narrow, lift_tip, reduce_size, dorsal_hump, bulbous_tip, wide_nostrils, button_nose, custom" },
//         { status: 400 }
//       );
//     }

//     if (!finalPrompt) {
//       return NextResponse.json(
//         { msg: "Please provide a custom prompt when using rhinoplastyType 'custom'" },
//         { status: 400 }
//       );
//     }

//     // Validate parameters
//     if (steps < 15 || steps > 50) {
//       return NextResponse.json(
//         { msg: "steps must be between 15 and 50" },
//         { status: 400 }
//       );
//     }

//     if (guidance < 1 || guidance > 100) {
//       return NextResponse.json(
//         { msg: "guidance must be between 1 and 100" },
//         { status: 400 }
//       );
//     }

//     if (safetyTolerance < 1 || safetyTolerance > 6) {
//       return NextResponse.json(
//         { msg: "safetyTolerance must be between 1 and 6" },
//         { status: 400 }
//       );
//     }

//     if (!["jpg", "png", "webp"].includes(outputFormat.toLowerCase())) {
//       return NextResponse.json(
//         { msg: "outputFormat must be jpg, png, or webp" },
//         { status: 400 }
//       );
//     }

//     console.log("Using FLUX Canny Pro for rhinoplasty simulation...");
//     console.log("Rhinoplasty type:", rhinoplastyType);
//     console.log("Parameters:", { steps, guidance, seed, outputFormat, safetyTolerance, promptUpsampling });

//     const result = await generateWithFluxCanny(
//       imageUrl, 
//       finalPrompt, 
//       steps, 
//       guidance,
//       seed,
//       outputFormat,
//       safetyTolerance,
//       promptUpsampling
//     );

//     // Extract output URL - FLUX Canny Pro returns a single URI
//     const outputUrl = result.output;

//     return NextResponse.json({
//       status: "success",
//       output: outputUrl,
//       id: result.id,
//       modelUsed: "flux-canny-pro",
//       rhinoplastyType: rhinoplastyType,
//       prompt: finalPrompt,
//       parameters: {
//         steps,
//         guidance,
//         seed: seed || "random",
//         outputFormat,
//         safetyTolerance,
//         promptUpsampling
//       },
//       message: `Rhinoplasty simulation completed successfully using FLUX Canny Pro with ${rhinoplastyType} technique`
//     });

//   } catch (error: unknown) {
//     console.error("FLUX Canny Pro rhinoplasty generation failed:", error);
    
//     // Provide specific error messages
//     let errorMessage = "Failed to generate rhinoplasty simulation";
//     if (error instanceof Error) {
//       if (error.message.includes("403") || error.message.includes("Forbidden")) {
//         errorMessage = "Image URL not accessible. Please use a direct image link.";
//       } else if (error.message.includes("timeout")) {
//         errorMessage = "Rhinoplasty simulation timed out. Please try again with fewer steps.";
//       } else if (error.message.includes("Invalid input")) {
//         errorMessage = "Invalid input parameters. Please check your image URL and settings.";
//       } else if (error.message.includes("safety")) {
//         errorMessage = "Content filtered by safety settings. Try adjusting safety tolerance or using a different image.";
//       } else if (error.message.includes("face")) {
//         errorMessage = "No clear face detected in the image. Please use a clear frontal face photo.";
//       }
//     }

//     return NextResponse.json(
//       { 
//         status: "error",
//         msg: errorMessage,
//         error: error instanceof Error ? error.message : "Unknown error",
//         suggestion: "Try with a clear frontal face photo, adjust parameters, or increase safety tolerance"
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET method to return available rhinoplasty types and parameters
// export async function GET() {
//   return NextResponse.json({
//     availableRhinoplastyTypes: Object.keys(RHINOPLASTY_PROMPTS),
//     defaultParameters: {
//       steps: 50,
//       guidance: 30,
//       seed: "random",
//       outputFormat: "jpg",
//       safetyTolerance: 2,
//       promptUpsampling: false
//     },
//     parameterRanges: {
//       steps: { min: 15, max: 50 },
//       guidance: { min: 1, max: 100 },
//       safetyTolerance: { min: 1, max: 6 },
//       outputFormat: ["jpg", "png", "webp"]
//     },
//     usage: {
//       endpoint: "POST /api/rhinoplasty",
//       requiredFields: ["imageUrl"],
//       optionalFields: ["rhinoplastyType", "customPrompt", "steps", "guidance", "seed", "outputFormat", "safetyTolerance", "promptUpsampling"],
//       examples: {
//         basic: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "refine"
//         },
//         advanced: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "button_nose",
//           steps: 40,
//           guidance: 25,
//           outputFormat: "png",
//           safetyTolerance: 3
//         },
//         custom: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "custom",
//           customPrompt: "A professional portrait with a perfectly sculpted nose that complements the facial structure",
//           steps: 50,
//           guidance: 35
//         }
//       }
//     },
//     modelInfo: {
//       name: "FLUX Canny Pro",
//       description: "Advanced image generation with Canny edge control for precise facial modifications",
//       advantages: [
//         "High-quality output with fine detail control",
//         "Canny edge detection for structural precision",
//         "Professional-grade results",
//         "Flexible safety and quality settings"
//       ]
//     }
//   });
// }




//ideogramModel

// import { NextRequest, NextResponse } from "next/server";
// import Replicate from "replicate";

// // Initialize Replicate client
// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });

// // Helper function to wait for prediction completion
// async function waitForPrediction(predictionId: string, maxAttempts = 120) {
//   let attempts = 0;
  
//   while (attempts < maxAttempts) {
//     const prediction = await replicate.predictions.get(predictionId);
    
//     console.log(`Attempt ${attempts + 1}/${maxAttempts} - Status: ${prediction.status}`);
    
//     if (prediction.status === "succeeded") {
//       console.log("Ideogram v2 rhinoplasty prediction succeeded!");
//       return prediction;
//     }
    
//     if (prediction.status === "failed") {
//       console.error("Ideogram v2 rhinoplasty prediction failed:", prediction.error);
//       throw new Error("Prediction failed: " + (prediction.error || "Unknown error"));
//     }
    
//     if (prediction.status === "canceled") {
//       throw new Error("Prediction was canceled");
//     }
    
//     // Wait for 2 seconds before next attempt
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     attempts++;
//   }
  
//   throw new Error(`Prediction timed out after ${maxAttempts * 2} seconds (${maxAttempts} attempts). The model may be overloaded.`);
// }

// // SVG mask template for nose area
// const DEFAULT_NOSE_MASK_SVG = `<svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
//   <rect width="400" height="500" fill="white"/>
//   <ellipse cx="200" cy="250" rx="25" ry="45" fill="black"/>
//   <ellipse cx="200" cy="275" rx="30" ry="25" fill="black"/>
//   <ellipse cx="185" cy="285" rx="12" ry="15" fill="black"/>
//   <ellipse cx="215" cy="285" rx="12" ry="15" fill="black"/>
//   <ellipse cx="200" cy="220" rx="18" ry="25" fill="black"/>
//   <ellipse cx="200" cy="240" rx="22" ry="15" fill="black"/>
//   <ellipse cx="200" cy="260" rx="28" ry="18" fill="black"/>
//   <ellipse cx="175" cy="255" rx="8" ry="20" fill="black"/>
//   <ellipse cx="225" cy="255" rx="8" ry="20" fill="black"/>
// </svg>`;

// // Function to convert SVG to data URL
// function svgToDataUrl(svgString: string): string {
//   const base64 = Buffer.from(svgString).toString('base64');
//   return `data:image/svg+xml;base64,${base64}`;
// }

// interface IdeogramInputParams {
//   image: string;
//   prompt: string;
//   magic_prompt_option: string;
//   aspect_ratio: string;
//   model: string;
//   style_type: string;
//   mask?: string;
//   seed?: number;
// }

// // Method using Ideogram v2 for controlled rhinoplasty simulation
// async function generateWithIdeogram(
//   image: string,
//   prompt: string,
//   mask?: string,
//   magicPromptOption: string = "Auto",
//   seed?: number,
//   aspectRatio: string = "1:1",
//   model: string = "V_2",
//   styleType: string = "Realistic",
//   useDefaultMask: boolean = false
// ) {
//   console.log("Creating Ideogram v2 prediction for rhinoplasty...");
//   console.log("Image URL:", image);
//   console.log("Prompt:", prompt);
//   console.log("Using default mask:", useDefaultMask);
//   console.log("Custom mask URL:", mask);
  
//   const inputParams: IdeogramInputParams = {
//     image: image,
//     prompt: prompt,
//     magic_prompt_option: magicPromptOption,
//     aspect_ratio: aspectRatio,
//     model: model,
//     style_type: styleType,
//   };

//   // Add mask - either custom or default SVG
//   if (useDefaultMask) {
//     inputParams.mask = svgToDataUrl(DEFAULT_NOSE_MASK_SVG);
//     console.log("Using built-in nose mask");
//   } else if (mask) {
//     inputParams.mask = mask;
//     console.log("Using custom mask");
//   }
  
//   if (seed) {
//     inputParams.seed = seed;
//   }

//   const prediction = await replicate.predictions.create({
//     version: "ideogram-ai/ideogram-v2",
//     input: inputParams,
//   });

//   console.log("Ideogram v2 rhinoplasty prediction created with ID:", prediction.id);
//   console.log("Initial status:", prediction.status);

//   return await waitForPrediction(prediction.id);
// }

// // Rhinoplasty-specific prompt templates optimized for Ideogram v2
// const RHINOPLASTY_PROMPTS = {
//   refine: "A professional portrait photo with a refined, proportional nose that is slightly narrower and more elegant, maintaining natural skin texture and facial harmony, photorealistic quality",
//   straighten: "A professional portrait photo with a perfectly straight nose bridge, removing any bumps or irregularities, natural lighting and skin texture, high quality photography",
//   narrow: "A professional portrait photo with a narrower, more refined nose that is proportional to the face, maintaining all other facial features exactly, photorealistic style",
//   lift_tip: "A professional portrait photo with a slightly upturned, well-defined nose tip, creating better facial proportion and balance, natural photography lighting",
//   reduce_size: "A professional portrait photo with a smaller, more proportional nose that fits harmoniously with all other facial features, maintaining natural appearance",
//   dorsal_hump: "A professional portrait photo with a smooth, straight nose bridge without any dorsal hump, maintaining natural skin texture and realistic lighting",
//   bulbous_tip: "A professional portrait photo with a refined, defined nose tip that is less bulbous and more proportional, keeping natural facial characteristics",
//   wide_nostrils: "A professional portrait photo with narrower, more proportional nostrils that complement the overall nose shape, photorealistic quality",
//   button_nose: "A professional portrait photo with a small, compact button nose that is soft and rounded, maintaining facial harmony and natural appearance",
//   aquiline: "A professional portrait photo with a refined aquiline nose that has a subtle, elegant curve, maintaining facial balance and natural proportions",
//   upturned: "A professional portrait photo with a gently upturned nose that creates a youthful, refined appearance while maintaining natural facial harmony",
//   custom: "" // For custom prompts
// };

// export async function POST(req: NextRequest) {
//   try {
//     // Verify Replicate token
//     if (!process.env.REPLICATE_API_TOKEN) {
//       console.error("REPLICATE_API_TOKEN is not set");
//       return NextResponse.json(
//         { msg: "API configuration error" },
//         { status: 500 }
//       );
//     }

//     // Get request body
//     const { 
//       imageUrl, 
//       maskUrl, // Optional custom mask for precise nose editing
//       rhinoplastyType = "refine", // Default rhinoplasty type
//       customPrompt,
//       magicPromptOption = "Auto",
//       seed,
//       aspectRatio = "1:1",
//       model = "V_2",
//       styleType = "Realistic", // Default to Realistic for medical simulations
//       useMask = true, // Whether to use mask-based editing (default true for rhinoplasty)
//       useDefaultMask = true // Whether to use built-in nose mask (default true)
//     } = await req.json();

//     // Validate input
//     if (!imageUrl) {
//       return NextResponse.json(
//         { msg: "Please provide an image URL" },
//         { status: 400 }
//       );
//     }

//     // Validate image URL format
//     if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
//       return NextResponse.json(
//         { msg: "Please provide a valid direct image URL (jpg, jpeg, png, webp, gif)" },
//         { status: 400 }
//       );
//     }

//     // Validate mask URL if provided and custom mask is being used
//     if (!useDefaultMask && useMask && maskUrl && !maskUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i)) {
//       return NextResponse.json(
//         { msg: "Please provide a valid direct mask URL (jpg, jpeg, png, webp, gif)" },
//         { status: 400 }
//       );
//     }

//     // Determine the prompt to use
//     let finalPrompt: string;
//     if (rhinoplastyType === "custom" && customPrompt) {
//       finalPrompt = customPrompt;
//     } else if (RHINOPLASTY_PROMPTS[rhinoplastyType as keyof typeof RHINOPLASTY_PROMPTS] !== undefined) {
//       finalPrompt = RHINOPLASTY_PROMPTS[rhinoplastyType as keyof typeof RHINOPLASTY_PROMPTS];
//     } else {
//       return NextResponse.json(
//         { msg: "Invalid rhinoplasty type. Available options: refine, straighten, narrow, lift_tip, reduce_size, dorsal_hump, bulbous_tip, wide_nostrils, button_nose, aquiline, upturned, custom" },
//         { status: 400 }
//       );
//     }

//     if (!finalPrompt) {
//       return NextResponse.json(
//         { msg: "Please provide a custom prompt when using rhinoplastyType 'custom'" },
//         { status: 400 }
//       );
//     }

//     // Validate parameters
//     const validAspectRatios = ["1:1", "16:10", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "6:7", "7:6"];
//     if (!validAspectRatios.includes(aspectRatio)) {
//       return NextResponse.json(
//         { msg: `aspectRatio must be one of: ${validAspectRatios.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     const validMagicPromptOptions = ["Auto", "On", "Off"];
//     if (!validMagicPromptOptions.includes(magicPromptOption)) {
//       return NextResponse.json(
//         { msg: `magicPromptOption must be one of: ${validMagicPromptOptions.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     const validModels = ["V_2", "V_2_TURBO"];
//     if (!validModels.includes(model)) {
//       return NextResponse.json(
//         { msg: `model must be one of: ${validModels.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     const validStyleTypes = ["Auto", "General", "Realistic", "Design"];
//     if (!validStyleTypes.includes(styleType)) {
//       return NextResponse.json(
//         { msg: `styleType must be one of: ${validStyleTypes.join(", ")} (Realistic recommended for rhinoplasty)` },
//         { status: 400 }
//       );
//     }

//     console.log("Using Ideogram v2 for rhinoplasty simulation...");
//     console.log("Rhinoplasty type:", rhinoplastyType);
//     console.log("Using mask:", useMask ? "Yes" : "No");
//     console.log("Using default mask:", useDefaultMask ? "Yes" : "No");
//     console.log("Custom mask URL:", !useDefaultMask && maskUrl ? maskUrl : "None");
//     console.log("Parameters:", { magicPromptOption, seed, aspectRatio, model, styleType });

//     const result = await generateWithIdeogram(
//       imageUrl, 
//       finalPrompt,
//       useMask && !useDefaultMask ? maskUrl : undefined,
//       magicPromptOption,
//       seed,
//       aspectRatio,
//       model,
//       styleType,
//       useMask && useDefaultMask
//     );

//     // Extract output URL - Ideogram v2 returns an array of URLs
//     const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

//     return NextResponse.json({
//       status: "success",
//       output: outputUrl,
//       id: result.id,
//       modelUsed: "ideogram-v2",
//       rhinoplastyType: rhinoplastyType,
//       prompt: finalPrompt,
//       maskInfo: {
//         usedMask: useMask,
//         maskType: useMask ? (useDefaultMask ? "built-in" : "custom") : "none",
//         customMaskUrl: !useDefaultMask && maskUrl ? maskUrl : null
//       },
//       parameters: {
//         magicPromptOption,
//         seed: seed || "random",
//         aspectRatio,
//         model,
//         styleType
//       },
//       message: `Rhinoplasty simulation completed successfully using Ideogram v2 with ${rhinoplastyType} technique`
//     });

//   } catch (error: unknown) {
//     console.error("Ideogram v2 rhinoplasty generation failed:", error);
    
//     // Provide specific error messages
//     let errorMessage = "Failed to generate rhinoplasty simulation";
//     if (error instanceof Error) {
//       if (error.message.includes("403") || error.message.includes("Forbidden")) {
//         errorMessage = "Image URL not accessible. Please use a direct image link.";
//       } else if (error.message.includes("timeout")) {
//         errorMessage = "Rhinoplasty simulation timed out. Please try again.";
//       } else if (error.message.includes("Invalid input")) {
//         errorMessage = "Invalid input parameters. Please check your image URL and settings.";
//       } else if (error.message.includes("safety")) {
//         errorMessage = "Content filtered by safety settings. Try using a different image.";
//       } else if (error.message.includes("face")) {
//         errorMessage = "No clear face detected in the image. Please use a clear frontal face photo.";
//       } else if (error.message.includes("dimensions")) {
//         errorMessage = "Image dimensions not supported. Please use a different aspect ratio.";
//       }
//     }

//     return NextResponse.json(
//       { 
//         status: "error",
//         msg: errorMessage,
//         error: error instanceof Error ? error.message : "Unknown error",
//         suggestion: "Try with a clear frontal face photo, check your mask alignment if using one, or adjust parameters"
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET method to return available rhinoplasty types and parameters
// export async function GET() {
//   return NextResponse.json({
//     availableRhinoplastyTypes: Object.keys(RHINOPLASTY_PROMPTS),
//     defaultParameters: {
//       magicPromptOption: "Auto",
//       seed: "random",
//       aspectRatio: "1:1",
//       model: "V_2",
//       styleType: "Realistic",
//       useMask: true,
//       useDefaultMask: true
//     },
//     parameterOptions: {
//       magicPromptOption: ["Auto", "On", "Off"],
//       aspectRatio: ["1:1", "16:10", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "6:7", "7:6"],
//       model: ["V_2", "V_2_TURBO"],
//       styleType: ["Auto", "General", "Realistic", "Design"]
//     },
//     usage: {
//       endpoint: "POST /api/rhinoplasty",
//       requiredFields: ["imageUrl"],
//       optionalFields: ["maskUrl", "rhinoplastyType", "customPrompt", "magicPromptOption", "seed", "aspectRatio", "model", "styleType", "useMask", "useDefaultMask"],
//       examples: {
//         basic: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "refine"
//         },
//         withBuiltInMask: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "narrow",
//           useMask: true,
//           useDefaultMask: true
//         },
//         withCustomMask: {
//           imageUrl: "https://example.com/face.jpg",
//           maskUrl: "https://example.com/custom_nose_mask.png",
//           rhinoplastyType: "narrow",
//           useMask: true,
//           useDefaultMask: false,
//           styleType: "Realistic"
//         },
//         advanced: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "button_nose",
//           model: "V_2_TURBO",
//           aspectRatio: "4:5",
//           magicPromptOption: "On",
//           seed: 12345
//         },
//         custom: {
//           imageUrl: "https://example.com/face.jpg",
//           rhinoplastyType: "custom",
//           customPrompt: "A professional portrait with a perfectly sculpted nose that complements the facial structure, photorealistic quality",
//           styleType: "Realistic",
//           model: "V_2"
//         }
//       }
//     },
//     modelInfo: {
//       name: "Ideogram v2",
//       description: "Advanced image editing model optimized for rhinoplasty simulations with photorealistic results",
//       advantages: [
//         "Excellent inpainting capabilities for precise nose editing",
//         "High-quality photorealistic output",
//         "Magic prompt enhancement for better results",
//         "Multiple rhinoplasty technique options",
//         "Optional mask-based editing for precision",
//         "Fast V_2_TURBO option available"
//       ],
//       rhinoplastyFeatures: [
//         "Built-in nose mask template for easy use",
//         "Natural-looking nose modifications",
//         "Preserves facial harmony and proportions",
//         "Maintains skin texture and lighting",
//         "Professional medical simulation quality",
//         "Various nose shape options available",
//         "Custom mask support for advanced users"
//       ],
//       recommendations: {
//         imageQuality: "Use clear, frontal face photos with good lighting",
//         aspectRatio: "1:1 or 4:5 work best for portraits", 
//         styleType: "Use 'Realistic' for medical simulations",
//         magicPrompt: "Keep 'Auto' for enhanced results",
//         maskUsage: "Built-in mask works for most cases, custom mask for precision",
//         defaultMask: "Automatically sized and positioned for typical nose editing"
//       }
//     }
//   });
// }