import { prisma } from "@/lib/prisma";
import type { MeasurementInput } from "./measurements.validation";

export const measurementsRepository = {
  createMany(sessionId: string, measurements: MeasurementInput[]) {
    return prisma.measurement.createMany({
      data: measurements.map((measurement) => ({
        sessionId,
        measuredAt: measurement.measuredAt
          ? new Date(measurement.measuredAt)
          : new Date(),
        flowRateLpm: measurement.flowRateLpm,
        totalVolumeLiters: measurement.totalVolumeLiters,
        powerWatts: measurement.powerWatts,
      })),
    });
  },
}