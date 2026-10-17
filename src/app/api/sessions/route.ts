
import { sessionsRoutes } from "@/modules/sessions/sessions.routes";

export async function POST() {
  return sessionsRoutes.start();
}
