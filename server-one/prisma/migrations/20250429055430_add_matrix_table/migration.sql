-- CreateTable
CREATE TABLE "matrix" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "rotated" JSONB NOT NULL,
    "qMatrix" JSONB NOT NULL,
    "rMatrix" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matrix_pkey" PRIMARY KEY ("id")
); 