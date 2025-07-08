import { NextResponse } from "next/server";
import getUserGenerations from "@/lib/actions/retrieveUserGenerations";

export async function GET() {
  try {
    const generations = await getUserGenerations();
    return NextResponse.json({ generations }, { status: 200 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string" &&
      (error as { message: string }).message.toLowerCase().includes("unauthorized")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
} 