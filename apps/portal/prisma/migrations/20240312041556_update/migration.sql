-- AlterTable
-- First RENAME COLUMN operation
ALTER TABLE "Experiment"
RENAME COLUMN "runStatus" TO "processStatus";

-- Second RENAME COLUMN operation
ALTER TABLE "Experiment"
RENAME COLUMN "isReadyForReview" TO "isReadyForEvaluation";

-- ADD COLUMN operation
ALTER TABLE "Experiment"
ADD COLUMN "processStatusHistory" JSONB NOT NULL DEFAULT '[]';

-- RENAME TABLE operations
ALTER TABLE "ClipReview"
RENAME TO "ClipEvaluation";

ALTER TABLE "ExperimentSampleReview"
RENAME TO "ExperimentSampleEvaluation";
