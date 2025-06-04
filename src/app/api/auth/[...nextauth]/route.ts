// route.ts (inside /api/auth/[...nextauth]/)
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";
//@ts-expect-error NextAuth v4 compatibility issue with App Router types

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
