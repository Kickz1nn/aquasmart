
import { NextResponse } from "next/server";
import { sessionsService } from "@/modules/sessions/sessions.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  try {
    const session = await sessionsService.finish(id);

    return NextResponse.json({ data: session });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Sessão não encontrada.") {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }

      if (error.message === "Essa sessão já foi finalizada.") {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Não foi possível finalizar a sessão." },
      { status: 500 }
    );
  }
}
