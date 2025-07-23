import { requireAuth } from "../auth-helper";
import { PrismaClient } from "@prisma/client";

const getImages = async () => {
    const user = await requireAuth();
    const prisma = new PrismaClient();

    try {
        const images = await prisma.images.findMany({
            where: {
                userId: user.id
            },
            select: {
                id: true,
                url: true,
                createdAt: true
            }
        });
        console.log(images);
        return images;
    } catch (error) {
        console.error("Error retrieving images:", error);
        throw new Error("Failed to retrieve images");
    } finally {
        await prisma.$disconnect();
    }
}

export default getImages;