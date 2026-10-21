"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import ConsumptionChart from "@/components/consumptionchart";

type MonthSummary = {
    sessionsCount: number;
    totalWaterLiters: number;
    energyKwh: number;
    durationSeconds: number;
};

type DailyConsumption = {
    date: string;
    sessionsCount: number;
    totalWaterLiters: number;
    energyKwh: number;
    durationSeconds: number;
};

type DashboardData = {
    activeSession: unknown | null;
    currentMonth: MonthSummary;
    previousMonth: MonthSummary;
    dailyConsumption: DailyConsumption[];
    previousDailyConsumption: DailyConsumption[];
    recentSessions: unknown[];
    settings: {
        waterCostPerM3: number;
        energyCostPerKwh: number;
        targetDurationMinutes: number;
        waterUnit: string;
        energyUnit: string;
    };
};

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatNumber(value: number, maximumFractionDigits = 1) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: maximumFractionDigits,
        maximumFractionDigits,
    });
}

function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function getVariation(
    current: number,
    previous: number,
    unit: "percent" | "seconds"
) {
    if (previous === 0) {
        return "Sem dados do mês anterior para comparar";
    }

    const difference = current - previous;

    if (unit === "seconds") {
        const absoluteDifference = Math.abs(difference);
        const formattedDifference =
            absoluteDifference >= 60
                ? `${Math.floor(absoluteDifference / 60)} min`
                : `${absoluteDifference} s`;

        if (difference === 0) return "Sem alteração em relação ao mês anterior";

        return `${difference < 0 ? "↓" : "↑"} ${formattedDifference} em relação ao mês anterior`;
    }

    const percentage = (difference / previous) * 100;

    if (percentage === 0) return "Sem alteração em relação ao mês anterior";

    return `${percentage < 0 ? "↓" : "↑"} ${formatNumber(Math.abs(percentage), 1)}% em relação ao mês anterior`;
}

function formatChartDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
        day: "2-digit",
        month: "short",
    }).format(new Date(`${date}T12:00:00Z`));
}

function getDayOfMonth(date: string) {
    return Number(date.slice(8, 10));
}

function formatDay(day: number) {
    return String(day).padStart(2, "0");
}

function getMonthName(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
        timeZone: "America/Sao_Paulo",
    }).format(date);
}

function getComparisonData(
    currentData: DailyConsumption[],
    previousData: DailyConsumption[],
    field: "totalWaterLiters" | "energyKwh"
) {
    const currentByDay = new Map(
        currentData.map((day) => [
            getDayOfMonth(day.date),
            day[field],
        ])
    );

    const previousByDay = new Map(
        previousData.map((day) => [
            getDayOfMonth(day.date),
            day[field],
        ])
    );

    const days = Array.from(
        new Set([...currentByDay.keys(), ...previousByDay.keys()])
    ).sort((a, b) => a - b);

    return days.map((day) => ({
        month: formatDay(day),
        currentMonth: currentByDay.has(day)
            ? Number(currentByDay.get(day)!.toFixed(4))
            : undefined,
        previousMonth: previousByDay.has(day)
            ? Number(previousByDay.get(day)!.toFixed(4))
            : undefined,
    }));
}

export default function Dashboard() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            try {
                const response = await fetch("/api/dashboard");

                if (!response.ok) {
                    throw new Error("Não foi possível carregar a dashboard.");
                }

                const result = await response.json();

                if (!cancelled) {
                    setDashboard(result.data);
                }
            } catch {
                if (!cancelled) {
                    setError("Não foi possível carregar os dados. Tente novamente.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <main className={styles.dashboard}>
                <p role="status">Carregando dashboard...</p>
            </main>
        );
    }

    if (error || !dashboard) {
        return (
            <main className={styles.dashboard}>
                <p role="alert">
                    {error ?? "Não foi possível carregar os dados."}
                </p>
            </main>
        );
    }

    const {
        currentMonth,
        previousMonth,
        dailyConsumption,
        previousDailyConsumption,
        settings,
    } = dashboard;

    const waterCost =
        (currentMonth.totalWaterLiters / 1000) * settings.waterCostPerM3;

    const energyCost =
        currentMonth.energyKwh * settings.energyCostPerKwh;

    const totalEstimatedCost = waterCost + energyCost;

    const averageDuration =
        currentMonth.sessionsCount > 0
            ? currentMonth.durationSeconds / currentMonth.sessionsCount
            : 0;

    const targetDurationSeconds = settings.targetDurationMinutes * 60;

    const durationProgress =
        targetDurationSeconds > 0
            ? Math.min((averageDuration / targetDurationSeconds) * 100, 100)
            : 0;

    const averageIsWithinTarget = averageDuration <= targetDurationSeconds;

    const waterData = dailyConsumption.map((day) => ({
        month: formatChartDate(day.date),
        consumption: Number(day.totalWaterLiters.toFixed(2)),
    }));

    const energyData = dailyConsumption.map((day) => ({
        month: formatChartDate(day.date),
        consumption: Number(day.energyKwh.toFixed(4)),
    }));

    const waterComparisonData = getComparisonData(
        dailyConsumption,
        previousDailyConsumption,
        "totalWaterLiters"
    );

    const energyComparisonData = getComparisonData(
        dailyConsumption,
        previousDailyConsumption,
        "energyKwh"
    );

    const now = new Date();
    const currentMonthName = getMonthName(now);
    const previousMonthDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
    );
    const previousMonthName = getMonthName(previousMonthDate);

    return (
        <main className={styles.dashboard}>
            <header className={styles.header}>
                <p>Visão geral</p>
                <h1>Dashboard</h1>
                <span>
                    Acompanhe o consumo de água e energia dos seus banhos.
                </span>
            </header>

            <section className={styles.summary}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <p>Água</p>
                        <span className={styles.cardIcon}>💧</span>
                    </div>
                    <strong>{formatNumber(currentMonth.totalWaterLiters)} L</strong>
                    <span className={styles.cardVariation}>
                        {getVariation(
                            currentMonth.totalWaterLiters,
                            previousMonth.totalWaterLiters,
                            "percent"
                        )}
                    </span>
                    <span className={styles.cardVariation}>
                        Mês atual acumulado · mês anterior completo
                    </span>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <p>Energia estimada</p>
                        <span className={styles.cardIcon}>⚡</span>
                    </div>
                    <strong>{formatNumber(currentMonth.energyKwh, 3)} kWh</strong>
                    <span className={styles.cardVariation}>
                        {getVariation(
                            currentMonth.energyKwh,
                            previousMonth.energyKwh,
                            "percent"
                        )}
                    </span>
                    <span className={styles.cardVariation}>
                        Mês atual acumulado · mês anterior completo
                    </span>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <p>Duração média</p>
                        <span className={styles.cardIcon}>⏱</span>
                    </div>
                    <strong>
                        {currentMonth.sessionsCount > 0
                            ? formatDuration(Math.round(averageDuration))
                            : "00:00"}
                    </strong>
                    <span className={styles.cardVariation}>
                        {getVariation(
                            averageDuration,
                            previousMonth.sessionsCount > 0
                                ? previousMonth.durationSeconds /
                                  previousMonth.sessionsCount
                                : 0,
                            "seconds"
                        )}
                    </span>
                </div>
            </section>

            <section className={styles.summary}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <p>Custo estimado do mês</p>
                        <span className={styles.cardIcon}>💰</span>
                    </div>
                    <strong>{formatMoney(totalEstimatedCost)}</strong>
                    <span className={styles.cardVariation}>
                        Água: {formatMoney(waterCost)} · Energia: {formatMoney(energyCost)}
                    </span>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <p>Meta de duração</p>
                        <span className={styles.cardIcon}>🎯</span>
                    </div>
                    <strong>
                        {currentMonth.sessionsCount > 0
                            ? formatDuration(Math.round(averageDuration))
                            : "00:00"}
                    </strong>
                    <span className={styles.cardVariation}>
                        Meta: {settings.targetDurationMinutes} min
                    </span>
                    <div className={styles.progressTrack}>
                        <div
                            className={`${styles.progressBar} ${
                                averageIsWithinTarget
                                    ? styles.progressGood
                                    : styles.progressWarning
                            }`}
                            style={{ width: `${durationProgress}%` }}
                        />
                    </div>
                    <span className={styles.cardVariation}>
                        {currentMonth.sessionsCount === 0
                            ? "Nenhum banho registrado neste mês"
                            : averageIsWithinTarget
                              ? "Média dentro da meta"
                              : "Média acima da meta"}
                    </span>
                </div>
            </section>

            <section className={styles.chartCard}>
                <div>
                    <p>Consumo de água</p>
                    <h2>Consumo diário no mês</h2>
                </div>
                {waterData.length > 0 ? (
                    <ConsumptionChart data={waterData} unit="L" color="#127e83" />
                ) : (
                    <p>Nenhum consumo registrado neste mês.</p>
                )}
            </section>

            <section className={styles.chartCard}>
                <div>
                    <p>Consumo de energia</p>
                    <h2>Energia estimada diária no mês</h2>
                </div>
                {energyData.length > 0 ? (
                    <ConsumptionChart data={energyData} unit="kWh" color="#d28b32" />
                ) : (
                    <p>Nenhum consumo registrado neste mês.</p>
                )}
            </section>

            <section className={styles.chartCard}>
                <div>
                    <p>Comparação mensal · água</p>
                    <h2>Consumo diário por dia do mês</h2>
                    <span className={styles.cardVariation}>
                        {currentMonthName} (acumulado) × {previousMonthName} (completo)
                    </span>
                </div>
                {previousDailyConsumption.length > 0 ? (
                    <ConsumptionChart
                        data={waterComparisonData}
                        unit="L"
                        color="#127e83"
                        comparison
                    />
                ) : (                   
                    <div className={styles.emptyComparison}>
                        <div className={styles.emptyComparisonIcon}>💧</div>
                        <h3>Sem dados para comparar</h3>
                        <p>
                            Ainda não há banhos registrados em {previousMonthName}.
                            Quando houver dados desse período, você poderá comparar o consumo
                            de água entre os meses.
                        </p>
                        <span>Comparação mensal indisponível</span>
                    </div>
                )}
            </section>

            <section className={styles.chartCard}>
                <div>
                    <p>Comparação mensal · energia</p>
                    <h2>Energia estimada diária por dia do mês</h2>
                    <span className={styles.cardVariation}>
                        {currentMonthName} (acumulado) × {previousMonthName} (completo)
                    </span>
                </div>
                {previousDailyConsumption.length > 0 ? (
                    <ConsumptionChart
                        data={energyComparisonData}
                        unit="kWh"
                        color="#d28b32"
                        comparison
                    />
                ) : (  
                    <div className={styles.emptyComparison}>
                        <div className={styles.emptyComparisonIcon}>⚡</div>
                        <h3>Sem dados para comparar</h3>
                        <p>
                            Ainda não há banhos registrados em {previousMonthName}.
                            Quando houver dados desse período, você poderá comparar a energia
                            estimada entre os meses.
                        </p>
                        <span>Comparação mensal indisponível</span>
                    </div>
                )}
            </section>
        </main>
    );
}