-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('FREE', 'PLUS', 'PRO', 'TEST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tier" "Tier" NOT NULL DEFAULT 'FREE';
