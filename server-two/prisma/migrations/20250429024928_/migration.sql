-- CreateTable
CREATE TABLE "Matrix" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "qMatrix" JSONB NOT NULL,
    "rMatrix" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matrix_pkey" PRIMARY KEY ("id")
);
