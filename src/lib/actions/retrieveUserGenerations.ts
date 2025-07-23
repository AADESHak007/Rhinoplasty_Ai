import { requireAuth } from "../auth-helper";
import { PrismaClient } from "@prisma/client";

const getUserGenerations = async () => {
  const user = await requireAuth();
  const prisma = new PrismaClient();
  try {
    const generations = await prisma.aiGeneratedImage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        createdAt: true,
        description: true,
        nose_type: true,
        originalImage: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    // Map to flatten structure for frontend
    return generations.map((gen) => ({
      id: gen.id,
      aiImageUrl: gen.imageUrl,
      originalImageUrl: gen.originalImage?.url || null,
      createdAt: gen.createdAt,
      description: gen.description,
      nose_type: gen.nose_type,
    }));
  } catch (error) {
    console.error("Error retrieving user generations:", error);
    throw new Error("Failed to retrieve user generations");
  } finally {
    await prisma.$disconnect();
  }
};

export default getUserGenerations; 