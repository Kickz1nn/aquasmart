import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { MeasurementInput } from "./measurements.validation";

export const measurementsRepository = {
  withLockedSession<T>(
    sessionId: string,
    operation: (transaction: Prisma.TransactionClient) => Promise<T>
  ) {
    return prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw`
        SELECT "id"
        FROM "Session"
        WHERE "id" = ${sessionId}
        FOR UPDATE
      `;

      return operation(transaction);
    });
  },

  createBatchAndUpdateTotals(
    sessionId: string,
    measurements: MeasurementInput[],
    totalWaterLiters: number,
    energyKwh: number
  ) {
    return prisma.$transaction(async (transaction) => {
      const result = await transaction.measurement.createMany({
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

      await transaction.session.update({
        where: { id: sessionId },
        data: {
          totalWaterLiters,
          energyKwh,
        },
      });

      return result;
    });
  },
};