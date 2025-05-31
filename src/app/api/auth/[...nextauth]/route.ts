import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions) ;

export { handler as GET, handler as POST };
// This exports the NextAuth handler for both GET and POST requests, allowing it to handle authentication requests.