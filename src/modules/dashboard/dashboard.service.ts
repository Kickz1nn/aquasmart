import { dashboardRepository } from "./dashboard.repository";

const TIME_ZONE = "America/Sao_Paulo";

function getSaoPauloMonthBoundaries(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);

  const year = Number(
    parts.find((part) => part.type === "year")!.value
  );
  const month = Number(
    parts.find((part) => part.type === "month")!.value
  );

  function getLocalMidnightUtc(
    targetYear: number,
    targetMonth: number
  ) {
    const targetUtc = Date.UTC(
      targetYear,
      targetMonth - 1,
      1
    );

    let timestamp = targetUtc;

    for (let i = 0; i < 3; i++) {
      const localParts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date(timestamp));

      const values = Object.fromEntries(
        localParts.map((part) => [part.type, part.value])
      );

      const localAsUtc = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second)
      );

      timestamp += targetUtc - localAsUtc;
    }

    return new Date(timestamp);
  }

  return {
    startOfPreviousMonth: getLocalMidnightUtc(year, month - 1),
    startOfMonth: getLocalMidnightUtc(year, month),
    startOfNextMonth: getLocalMidnightUtc(year, month + 1),
  };
}

export const dashboardService = {
  async getOverview() {
    const now = new Date();
    const {
      startOfMonth,
      startOfNextMonth,
      startOfPreviousMonth,
    } = getSaoPauloMonthBoundaries(now);

    const [
      activeSession,
      currentMonthSessions,
      previousMonthSessions,
      recentSessions,
      settings,
      dailySessions,
    ] = await Promise.all([
      dashboardRepository.findActiveSession(),
      dashboardRepository.findSessionsBetween(
        startOfMonth,
        startOfNextMonth
      ),
      dashboardRepository.findSessionsBetween(
        startOfPreviousMonth,
        startOfMonth
      ),
      dashboardRepository.findRecentSessions(),
      dashboardRepository.findSettings(),
      dashboardRepository.findCompletedSessionsBetween(
        startOfMonth,
        startOfNextMonth
      ),
    ]);

    const completedCurrentMonth = currentMonthSessions.filter(
      (session) => session.status === "COMPLETED"
    );
    const completedPreviousMonth = previousMonthSessions.filter(
      (session) => session.status === "COMPLETED"
    );

    const sum = (
      sessions: typeof completedCurrentMonth,
      field: "totalWaterLiters" | "energyKwh"
    ) =>
      sessions.reduce((total, session) => total + session[field], 0);

    const sumDuration = (sessions: typeof completedCurrentMonth) =>
      sessions.reduce(
        (total, session) => total + (session.durationSeconds ?? 0),
        0
      );

    const dailyConsumption = new Map<
      string,
      {
        date: string;
        sessionsCount: number;
        totalWaterLiters: number;
        energyKwh: number;
        durationSeconds: number;
      }
    >();

    for (const session of dailySessions) {
      const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(session.startedAt);

      const daily = dailyConsumption.get(date) ?? {
        date,
        sessionsCount: 0,
        totalWaterLiters: 0,
        energyKwh: 0,
        durationSeconds: 0,
      };

      daily.sessionsCount += 1;
      daily.totalWaterLiters += session.totalWaterLiters;
      daily.energyKwh += session.energyKwh;
      daily.durationSeconds += session.durationSeconds ?? 0;

      dailyConsumption.set(date, daily);
    }

    return {
      activeSession: activeSession
        ? {
            id: activeSession.id,
            startedAt: activeSession.startedAt,
            latestMeasurement: activeSession.measurements[0] ?? null,
          }
        : null,
      currentMonth: {
        sessionsCount: completedCurrentMonth.length,
        totalWaterLiters: sum(
          completedCurrentMonth,
          "totalWaterLiters"
        ),
        energyKwh: sum(completedCurrentMonth, "energyKwh"),
        durationSeconds: sumDuration(completedCurrentMonth),
      },
      previousMonth: {
        sessionsCount: completedPreviousMonth.length,
        totalWaterLiters: sum(
          completedPreviousMonth,
          "totalWaterLiters"
        ),
        energyKwh: sum(completedPreviousMonth, "energyKwh"),
        durationSeconds: sumDuration(completedPreviousMonth),
      },
      dailyConsumption: Array.from(dailyConsumption.values()),
      recentSessions,
      settings: {
        waterCostPerM3: settings.waterCostPerM3,
        energyCostPerKwh: settings.energyCostPerKwh,
        targetDurationMinutes: settings.targetDurationMinutes,
        waterUnit: settings.waterUnit,
        energyUnit: settings.energyUnit,
      },
    };
  },
};