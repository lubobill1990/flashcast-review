/*
  Warnings:

  - You are about to drop the column `samples` on the `Experiment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Experiment" DROP COLUMN "samples";

-- CreateTable
CREATE TABLE "SampleOnExperiment" (
    "experimentId" INTEGER NOT NULL,
    "sampleId" INTEGER NOT NULL,

    CONSTRAINT "SampleOnExperiment_pkey" PRIMARY KEY ("experimentId","sampleId")
);

-- AddForeignKey
ALTER TABLE "SampleOnExperiment" ADD CONSTRAINT "SampleOnExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleOnExperiment" ADD CONSTRAINT "SampleOnExperiment_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
