/*
  Warnings:

  - You are about to drop the `SampleOnExperiment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `samples` to the `Experiment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SampleOnExperiment" DROP CONSTRAINT "SampleOnExperiment_experimentId_fkey";

-- DropForeignKey
ALTER TABLE "SampleOnExperiment" DROP CONSTRAINT "SampleOnExperiment_sampleId_fkey";

-- AlterTable
ALTER TABLE "Experiment" ADD COLUMN     "samples" JSONB NOT NULL DEFAULT '[]';

-- DropTable
DROP TABLE "SampleOnExperiment";
