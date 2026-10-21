import { prisma } from "@/lib/prisma";

export const historyRepository = {
  findAll() {
    return prisma.session.findMany({
      where: {
        status: "COMPLETED",
      },
      orderBy: {
        startedAt: "desc",
      },
      select: {
        id: true,
        startedAt: true,
        finishedAt: true,
        durationSeconds: true,
        totalWaterLiters: true,
        energyKwh: true,
        status: true,
      },
    });
  },

  findById(id: string) {
    return prisma.session.findUnique({
      where: {
        id,
      },
      include: {
        measurements: {
          orderBy: {
            measuredAt: "asc",
          },
        },
      },
    });
  },
};