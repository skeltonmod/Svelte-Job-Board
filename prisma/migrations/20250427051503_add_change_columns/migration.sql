/*
  Warnings:

  - You are about to drop the column `isApproved` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `isExternal` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `isSpam` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'APPROVED', 'EXTERNAL', 'SPAM');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "isApproved",
DROP COLUMN "isExternal",
DROP COLUMN "isSpam",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "jobDescription" TEXT[],
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
