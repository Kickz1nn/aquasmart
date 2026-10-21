import { historyRoutes } from "@/modules/history/history.routes";

export async function GET() {
  return historyRoutes.getAll();
}