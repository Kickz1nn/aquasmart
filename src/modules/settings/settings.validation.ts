export type UpdateSettingsInput = {
  waterCostPerM3?: number;
  energyCostPerKwh?: number;
  targetDurationMinutes?: number;
};

export function validateSettingsUpdate(
  input: unknown
): UpdateSettingsInput {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input)
  ) {
    throw new Error("O corpo da requisição deve ser um objeto válido.");
  }

  const data = input as Record<string, unknown>;
  const allowedFields = [
    "waterCostPerM3",
    "energyCostPerKwh",
    "targetDurationMinutes",
  ];

  const fields = Object.keys(data);

  if (
    fields.length === 0 ||
    fields.some((field) => !allowedFields.includes(field))
  ) {
    throw new Error("Envie pelo menos um campo válido para atualizar.");
  }

  const result: UpdateSettingsInput = {};

  if ("waterCostPerM3" in data) {
    if (
      typeof data.waterCostPerM3 !== "number" ||
      !Number.isFinite(data.waterCostPerM3) ||
      data.waterCostPerM3 < 0
    ) {
      throw new Error("O custo da água deve ser um número não negativo.");
    }

    result.waterCostPerM3 = data.waterCostPerM3;
  }

  if ("energyCostPerKwh" in data) {
    if (
      typeof data.energyCostPerKwh !== "number" ||
      !Number.isFinite(data.energyCostPerKwh) ||
      data.energyCostPerKwh < 0
    ) {
      throw new Error("O custo da energia deve ser um número não negativo.");
    }

    result.energyCostPerKwh = data.energyCostPerKwh;
  }

  if ("targetDurationMinutes" in data) {
    if (
      typeof data.targetDurationMinutes !== "number" ||
      !Number.isInteger(data.targetDurationMinutes) ||
      data.targetDurationMinutes < 1 ||
      data.targetDurationMinutes > 120
    ) {
      throw new Error("A meta de duração deve ser um inteiro entre 1 e 120 minutos.");
    }

    result.targetDurationMinutes = data.targetDurationMinutes;
  }

  return result;
}