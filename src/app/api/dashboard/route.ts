import { dashboardRoutes } from "@/modules/dashboard/dashboard.routes";

export async function GET() {
  return dashboardRoutes.getOverview();
}