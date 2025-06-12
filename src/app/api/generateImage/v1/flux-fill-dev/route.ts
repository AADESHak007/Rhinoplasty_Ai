import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// //@ts-expect-error NextAuth v4 compatibility issue with App Router types

// const session = await getServerSession(authOptions) ;

// //@ts-expect-error NextAuth v4 compatibility issue with App Router types
// const userId = session?.user?.id;

// const prisma = new PrismaClient() ;


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, prompt, maskImage, ...options } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // For FLUX Fill, mask is typically required for proper inpainting
    if (!maskImage) {
      return NextResponse.json(
        { error: 'Mask image is required for FLUX Fill model' },
        { status: 400 }
      );
    }

    // Validate URLs are properly formatted
    try {
      new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }

    try {
      new URL(maskImage);
    } catch {
      return NextResponse.json(
        { error: 'Invalid mask image URL format' },
        { status: 400 }
      );
    }
    

    // Prepare input for the FLUX Fill model (following official docs pattern)
    const input: {
      image: string;
      mask: string;
      prompt: string;
      num_inference_steps: number;
      guidance: number;
      num_outputs: number;
      megapixels: string;
      output_format: string;
      output_quality: number;
      lora_scale: number;
      disable_safety_checker: boolean;
      seed?: number;
      lora_weights?: string;
    } = {
      image: imageUrl,
      mask: maskImage,  // Required for FLUX Fill
      prompt: prompt,
      num_inference_steps: options.numInferenceSteps || 28,
      guidance: options.guidance || 50,
      num_outputs: options.numOutputs || 1,
      megapixels: options.megapixels || "1",
      output_format: options.outputFormat || "jpg",
      output_quality: options.outputQuality || 80,
      lora_scale: options.loraScale || 1,
      disable_safety_checker: options.disableSafetyChecker || false,
    };

    // Add optional seed for reproducible generation
    if (options.seed) {
      input.seed = options.seed;
    }

    // Add optional LoRA weights
    if (options.loraWeights) {
      input.lora_weights = options.loraWeights;
    }

    // Log the input for debugging
    console.log('FLUX Fill Input:', JSON.stringify(input, null, 2));

    // Run the FLUX Fill model using predictions.create() to get URLs
    console.log('Creating FLUX Fill prediction...');
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-fill-dev",
      input: input
    });

    console.log('Prediction created with ID:', prediction.id);
    console.log('Initial prediction status:', prediction.status);

    // Wait for the prediction to complete
    let completedPrediction = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes timeout (5 seconds * 60)

    while (completedPrediction.status === 'starting' || completedPrediction.status === 'processing') {
      if (attempts >= maxAttempts) {
        throw new Error('Prediction timed out after 5 minutes');
      }
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      completedPrediction = await replicate.predictions.get(prediction.id);
      attempts++;
      
      console.log(`Attempt ${attempts}: Status = ${completedPrediction.status}`);
    }

    if (completedPrediction.status === 'failed') {
      console.error('Prediction failed:', completedPrediction.error);
      throw new Error(`Prediction failed: ${completedPrediction.error || 'Unknown error'}`);
    }

    if (completedPrediction.status === 'canceled') {
      throw new Error('Prediction was canceled');
    }

    const output = completedPrediction.output;
    console.log('Raw Replicate output:', JSON.stringify(output, null, 2));
    console.log('Type of output:', typeof output);
    console.log('Is output an array?', Array.isArray(output));
    console.log('Output length:', Array.isArray(output) ? output.length : 'N/A');

    // Handle different possible output formats from Replicate
    let imageUrls: string[] = [];
    
    if (Array.isArray(output)) {
      // FLUX Fill typically returns array of URLs
      console.log('Processing array output...');
      imageUrls = output.filter(item => {
        if (typeof item === 'string' && item.startsWith('http')) {
          return true;
        }
        console.log('Non-URL item found:', typeof item, item);
        return false;
      });
      
      // If no direct URLs found, try to extract from objects
      if (imageUrls.length === 0) {
        console.log('No direct URLs found, checking for string items...');
        imageUrls = output.map((item, index) => {
          if (typeof item === 'string') {
            return item;
          }
          console.warn(`Output item ${index} is not a string:`, typeof item, item);
          return null;
        }).filter((url): url is string => url !== null);
      }
    } else if (output && typeof output === 'string') {
      // Single URL string
      console.log('Processing single string output...');
      imageUrls = [output];
    } else {
      console.error('Unexpected output format from Replicate:', output);
      throw new Error('Invalid output format from AI model');
    }

    console.log('Processed image URLs:', imageUrls);
    console.log('Number of valid URLs:', imageUrls.length);

    // Validate that we have at least one valid URL
    if (!imageUrls.length) {
      console.error('No image URLs generated. Raw output was:', output);
      throw new Error('No image URLs generated by the AI model');
    }

    // Validate URLs are properly formatted
    const validUrls = imageUrls.filter(url => {
      try {
        new URL(url);
        return url.startsWith('http');
      } catch {
        console.warn('Invalid URL found:', url);
        return false;
      }
    });

    if (!validUrls.length) {
      console.error('No valid URLs found. URLs were:', imageUrls);
      throw new Error('Generated URLs are not valid');
    }

    console.log('Final valid URLs:', validUrls);
    //validUrls is my output for now  .. 

    // //get the originalImageId >>>> 
    // const originalImage = await prisma.images.findFirst({
    //   where:{
    //     url:imageUrl
    //   },
    //   select:{
    //     id:true
    //   }
    // })

    // console.log("original Image Id : --- " ,originalImage) ;

    //  //adding the generated images to the user's collection
    //  if(validUrls.length > 0 && userId) {
    //    const data: any = {
    //      userId,
    //      imageUrl: validUrls[0], // Store the first generated image URL
    //    };
    //    if (originalImage?.id) {
    //      data.originalImageId = originalImage.id;
    //    }
    //    const collection = await prisma.aiGeneratedImage.create({
    //      data
    //    });
    //  }

    // Return the output in the same format as Replicate API
    return NextResponse.json({
      output: validUrls,
      status: "succeeded",
      id: completedPrediction.id,
      input: input,
      metadata: {
        prompt,
        imageUrl,
        maskImage,
        numOutputs: input.num_outputs,
        imageCount: validUrls.length,
        predictionId: completedPrediction.id,
        completedAt: completedPrediction.completed_at,
        totalTime: (completedPrediction.metrics as { total_time?: number })?.total_time || null,
        options: {
          numInferenceSteps: input.num_inference_steps,
          guidance: input.guidance,
          megapixels: input.megapixels,
          outputFormat: input.output_format,
          outputQuality: input.output_quality,
          loraScale: input.lora_scale,
          seed: input.seed || null,
          loraWeights: input.lora_weights || null,
          disableSafetyChecker: input.disable_safety_checker
        }
      }
    });

  } catch (error) {
    console.error('Error generating image with FLUX Fill:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

