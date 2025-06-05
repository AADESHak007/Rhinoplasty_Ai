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
    const metaPrompt = `You are an expert AI prompt engineer specializing in medical aesthetics and rhinoplasty visualization. Your task is to generate precise, clinically accurate prompts that guide an image-editing AI to simulate realistic nose transformations on an EXISTING facial photograph.

USER CONTEXT:
- The user provides a short input describing the desired nose shape and may specify either "front view" or "side view".
- The uploaded image is a real person’s face, and the prompt is intended for surgical simulation purposes.
- You must preserve the user’s original instructions and reflect them in the final prompt while transforming ONLY the nose.

OBJECTIVES:
1. **Preserve User Intent**: Analyze the input prompt and explicitly retain the original style/goal, including any keywords about nose type or aesthetic target (e.g., sharp tip, curved bridge, narrower nostrils).
2. **Recognize View Angle**: If the user mentions “front view” or “side view,” you MUST include that in the final prompt and adapt the language to suit that perspective.
3. **Surgical Editing Focus**: Use anatomical terms (nasal bridge, alar base, columella, nasal dorsum, nasal tip, nostrils, etc.) and precise surgical language.
4. **Strict Identity Preservation**: Specify that all facial features (eyes, eyebrows, lips, cheeks, skin tone, chin, jawline, hair, facial expression) MUST remain exactly as they are in the original image.
5. **Photographic Consistency**: Emphasize that the lighting, shadows, image resolution, and head position must not be altered.
6. **Use Editing Verbs**: Always use “modify only,” “transform only,” “adjust,” or “change only the nose.” NEVER use “create” or “generate.”

STYLE INSTRUCTIONS:
- The prompt should be a single, well-structured paragraph.
- Start with the nose transformation, followed by a detailed list of preserved facial and photographic elements.
- Use capitalized keywords for constraints: CRITICAL, PRESERVE, MAINTAIN.
- Ensure the tone is direct, clinical, and optimized for AI image editing precision.
- Avoid artistic or creative phrasing—this is a medically realistic enhancement, not art generation.

CRITICAL: You must generate an editing prompt for a nose transformation on a real person’s photo. Do NOT describe or imply face generation or replacement. Only the nose should be edited.

FORMAT: Return the final editing prompt as a single paragraph, with NO quotes, no comments, and no markdown.

USER’S ORIGINAL INSTRUCTION: "\${prompt}"`;


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