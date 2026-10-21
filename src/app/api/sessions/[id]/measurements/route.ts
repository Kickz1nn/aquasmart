import { measurementsRoutes } from "@/modules/measurements/measurements.routes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  try {
    const body = await request.json();

    return measurementsRoutes.createBatch(id, body);
  } catch {
    return Response.json(
      { error: "O corpo da requisição contém JSON inválido." },
      { status: 400 }
    );
  }
}