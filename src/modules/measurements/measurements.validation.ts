export type MeasurementInput = {
  measuredAt?: string;
  flowRateLpm: number;
  totalVolumeLiters: number;
  powerWatts: number;
};

export type MeasurementBatchInput = {
  measurements: MeasurementInput[];
};

export function validateMeasurementBatch(
  input: unknown
): MeasurementBatchInput {
  if (
    typeof input !== "object" ||
    input === null ||
    !("measurements" in input) ||
    !Array.isArray(input.measurements)
  ) {
    throw new Error("O campo measurements deve ser uma lista.");
  }

  if (
    input.measurements.length === 0 ||
    input.measurements.length > 100
  ) {
    throw new Error(
      "Envie entre 1 e 100 medições por requisição."
    );
  }

  const measurements = input.measurements.map((item) => {
    if (typeof item !== "object" || item === null) {
      throw new Error("Cada medição deve ser um objeto válido.");
    }

    const measurement = item as Record<string, unknown>;

    const { measuredAt, flowRateLpm, totalVolumeLiters, powerWatts } =
      measurement;

    if (
      typeof flowRateLpm !== "number" ||
      !Number.isFinite(flowRateLpm) ||
      flowRateLpm < 0
    ) {
      throw new Error("A vazão deve ser um número não negativo.");
    }

    if (
      typeof totalVolumeLiters !== "number" ||
      !Number.isFinite(totalVolumeLiters) ||
      totalVolumeLiters < 0
    ) {
      throw new Error("O volume acumulado deve ser não negativo.");
    }

    if (
      typeof powerWatts !== "number" ||
      !Number.isInteger(powerWatts) ||
      powerWatts < 0
    ) {
      throw new Error("A potência deve ser um inteiro não negativo.");
    }

    if (
      measuredAt !== undefined &&
      (typeof measuredAt !== "string" ||
        Number.isNaN(Date.parse(measuredAt)))
    ) {
      throw new Error("A data da medição é inválida.");
    }

    return {
      ...(measuredAt !== undefined
        ? { measuredAt }
        : {}),
      flowRateLpm,
      totalVolumeLiters,
      powerWatts,
    };
  });

  return { measurements };
}