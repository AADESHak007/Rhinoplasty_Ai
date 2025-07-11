import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserGenerations = async () => {
  //@ts-expect-error NextAuth v4 compatibility issue with App Router types
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized. Please login to access your generations.");
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    throw new Error("User not found.");
  }
  const userId = user.id;
  try {
    const generations = await prisma.aiGeneratedImage.findMany({
      where: { userId },
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
  }
};

export default getUserGenerations; 