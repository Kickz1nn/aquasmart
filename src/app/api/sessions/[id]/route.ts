
import { NextResponse } from "next/server";
import { sessionsService } from "@/modules/sessions/sessions.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  try {
    const session = await sessionsService.getById(id);

    return NextResponse.json({ data: session });
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

    return NextResponse.json(
      { error: "Não foi possível consultar a sessão." },
      { status: 500 }
    );
  }
}
