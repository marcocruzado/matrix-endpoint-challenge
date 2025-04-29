-- CreateTable
CREATE TABLE "matrix_stats" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "rotated" JSONB NOT NULL,
    "qMatrix" JSONB NOT NULL,
    "rMatrix" JSONB NOT NULL,
    "maxValue" DOUBLE PRECISION NOT NULL,
    "minValue" DOUBLE PRECISION NOT NULL,
    "average" DOUBLE PRECISION NOT NULL,
    "totalSum" DOUBLE PRECISION NOT NULL,
    "isDiagonal" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matrix_stats_pkey" PRIMARY KEY ("id")
);
