import { sessionsRepository } from "./sessions.repository";

export const sessionsService = {
  async start() {
    const activeSession = await sessionsRepository.findActive();

    if (activeSession) {
      throw new Error("Já existe um banho em andamento.");
    }

    return sessionsRepository.create();
  },

  async getActive() {
    return sessionsRepository.findActive();
  },

  async getById(id: string) {
    const session = await sessionsRepository.findById(id);

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    return session;
  },

  async finish(id: string) {
    const session = await sessionsRepository.findById(id);

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    if (session.status !== "IN_PROGRESS") {
      throw new Error("Essa sessão já foi finalizada.");
    }

    const finishedAt = new Date();

    const durationSeconds = Math.max(
      0,
      Math.floor(
        (finishedAt.getTime() - session.startedAt.getTime()) / 1000
      )
    );

    return sessionsRepository.finish(
      id,
      finishedAt,
      durationSeconds
    );
  },
};