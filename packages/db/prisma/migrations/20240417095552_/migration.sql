/*
  Warnings:

  - The `samples` column on the `Experiment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Experiment" DROP COLUMN "samples",
ADD COLUMN     "samples" INTEGER[];
