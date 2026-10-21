import { prisma } from "@/lib/prisma";

export const settingsRepository = {
  findOrCreate() {
    return prisma.settings.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        id: 1,
      },
    });
  },

  update(
    data: {
      waterCostPerM3?: number;
      energyCostPerKwh?: number;
      targetDurationMinutes?: number;
    }
  ) {
    return prisma.settings.upsert({
      where: {
        id: 1,
      },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });
  },
};