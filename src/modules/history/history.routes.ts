import { NextResponse } from "next/server";
import { historyService } from "./history.service";

export const historyRoutes = {
  async getAll() {
    try {
      const data = await historyService.getAll();

      return NextResponse.json({ data });
    } catch (error) {
      console.error("Erro ao consultar histórico:", error);

      return NextResponse.json(
        { error: "Não foi possível consultar o histórico." },
        { status: 500 }
      );
    }
  },

  async getById(id: string) {
    try {
      const data = await historyService.getById(id);

      return NextResponse.json({ data });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Sessão não encontrada."
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      if (
        error instanceof Error &&
        error.message === "Essa sessão ainda não foi finalizada."
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }

      console.error("Erro ao consultar sessão do histórico:", error);

      return NextResponse.json(
        { error: "Não foi possível consultar a sessão." },
        { status: 500 }
      );
    }
  },
};