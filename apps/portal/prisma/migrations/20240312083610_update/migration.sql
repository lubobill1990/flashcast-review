/*
  Warnings:

  - You are about to drop the column `experimentSampleId` on the `Clip` table. All the data in the column will be lost.
  - You are about to drop the `ExperimentSample` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperimentSampleEvaluation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sampleOutputId` to the `Clip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterForeignKey
ALTER TABLE "Clip" RENAME CONSTRAINT "Clip_experimentSampleId_fkey" TO "Clip_sampleOutputId_fkey";

-- AlterForeignKey
ALTER TABLE "ExperimentSample" RENAME CONSTRAINT "ExperimentSample_experimentId_fkey" TO "SampleOutput_experimentId_fkey";

-- AlterForeignKey
ALTER TABLE "ExperimentSample" RENAME CONSTRAINT "ExperimentSample_sampleId_fkey" TO "SampleOutput_sampleId_fkey";

-- AlterForeignKey
ALTER TABLE "ExperimentSampleEvaluation" RENAME CONSTRAINT "ExperimentSampleEvaluation_experimentSampleId_fkey" TO "SampleOutputEvaluation_sampleOutputId_fkey";

-- AlterForeignKey
ALTER TABLE "ExperimentSampleEvaluation" RENAME CONSTRAINT "ExperimentSampleEvaluation_userId_fkey" TO "SampleOutputEvaluation_userId_fkey";

-- AlterTable
ALTER TABLE "Clip" RENAME COLUMN "experimentSampleId" TO "sampleOutputId";

-- Alter table name
ALTER TABLE "ExperimentSample" RENAME TO "SampleOutput";

-- Alter table name
ALTER TABLE "ExperimentSampleEvaluation" RENAME TO "SampleOutputEvaluation";
