import { prisma } from "@/lib/prisma";

export const sessionsRepository = {
  create() {
    return prisma.session.create({
      data: {
        status: "IN_PROGRESS",
      },
    });
  },

  findById(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        measurements: {
          orderBy: {
            measuredAt: "asc",
          },
        },
      },
    });
  },

  findActive() {
    return prisma.session.findFirst({
      where: {
        status: "IN_PROGRESS",
      },
      orderBy: {
        startedAt: "desc",
      },
    });
  },

  findAll() {
    return prisma.session.findMany({
      orderBy: {
        startedAt: "desc",
      },
    });
  },

  finish(id: string, finishedAt: Date, durationSeconds: number) {
    return prisma.session.update({
      where: { id },
      data: {
        status: "COMPLETED",
        finishedAt,
        durationSeconds,
      },
    });
  },
};