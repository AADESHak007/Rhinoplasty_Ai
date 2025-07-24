import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helper";

export async function GET() {
  try {
    const user = await requireAuth();

    // Get user with current generation count and tier
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        aiGenerationCount: true,
        tier: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { aiGenerationCount, tier } = userData;
    
    // Define limits based on tier
    const limits: Record<string, number> = {
      FREE: 3,
      PLUS: 50,
      PRO: 200,
      TEST: 999
    };

    const currentLimit = limits[tier] || limits.FREE;
    const canGenerate = aiGenerationCount < currentLimit;
    const remainingGenerations = Math.max(0, currentLimit - aiGenerationCount);

    return NextResponse.json({
      canGenerate,
      currentCount: aiGenerationCount,
      limit: currentLimit,
      remaining: remainingGenerations,
      tier,
      needsUpgrade: !canGenerate
    });

  } catch (error) {
    console.error("Check generation limit error:", error);
    
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json(
          {
            error: "User not authenticated"
          },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 