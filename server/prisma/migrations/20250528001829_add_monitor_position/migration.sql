/*
  Warnings:

  - Added the required column `position` to the `StatusPageMonitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatusPageMonitor" ADD COLUMN     "position" INTEGER NOT NULL;
