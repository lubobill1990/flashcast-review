/*
  Warnings:

  - You are about to drop the column `data` on the `ClipEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `SampleOutputEvaluation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "clipUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ClipEvaluation" DROP COLUMN "data";

-- AlterTable
ALTER TABLE "Sample" ADD COLUMN     "recordingVideoUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "transcriptionFileUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SampleOutputEvaluation" DROP COLUMN "data";
