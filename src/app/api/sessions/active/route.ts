import { sessionsRoutes } from "@/modules/sessions/sessions.routes";

export async function GET() {
  return sessionsRoutes.getActive();
}