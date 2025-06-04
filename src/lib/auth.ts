import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

const prisma = new PrismaClient() ;

export const authOptions = {
    providers :[
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // Existing Credentials Provider
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email: {label:"Email", type:"text", placeholder:"user@email.com"},
                password: {label:"Password", type:"password", placeholder:"password here"},
                name: {label:"Name", type:"text", placeholder:"John Doe"}
            },
            async authorize(
                credentials: Record<"name" | "email" | "password", string> | undefined
            ): Promise<{ id: string; email: string; name: string } | null> {
                if (!credentials) return null;
                const { email, password, name } = credentials;
                if (!email || !password || !name) {
                    throw new Error("Email, password, and name are required");
                }

                //find existing user .. 
                const userExists = await prisma.user.findUnique({
                    where: { email }
                });
               
                //validate the user's password
                if (userExists && userExists.password) {
                    const isValid = await bcrypt.compare(password, userExists.password);
                    if (isValid) {
                        return {
                            id: userExists.id,
                            email: userExists.email,
                            name: userExists.name
                        };
                    }
                }
                //if user does not exist, create a new user
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                    }
                });
                return {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name
                };
            }
        }),
    ],
    secret:process.env.NEXTAUTH_SECRET ||"default_secret",
    pages: {
      signIn: '/auth/signin',
    },
    
    //to manage sessions ..
    callbacks:{
        async jwt({ token, user, account }: { token: JWT; user?: User; account?: { provider?: string } | null }) {
            // If this is the first time the JWT is created (user is present)
            if (user) {
                token.userId = user.id;
            }
            // For Google OAuth, find the user ID from the database
            if (account?.provider === 'google' && user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email }
                });
                if (dbUser) {
                    token.userId = dbUser.id;
                }
            }
            return token;
        },
             
        async session({ session, token }: { session: Session; token: JWT  }) {
            if (token.userId) {
                session.user.id = token.userId as string;
            }
            return session ;
        },
        
        // OAuth sign-in callback for Google and other providers
        async signIn({ user, account }: { user: User; account: { provider?: string } | null }) {
            if (account?.provider === 'google' && user.email) {
                const existingUser = await prisma.user.findUnique({
                    where:{
                        email: user.email
                    }
                })
                if (existingUser) {
                    return true; // User exists, allow sign-in
                } else {
                    // If user does not exist, create a new user
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name || "New User",
                            password: "", // Password is not required for OAuth users
                        }
                    });
                    return true; // Allow sign-in after creating the user
                }
            }
            return true; // Allow sign-in for other providers/methods
        }
    }
}