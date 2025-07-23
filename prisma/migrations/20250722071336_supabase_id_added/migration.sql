/*
  Warnings:

  - A unique constraint covering the columns `[supabaseUid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "supabaseUid" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseUid_key" ON "User"("supabaseUid");
