import { NextRequest, NextResponse } from "next/server";
import { Client, handle_file } from "@gradio/client";

let maskClient: Client | null = null;

async function getMaskClient() {
  if (!maskClient) {
    const token = process.env.HUGGINGFACE_TOKEN;
    if (!token) throw new Error("HUGGINGFACE_TOKEN env var is missing");
    const formattedToken = token.startsWith("hf_") ? token : `hf_${token}`;
    maskClient = await Client.connect("Shanks07/fast-api", {
      hf_token: formattedToken as `hf_${string}`,
    });
  }
  return maskClient;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || typeof file === "string") {
      return NextResponse.json({ msg: "No valid file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = new Blob([buffer], { type: file.type });

    const client = await getMaskClient();
    const result = await client.predict("/predict", {
      image: handle_file(blob),
    });

    let outputImageUrl: string | null = null;
    if (result?.data && typeof result.data === "object") {
      if (Array.isArray(result.data)) {
        outputImageUrl = result.data[0]?.url || null;
      } else {
        outputImageUrl = (result.data as { url?: string })?.url || null;
      }
    }

    if (!outputImageUrl) {
      throw new Error("No image URL returned from Hugging Face Space");
    }

    return NextResponse.json({
      status: "success",
      originalUrl: "", // You can upload the original to cloud and send here too
      maskUrl: outputImageUrl,
    });

  } catch (error: unknown) {
    console.error("Upload/mask generation failed:", error);
    return NextResponse.json({
      status: "error",
      msg: "Failed to generate nose mask image",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
