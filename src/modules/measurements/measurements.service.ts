import { measurementsRepository } from "./measurements.repository";
import type { MeasurementBatchInput } from "./measurements.validation";

export const measurementsService = {
  async createBatch(sessionId: string, input: MeasurementBatchInput) {
    return measurementsRepository.withLockedSession(
      sessionId,
      async (transaction) => {
        const session = await transaction.session.findUnique({
          where: { id: sessionId },
          include: {
            measurements: {
              orderBy: {
                measuredAt: "asc",
              },
            },
          },
        });

        if (!session) {
          throw new Error("Sessão não encontrada.");
        }

        if (session.status !== "IN_PROGRESS") {
          throw new Error(
            "Não é possível registrar medições em uma sessão finalizada."
          );
        }

        const normalizedMeasurements = input.measurements.map(
          (measurement) => ({
            ...measurement,
            measuredAt: measurement.measuredAt
              ? new Date(measurement.measuredAt).toISOString()
              : new Date().toISOString(),
          })
        );

        const lastMeasurement = session.measurements.at(-1);

        let previousVolume = lastMeasurement?.totalVolumeLiters ?? 0;
        let previousDate = lastMeasurement?.measuredAt ?? session.startedAt;

        for (const measurement of normalizedMeasurements) {
          const measuredAt = new Date(measurement.measuredAt);

          if (measurement.totalVolumeLiters < previousVolume) {
            throw new Error("O volume acumulado não pode diminuir.");
          }

          if (measuredAt < previousDate) {
            throw new Error(
              "As medições devem estar em ordem cronológica."
            );
          }

          previousVolume = measurement.totalVolumeLiters;
          previousDate = measuredAt;
        }

        const allMeasurements = [
          ...session.measurements,
          ...normalizedMeasurements.map((measurement) => ({
            ...measurement,
            measuredAt: new Date(measurement.measuredAt),
          })),
        ];

        let energyKwh = 0;

        for (
          let index = 1;
          index < allMeasurements.length;
          index++
        ) {
          const previous = allMeasurements[index - 1];
          const current = allMeasurements[index];

          const elapsedSeconds =
            (current.measuredAt.getTime() -
              previous.measuredAt.getTime()) /
            1000;

          if (elapsedSeconds > 0) {
            energyKwh +=
              (previous.powerWatts * elapsedSeconds) / 3_600_000;
          }
        }

        const totalWaterLiters =
          allMeasurements.length > 0
            ? allMeasurements[allMeasurements.length - 1]
                .totalVolumeLiters
            : 0;

        const result = await transaction.measurement.createMany({
          data: normalizedMeasurements.map((measurement) => ({
            sessionId,
            measuredAt: new Date(measurement.measuredAt),
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

        return {
          count: result.count,
          totalWaterLiters,
          energyKwh,
        };
      }
    );
  },
};