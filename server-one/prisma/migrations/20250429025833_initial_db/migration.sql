/*
  Warnings:

  - You are about to drop the `Matrix` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Matrix";

-- CreateTable
CREATE TABLE "matrix" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "qMatrix" JSONB NOT NULL,
    "rMatrix" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matrix_pkey" PRIMARY KEY ("id")
);
