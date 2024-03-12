-- AlterTable
ALTER TABLE "ClipEvaluation" RENAME CONSTRAINT "ClipReview_pkey" TO "ClipEvaluation_pkey";

-- AlterTable
ALTER TABLE "ExperimentSampleEvaluation" RENAME CONSTRAINT "ExperimentSampleReview_pkey" TO "ExperimentSampleEvaluation_pkey";

-- RenameForeignKey
ALTER TABLE "ClipEvaluation" RENAME CONSTRAINT "ClipReview_clipId_fkey" TO "ClipEvaluation_clipId_fkey";

-- RenameForeignKey
ALTER TABLE "ClipEvaluation" RENAME CONSTRAINT "ClipReview_userId_fkey" TO "ClipEvaluation_userId_fkey";

-- RenameForeignKey
ALTER TABLE "ExperimentSampleEvaluation" RENAME CONSTRAINT "ExperimentSampleReview_experimentSampleId_fkey" TO "ExperimentSampleEvaluation_experimentSampleId_fkey";

-- RenameForeignKey
ALTER TABLE "ExperimentSampleEvaluation" RENAME CONSTRAINT "ExperimentSampleReview_userId_fkey" TO "ExperimentSampleEvaluation_userId_fkey";
