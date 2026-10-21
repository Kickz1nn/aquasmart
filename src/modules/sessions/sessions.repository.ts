import { prisma } from "@/lib/prisma";

export const sessionsRepository = {
  startIfNoneActive() {
    return prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw`
        SELECT 1 AS locked
        WHERE pg_advisory_xact_lock(8142052026) IS NULL
      `;

      const activeSession = await transaction.session.findFirst({
        where: {
          status: "IN_PROGRESS",
        },
      });

      if (activeSession) {
        throw new Error("Já existe um banho em andamento.");
      }

      return transaction.session.create({
        data: {
          status: "IN_PROGRESS",
        },
      });
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

  updateTotals(
    id: string,
    totalWaterLiters: number,
    energyKwh: number
  ) {
    return prisma.session.update({
      where: { id },
      data: {
        totalWaterLiters,
        energyKwh,
      },
    });
  },

  async finishIfActive(id: string) {
    return prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw`
        SELECT "id"
        FROM "Session"
        WHERE "id" = ${id}
        FOR UPDATE
      `;

      const session = await transaction.session.findUnique({
        where: { id },
      });

      if (!session) {
        return null;
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

      return transaction.session.update({
        where: { id },
        data: {
          status: "COMPLETED",
          finishedAt,
          durationSeconds,
        },
      });
    });
  },
};