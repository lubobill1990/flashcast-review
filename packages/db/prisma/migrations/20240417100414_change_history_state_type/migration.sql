/*
  Warnings:

  - The `processStatusHistory` column on the `Experiment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Experiment" DROP COLUMN "processStatusHistory",
ADD COLUMN     "processStatusHistory" TEXT[];
