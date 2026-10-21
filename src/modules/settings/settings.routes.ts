import { NextResponse } from "next/server";
import { settingsService } from "./settings.service";
import { validateSettingsUpdate } from "./settings.validation";

export const settingsRoutes = {
  async get() {
    try {
      const settings = await settingsService.get();

      return NextResponse.json({ data: settings });
    } catch (error) {
      console.error("Erro ao consultar configurações:", error);

      return NextResponse.json(
        { error: "Não foi possível consultar as configurações." },
        { status: 500 }
      );
    }
  },

  async update(body: unknown) {
    try {
      const input = validateSettingsUpdate(body);
      const settings = await settingsService.update(input);

      return NextResponse.json({
        message: "Configurações atualizadas com sucesso.",
        data: settings,
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        return NextResponse.json(
          { error: "Erro interno do servidor." },
          { status: 500 }
        );
      }

      const validationErrors = [
        "O corpo da requisição deve ser um objeto válido.",
        "Envie pelo menos um campo válido para atualizar.",
        "O custo da água deve ser um número não negativo.",
        "O custo da energia deve ser um número não negativo.",
        "A meta de duração deve ser um inteiro entre 1 e 120 minutos.",
      ];

      if (validationErrors.includes(error.message)) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      console.error("Erro ao atualizar configurações:", error);

      return NextResponse.json(
        { error: "Não foi possível atualizar as configurações." },
        { status: 500 }
      );
    }
  },
};