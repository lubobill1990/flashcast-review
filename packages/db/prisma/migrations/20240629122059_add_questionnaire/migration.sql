-- AlterTable
ALTER TABLE "ClipEvaluation" ADD COLUMN     "data" JSONB,
ALTER COLUMN "score" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SampleOutputEvaluation" ADD COLUMN     "data" JSONB,
ALTER COLUMN "score" DROP NOT NULL;
