
export function validateFinishSession(input: unknown): {
  durationSeconds: number;
} {
  if (
    typeof input !== "object" ||
    input === null ||
    !("durationSeconds" in input)
  ) {
    throw new Error("Duração da sessão é obrigatória.");
  }

  const durationSeconds = input.durationSeconds;

  if (
    typeof durationSeconds !== "number" ||
    !Number.isInteger(durationSeconds) ||
    durationSeconds < 0
  ) {
    throw new Error("A duração deve ser um número inteiro não negativo.");
  }

  return { durationSeconds };
}
