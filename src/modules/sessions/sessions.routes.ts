import { NextResponse } from "next/server";
import { sessionsService } from "./sessions.service";

export const sessionsRoutes = {
  async start() {
    try {
      const session = await sessionsService.start();

      return NextResponse.json({ data: session }, { status: 201 });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Já existe um banho em andamento."
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Não foi possível iniciar o banho." },
        { status: 500 }
      );
    }
  },

  async getActive() {
    try {
      const session = await sessionsService.getActive();

      return NextResponse.json({ data: session });
    } catch {
      return NextResponse.json(
        { error: "Não foi possível consultar a sessão ativa." },
        { status: 500 }
      );
    }
  },

  async getAll() {
    try {
      const sessions = await sessionsService.getAll();

      return NextResponse.json({ data: sessions });
    } catch {
      return NextResponse.json(
        { error: "Não foi possível consultar o histórico." },
        { status: 500 }
      );
    }
  },
};