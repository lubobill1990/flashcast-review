-- AlterTable
ALTER TABLE "SampleOutput" RENAME CONSTRAINT "ExperimentSample_pkey" TO "SampleOutput_pkey";
ALTER TABLE "SampleOutput" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'created';

-- AlterTable
ALTER TABLE "SampleOutputEvaluation" RENAME CONSTRAINT "ExperimentSampleEvaluation_pkey" TO "SampleOutputEvaluation_pkey";

ALTER TABLE "SampleOutputEvaluation"
RENAME COLUMN "experimentSampleId" TO "sampleOutputId";
