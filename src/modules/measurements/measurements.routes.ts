import { NextResponse } from "next/server";
import { measurementsService } from "./measurements.service";
import { validateMeasurementBatch } from "./measurements.validation";

export const measurementsRoutes = {
  async createBatch(sessionId: string, body: unknown) {
    try {
      const input = validateMeasurementBatch(body);
      const result = await measurementsService.createBatch(
        sessionId,
        input
      );

      return NextResponse.json(
        {
          message: "Medições registradas com sucesso.",
          data: result,
        },
        { status: 201 }
      );
    } catch (error) {
      if (!(error instanceof Error)) {
        return NextResponse.json(
          { error: "Erro interno do servidor." },
          { status: 500 }
        );
      }

      if (error.message === "Sessão não encontrada.") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      if (
        error.message ===
        "Não é possível registrar medições em uma sessão finalizada."
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }

      const validationErrors = [
        "O campo measurements deve ser uma lista.",
        "Envie entre 1 e 100 medições por requisição.",
        "Cada medição deve ser um objeto válido.",
        "A vazão deve ser um número não negativo.",
        "O volume acumulado deve ser não negativo.",
        "A potência deve ser um inteiro não negativo.",
        "A data da medição é inválida.",
        "O volume acumulado não pode diminuir.",
        "As medições devem estar em ordem cronológica.",
      ];

      if (validationErrors.includes(error.message)) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Não foi possível registrar as medições." },
        { status: 500 }
      );
    }
  },
};