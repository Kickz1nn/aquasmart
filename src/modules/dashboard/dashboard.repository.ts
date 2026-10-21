import { prisma } from "@/lib/prisma";

export const dashboardRepository = {
  findActiveSession() {
    return prisma.session.findFirst({
      where: {
        status: "IN_PROGRESS",
      },
      include: {
        measurements: {
          orderBy: {
            measuredAt: "desc",
          },
          take: 1,
        },
      },
    });
  },

  findSessionsBetween(start: Date, end: Date) {
    return prisma.session.findMany({
      where: {
        startedAt: {
          gte: start,
          lt: end,
        },
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
      orderBy: {
        startedAt: "asc",
      },
    });
  },

  findCompletedSessionsBetween(start: Date, end: Date) {
    return prisma.session.findMany({
      where: {
        status: "COMPLETED",
        startedAt: {
          gte: start,
          lt: end,
        },
      },
      select: {
        startedAt: true,
        totalWaterLiters: true,
        energyKwh: true,
        durationSeconds: true,
      },
      orderBy: {
        startedAt: "asc",
      },
    });
  },

  findRecentSessions(limit = 5) {
    return prisma.session.findMany({
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
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

  findSettings() {
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
};