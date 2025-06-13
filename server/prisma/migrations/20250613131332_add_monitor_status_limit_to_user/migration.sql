-- AlterTable
ALTER TABLE "User" ADD COLUMN     "monitorLimit" INTEGER DEFAULT 10,
ADD COLUMN     "statusPageLimit" INTEGER DEFAULT 1;
