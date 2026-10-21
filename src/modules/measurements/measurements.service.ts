import { sessionsRepository } from "@/modules/sessions/sessions.repository";
import { measurementsRepository } from "./measurements.repository";
import type { MeasurementBatchInput } from "./measurements.validation";

export const measurementsService = {
  async createBatch(sessionId: string, input: MeasurementBatchInput) {
    const session = await sessionsRepository.findById(sessionId);

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    if (session.status !== "IN_PROGRESS") {
      throw new Error(
        "Não é possível registrar medições em uma sessão finalizada."
      );
    }

    const lastMeasurement = session.measurements.at(-1);

    let previousVolume = lastMeasurement?.totalVolumeLiters ?? 0;
    let previousDate = lastMeasurement?.measuredAt ?? session.startedAt;

    for (const measurement of input.measurements) {
      const measuredAt = measurement.measuredAt
        ? new Date(measurement.measuredAt)
        : new Date();

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

    return measurementsRepository.createMany(
      sessionId,
      input.measurements
    );
  },
};