import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 });
    }

    const metaPrompt = `
You are an AI prompt engineer specialized in rhinoplasty and nose editing on real photographs. Your goal is to craft a precise, clinically accurate prompt for an image-editing AI that modifies ONLY the nose while preserving all other facial features exactly as they are.

The user has provided the following request: "${prompt}"

INSTRUCTIONS:
- Begin the prompt by summarizing the requested nose change in clinical terms (e.g., "Refine the nasal tip", "Straighten the dorsal bridge").
- Detect if the user mentioned a viewing angle (e.g., "front view", "side view") and tailor the language accordingly.
- Use correct anatomical references (nasal dorsum, alar base, columella, etc.) wherever applicable.
- Add strong constraints to PRESERVE the person’s facial identity: MAINTAIN skin tone, eyes, jawline, eyebrows, lips, cheeks, lighting, facial expression, hair, and resolution.
- NEVER suggest full face generation or modification of other facial features.
- Use editing verbs like “adjust,” “modify only,” “refine,” or “reshape.”
- Keep the tone clinical, not artistic.

FINAL FORMAT:
Write a single paragraph prompt with no headers, quotes, markdown, or labels. It should be suitable for direct use in an image-editing API like flux-fill-dev.

Now generate the final editing prompt.
    `;

    const result = await model.generateContent(metaPrompt);
    let optimizedPrompt = result.response.text().trim();

    // Clean any markdown artifacts or quotation marks that Gemini may return
    optimizedPrompt = optimizedPrompt.replace(/^```([\s\S]*?)```$/g, '$1').replace(/^"+|"+$/g, '');

    return NextResponse.json({ optimizedPrompt });
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    return NextResponse.json({ error: "Failed to optimize prompt" }, { status: 500 });
  }
}
