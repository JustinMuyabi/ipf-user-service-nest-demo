-- CreateTable
CREATE TABLE "SeedingHistory" (
    "id" SERIAL NOT NULL,
    "seed" BOOLEAN NOT NULL DEFAULT false,
    "seedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedingHistory_pkey" PRIMARY KEY ("id")
);
