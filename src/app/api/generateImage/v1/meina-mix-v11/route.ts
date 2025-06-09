import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

interface ReplicateInput {
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  strength: number;
  scheduler: string;
  use_karras_sigmas: boolean;
  seed?: number;
  image?: string;
  mask?: string;
}

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, prompt, maskingImage, ...options } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Prepare input for the Replicate model
    const input: ReplicateInput = {
      prompt: prompt,
      negative_prompt: options.negativePrompt || "(worst quality:1.6, low quality:1.6), (zombie, sketch, interlocked fingers, comic)",
      width: options.width || 512,
      height: options.height || 728,
      num_inference_steps: options.numInferenceSteps || 20,
      guidance_scale: options.guidanceScale || 7.5,
      strength: options.strength || 1,
      scheduler: options.scheduler || "K_EULER_ANCESTRAL",
      use_karras_sigmas: options.useKarrasSigmas || false,
    };

    // Add seed if provided
    if (options.seed) {
      input.seed = options.seed;
    }

    // Add image for img2img or inpainting mode
    if (imageUrl) {
      input.image = imageUrl;
    }

    // Add mask for inpainting mode
    if (maskingImage) {
      input.mask = maskingImage;
    }

    // Run the Replicate model
    const output = await replicate.run(
      "asiryan/meina-mix-v11:f0eba373c70464e12e48defa5520bef59f727018779afb9c5b6bddb80523a8f7",
      { input }
    );

    return NextResponse.json({
      success: true,
      imageUrl: output,
      metadata: {
        prompt,
        imageUrl: imageUrl || null,
        maskingImage: maskingImage || null,
        options: input
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Image generation API is running',
    model: 'asiryan/meina-mix-v11'
  });
}