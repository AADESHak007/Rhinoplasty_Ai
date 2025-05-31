
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient() ;

export const authOptions = {
    providers :[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email: {label:"Email", type:"text", placeholder:"user@email.com"},
                password: {label:"Password", type:"password", placeholder:"password here"},
                name: {label:"Name", type:"text", placeholder:"John Doe"}
            },
            async authorize(
                credentials: Record<"name" | "email" | "password", string> | undefined
            ): Promise<{ id: any; email: any; name: any } | null> {
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
    secret:process.env.JWT_SECRET ||"default_secret",
    
    //to manage sessions ..
    callbacks:{
        async session({ session, token }: any) {
            session.user.id = token.sub;
            return session ;
        },
        
        
        //Uncomment this to enable ----- OAuth sign-in --- 
        
        
        
        
        
        
        // async signIn({ user, account, profile }: any) {

        //     const existingUser = await prisma.user.findUnique({
        //         where:{
        //             email: user.email
        //         }
        //     }) ;
        //     if (existingUser) {
        //         return true; // User exists, allow sign-in
        //     } else {
        //         // If user does not exist, create a new user
        //         await prisma.user.create({
        //             data: {
        //                 email: user.email,
        //                 name: user.name || "New User",
        //                 password: "", // Password is not required for OAuth users
        //             }
        //         });
        //         return true; // Allow sign-in after creating the user
        //     }

        // }
    }
}