import { NextResponse } from "next/server";
import { dashboardService } from "./dashboard.service";

export const dashboardRoutes = {
  async getOverview() {
    try {
      const data = await dashboardService.getOverview();

      return NextResponse.json({ data });
    } catch (error) {
      console.error("Erro ao consultar dashboard:", error);

      return NextResponse.json(
        { error: "Não foi possível consultar os dados do dashboard." },
        { status: 500 }
      );
    }
  },
};