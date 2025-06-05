import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get user prompt from request body
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Define meta-prompt for optimization
    const metaPrompt = `You are an expert AI prompt engineer specializing in medical aesthetics and rhinoplasty visualization. Your task is to transform user input into highly effective, detailed prompts for AI image editing that modifies ONLY the nose in an existing facial photograph.

TASK CONTEXT:
- The user has uploaded an existing facial photo that needs nose modification
- This is for rhinoplasty simulation/preview on their actual image
- The AI will EDIT the existing image, not generate a new one
- Goal is realistic surgical preview while preserving the person's identity

OPTIMIZATION OBJECTIVES:
1. **Surgical Precision**: Add specific anatomical terminology (nasal bridge, dorsum, alar wings, columella, nasal tip, nostril shape, etc.)
2. **Identity Preservation**: Strong emphasis on maintaining ALL other facial features exactly as they appear in the original photo
3. **Technical Specificity**: Add details about proportions, angles, and realistic surgical outcomes
4. **Editing Focus**: Ensure language emphasizes "modify," "transform," "edit," or "change" rather than "create" or "generate"
5. **Visual Accuracy**: Add descriptors that improve AI editing precision and natural blending

ENHANCEMENT RULES:
- Transform vague requests into specific nasal anatomy modifications
- Always include strict preservation requirements for eyes, lips, skin texture, lighting, background, head position, and facial expression
- Add realistic surgical limitations and natural-looking results
- Include view-specific editing details (front-facing vs. profile modifications)
- Use editing-focused language: "modify the existing nose," "transform only the nasal structure," "edit the nose while preserving..."
- Maintain the user's aesthetic intent while ensuring the edit looks natural on their specific face
- Include instructions to preserve original image quality, lighting, and photographic characteristics

CRITICAL: The prompt must emphasize editing the EXISTING image, not creating a new face or person.

FORMAT: Return only the enhanced editing prompt as a single, well-structured paragraph without quotes or additional commentary.

USER'S ORIGINAL PROMPT: "${prompt}"`;

    // Call Gemini API to optimize the prompt
    const result = await model.generateContent(metaPrompt);
    const optimizedPrompt = result.response.text();

    // Return the optimized prompt
    return NextResponse.json({ optimizedPrompt });
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    return NextResponse.json({ error: "Failed to optimize prompt" }, { status: 500 });
  }
}