/*
  Warnings:

  - The required column `jwt_secret` was added to the `SampleOutput` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SampleOutput" ADD COLUMN     "jwt_secret" TEXT NOT NULL;
