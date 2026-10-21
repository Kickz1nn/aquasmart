-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "totalWaterLiters" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "energyKwh" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flowRateLpm" DOUBLE PRECISION NOT NULL,
    "totalVolumeLiters" DOUBLE PRECISION NOT NULL,
    "powerWatts" INTEGER NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "waterCostPerM3" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "energyCostPerKwh" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "waterUnit" TEXT NOT NULL DEFAULT 'L',
    "energyUnit" TEXT NOT NULL DEFAULT 'kWh',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Measurement_sessionId_measuredAt_idx" ON "Measurement"("sessionId", "measuredAt");

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
