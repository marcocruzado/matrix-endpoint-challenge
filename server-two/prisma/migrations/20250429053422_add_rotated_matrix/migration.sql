/*
  Warnings:

  - Added the required column `rotated` to the `matrix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matrix" ADD COLUMN "rotated" JSONB;
UPDATE "matrix" SET "rotated" = "original";
ALTER TABLE "matrix" ALTER COLUMN "rotated" SET NOT NULL;
