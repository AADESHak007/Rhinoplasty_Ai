import { requireAuth } from "../auth-helper";
import { prisma } from "../prisma";

const getImages = async () => {
    const user = await requireAuth();

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
        return images;
    } catch (error) {
        console.error("Error retrieving images:", error);
        throw new Error("Failed to retrieve images");
    }
}

export default getImages;