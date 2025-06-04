import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth"
import { PrismaClient } from "@prisma/client";


const getImages = async()=>{
    //@ts-expect-error NextAuth v4 compatibility issue with App Router types

    const session =  await getServerSession(authOptions) ;
    if (!session || !session.user?.email) {
        throw new Error("Unauthorized , Please login to access images");
    }
    //@ts-expect-error NextAuth v4 compatibility issue with App Router types
    const userId = session.user.id; 
    const prisma = new PrismaClient() ;

    try {
        const images = await prisma.images.findMany({
            where:{
                userId: userId
            },
            select:{
                id: true,
                url: true,
                createdAt: true
            }
        })
        console.log(images) ;
        return images ;
    } catch (error) {
        console.error("Error retrieving images:", error);
        throw new Error("Failed to retrieve images");
        
    }
}

export default getImages;