import { historyRoutes } from "@/modules/history/history.routes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  return historyRoutes.getById(id);
}