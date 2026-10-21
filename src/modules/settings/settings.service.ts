import { settingsRepository } from "./settings.repository";

export const settingsService = {
  async get() {
    return settingsRepository.findOrCreate();
  },

  async update(data: {
    waterCostPerM3?: number;
    energyCostPerKwh?: number;
    targetDurationMinutes?: number;
  }) {
    return settingsRepository.update(data);
  },
};