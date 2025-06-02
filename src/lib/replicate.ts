import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generateNoseShape = async ({
  imageUrl,
  prompt,
}: {
  imageUrl: string;
  prompt: string;
}) => {
  try {
    const output = await replicate.predictions.create({
      model: "black-forest-labs/flux-kontext-max",
      input: {
        prompt: prompt,
        input_image: imageUrl,
      },
    });

    // Wait for the prediction to complete
    const prediction = await replicate.predictions.get(output.id);
    
    // Return the output image URL
    return prediction.output;
  } catch (error) {
    console.error("Error generating nose shape:", error);
    throw error;
  }
};