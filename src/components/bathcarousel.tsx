"use client";

import { useState, useEffect, useRef, type TouchEvent } from "react";
import styles from "./bathcarousel.module.css";

type Measurement = {
    measuredAt: string;
    flowRateLpm: number;
    totalVolumeLiters: number;
    powerWatts: number;
};

type Bath = {
    id: string;
    startedAt: string;
    finishedAt: string | null;
    durationSeconds: number | null;
    totalWaterLiters: number;
    energyKwh: number;
    status: "IN_PROGRESS" | "COMPLETED";
    measurements?: Measurement[];
};

type DashboardData = {
    activeSession: Bath | null;
    recentSessions: Bath[];
    settings: {
        waterCostPerM3: number;
        energyCostPerKwh: number;
    };
};

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatNumber(value: number, digits = 1) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

function getDifference(current: number, previous: number, unit: string) {
    if (previous <= 0) {
        return `Sem dados anteriores de ${unit}`;
    }

    const difference = ((previous - current) / previous) * 100;
    const direction = difference >= 0 ? "↓" : "↑";

    return `${direction} ${formatNumber(Math.abs(difference))}% de ${unit}`;
}

export default function BathCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            try {
                const response = await fetch("/api/dashboard", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Falha ao carregar os dados.");
                }

                const result = await response.json();

                if (!cancelled) {
                    setDashboard(result.data);
                    setError(false);
                }
            } catch {
                if (!cancelled) {
                    setError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        const refreshInterval = setInterval(loadDashboard, 3000);

        return () => {
            cancelled = true;
            clearInterval(refreshInterval);
        };
    }, []);

    const activeBath = dashboard?.activeSession ?? null;

    useEffect(() => {
        if (!activeBath?.startedAt) {
            setElapsedSeconds(0);
            return;
        }

        const startTime = new Date(activeBath.startedAt).getTime();

        function updateElapsedTime() {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            setElapsedSeconds(Math.max(0, elapsed));
        }

        updateElapsedTime();

        const timer = setInterval(updateElapsedTime, 1000);

        return () => clearInterval(timer);
    }, [activeBath?.id, activeBath?.startedAt]);

    const previousBath =
        dashboard?.recentSessions.find(
            (bath) =>
                bath.status === "COMPLETED" &&
                bath.id !== activeBath?.id
        ) ?? null;

    const latestMeasurement = activeBath?.measurements?.[0];

    const water = activeBath
        ? latestMeasurement?.totalVolumeLiters ??
          activeBath.totalWaterLiters
        : 0;

    const energy = activeBath?.energyKwh ?? 0;

    const waterCost = dashboard
        ? (water / 1000) * dashboard.settings.waterCostPerM3
        : 0;

    const energyCost = dashboard
        ? energy * dashboard.settings.energyCostPerKwh
        : 0;

    const previousWater = previousBath?.totalWaterLiters ?? 0;
    const previousEnergy = previousBath?.energyKwh ?? 0;

    const previousDuration =
        previousBath?.durationSeconds !== null &&
        previousBath?.durationSeconds !== undefined
            ? formatDuration(previousBath.durationSeconds)
            : "—";

    function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
        touchStartX.current = event.touches[0].clientX;
    }

    function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
        if (touchStartX.current === null) return;

        const touchEndX = event.changedTouches[0].clientX;
        const distance = touchStartX.current - touchEndX;

        if (Math.abs(distance) >= 50) {
            setCurrentSlide((previous) =>
                distance > 0
                    ? (previous + 1) % 3
                    : (previous - 1 + 3) % 3
            );
        }

        touchStartX.current = null;
    }

    function changeSlide(direction: number) {
        setCurrentSlide((previous) => (previous + direction + 3) % 3);
    }

    if (loading) {
        return (
            <div className={styles.carousel}>
                <div className={styles.card}>
                    <h2>Banho Atual</h2>
                    <p>Carregando dados do banho...</p>
                </div>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className={styles.carousel}>
                <div className={styles.card}>
                    <h2>Banho Atual</h2>
                    <p>Não foi possível carregar os dados do banho.</p>
                    <button
                        className={styles.button}
                        onClick={() => window.location.reload()}
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.carousel}>
            <div className={styles.card}>
                <h2>
                    {activeBath ? "Banho em andamento" : "Banho Atual"}
                </h2>

                {!activeBath && (
                    <p>
                        Nenhum banho em andamento no momento.
                    </p>
                )}

                <div
                    className={styles.viewport}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={styles.slides}
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                    >
                        <div className={styles.slide}>
                            <h3>Água</h3>

                            <p className={styles.mainValue}>
                                {activeBath ? `${formatNumber(water)} L` : "—"}
                            </p>

                            <div className={styles.details}>
                                <p>
                                    {activeBath ? formatMoney(waterCost) : "—"}
                                </p>
                                <p>
                                    ⏱ {activeBath ? formatDuration(elapsedSeconds) : "—"}
                                </p>
                            </div>
                        </div>

                        <div className={styles.slide}>
                            <h3>Energia estimada</h3>

                            <p className={styles.mainValue}>
                                {activeBath ? `${formatNumber(energy, 3)} kWh` : "—"}
                            </p>

                            <div className={styles.details}>
                                <p>
                                    {activeBath ? formatMoney(energyCost) : "—"}
                                </p>
                                <p>
                                    ⏱ {activeBath ? formatDuration(elapsedSeconds) : "—"}
                                </p>
                            </div>
                        </div>

                        <div className={styles.slide}>
                            <h3>Comparativo</h3>

                            {activeBath && previousBath ? (
                                <>
                                    <div className={styles.comparison}>
                                        <div>
                                            <strong>Banho atual</strong>
                                            <p>💧 {formatNumber(water)} L</p>
                                            <p>⚡ {formatNumber(energy, 3)} kWh</p>
                                            <p>⏱ {formatDuration(elapsedSeconds)}</p>
                                        </div>

                                        <div>
                                            <strong>Banho anterior</strong>
                                            <p>💧 {formatNumber(previousWater)} L</p>
                                            <p>⚡ {formatNumber(previousEnergy, 3)} kWh</p>
                                            <p>⏱ {previousDuration}</p>
                                        </div>
                                    </div>

                                    <div className={styles.difference}>
                                        <p>
                                            {getDifference(water, previousWater, "água")}
                                        </p>
                                        <p>
                                            {getDifference(energy, previousEnergy, "energia")}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p>
                                    {activeBath
                                        ? "Ainda não há um banho anterior para comparar."
                                        : "Inicie um banho para acompanhar seu consumo e compará-lo com o anterior."}
                                </p>
                            )}

                            {activeBath && (
                                <p className={styles.duration}>
                                    ⏱ {formatDuration(elapsedSeconds)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.indicators}>
                    {[0, 1, 2].map((slide) => (
                        <span
                            key={slide}
                            className={currentSlide === slide ? styles.active : ""}
                        >
                            ●
                        </span>
                    ))}
                </div>

                <div className={styles.navigation}>
                    <button
                        className={styles.button}
                        onClick={() => changeSlide(-1)}
                    >
                        ← Anterior
                    </button>

                    <button
                        className={styles.button}
                        onClick={() => changeSlide(1)}
                    >
                        Próximo →
                    </button>
                </div>
            </div>
        </div>
    );
}