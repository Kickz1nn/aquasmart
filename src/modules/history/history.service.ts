import { historyRepository } from "./history.repository";

export const historyService = {
  async getAll() {
    return historyRepository.findAll();
  },

  async getById(id: string) {
    const session = await historyRepository.findById(id);

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    if (session.status !== "COMPLETED") {
      throw new Error("Essa sessão ainda não foi finalizada.");
    }

    return session;
  },
};