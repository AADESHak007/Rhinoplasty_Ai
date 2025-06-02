/*
  Warnings:

  - Added the required column `originalImageId` to the `AiGeneratedImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiGeneratedImage" ADD COLUMN     "originalImageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AiGeneratedImage" ADD CONSTRAINT "AiGeneratedImage_originalImageId_fkey" FOREIGN KEY ("originalImageId") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
