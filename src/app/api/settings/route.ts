import { settingsRoutes } from "@/modules/settings/settings.routes";

export async function GET() {
  return settingsRoutes.get();
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    return settingsRoutes.update(body);
  } catch {
    return Response.json(
      { error: "O corpo da requisição contém JSON inválido." },
      { status: 400 }
    );
  }
}