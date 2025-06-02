import { uploadImageByUrl } from "@/lib/actions/uploadImgbyUrl";
import { generateNoseShape } from "@/lib/replicate";
import { NextRequest, NextResponse } from "next/server";

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

        // Getting the body of the request
        const { originalImgUrl, presetNose, userId } = await req.json();

        // Checking if the body is empty
        if (!originalImgUrl || !presetNose || !userId) {
            return NextResponse.json(
                { msg: "Please provide all the required fields" },
                { status: 400 }
            );
        }

        // Create a prompt
        const prompt = `Create a nose shape that is ${presetNose} based on the image provided.`;

        // Send the image and prompt to the replicate function
        const generatedImageUrl = await generateNoseShape({
            imageUrl: originalImgUrl,
            prompt: prompt,
        });

        // if (!generatedImageUrl) {
        //     return NextResponse.json(
        //         { msg: "Failed to generate the nose shape. Please try again later." },
        //         { status: 500 }
        //     );
        // }

        // Upload the new image to cloud
        const uploadResUrl = await uploadImageByUrl(generatedImageUrl);

        // Store the imageURL in the db
        // const aiGeneratedImage = await prisma.aiGeneratedImage.create({
        //     data: {
        //         imageUrl: uploadResUrl,
        //         userId,
        //         description: presetNose,
        //     },
        // });

        // Return the new image URL in the response
        return NextResponse.json(
            {
                msg: "Nose shape generated successfully",
                imageUrl: uploadResUrl,
                // aiGeneratedImage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in preset nose generation:", error);
        return NextResponse.json(
            { msg: "An error occurred while generating the nose shape" },
            { status: 500 }
        );
    }
} 