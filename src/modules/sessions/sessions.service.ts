import { sessionsRepository } from "./sessions.repository";

export const sessionsService = {
  async start() {
    return sessionsRepository.startIfNoneActive();
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

  async getAll() {
    return sessionsRepository.findAll();
  },

  async finish(id: string) {
    const session = await sessionsRepository.finishIfActive(id);

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    return session;
  },
};