"use client";

import { useEffect, useState } from "react";
import styles from "./historylist.module.css";

type Bath = {
    id: string;
    startedAt: string;
    finishedAt: string | null;
    durationSeconds: number | null;
    totalWaterLiters: number;
    energyKwh: number;
    status: "COMPLETED";
};

type Measurement = {
    id: string;
    measuredAt: string;
    flowRateLpm: number;
    totalVolumeLiters: number;
    powerWatts: number;
};

type BathDetails = Bath & {
    measurements: Measurement[];
};

type Settings = {
    waterCostPerM3: number;
    energyCostPerKwh: number;
};

type BathGroup = {
    key: string;
    label: string;
    baths: Bath[];
};

function getDateKey(value: string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(value));

    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
}

function formatGroupDate(value: string) {
    const today = getDateKey(new Date().toISOString());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getDateKey(yesterdayDate.toISOString());

    const date = new Date(`${value}T12:00:00`);

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);

    if (value === today) {
        return `Hoje · ${new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "long",
        }).format(date)}`;
    }

    if (value === yesterday) {
        return `Ontem · ${new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "long",
        }).format(date)}`;
    }

    return formattedDate;
}

function formatTime(value: string) {
    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatDuration(seconds: number | null) {
    if (seconds === null) return "—";

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

function formatNumber(value: number, digits: number) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

export default function HistoryList() {
    const [baths, setBaths] = useState<Bath[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [expandedBath, setExpandedBath] = useState<string | null>(null);
    const [bathDetails, setBathDetails] = useState<Record<string, BathDetails>>({});
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadHistory() {
            try {
                const [historyResponse, settingsResponse] = await Promise.all([
                    fetch("/api/history"),
                    fetch("/api/settings"),
                ]);

                if (!historyResponse.ok || !settingsResponse.ok) {
                    throw new Error("Não foi possível carregar o histórico.");
                }

                const historyResult = await historyResponse.json();
                const settingsResult = await settingsResponse.json();

                if (cancelled) return;

                setBaths(historyResult.data);
                setSettings(settingsResult.data);
            } catch {
                if (!cancelled) {
                    setError("Não foi possível carregar o histórico. Tente novamente.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, []);

    async function toggleBath(id: string) {
        if (expandedBath === id) {
            setExpandedBath(null);
            setDetailsError(null);
            return;
        }

        setExpandedBath(id);
        setDetailsError(null);

        if (bathDetails[id]) return;

        setLoadingDetails(id);

        try {
            const response = await fetch(`/api/history/${id}`);

            if (!response.ok) {
                throw new Error("Não foi possível carregar os detalhes deste banho.");
            }

            const result = await response.json();

            setBathDetails((current) => ({
                ...current,
                [id]: result.data,
            }));
        } catch {
            setDetailsError("Não foi possível carregar os detalhes deste banho.");
        } finally {
            setLoadingDetails(null);
        }
    }

    const groups: BathGroup[] = Object.values(
        baths.reduce<Record<string, BathGroup>>((result, bath) => {
            const key = getDateKey(bath.startedAt);

            if (!result[key]) {
                result[key] = {
                    key,
                    label: formatGroupDate(key),
                    baths: [],
                };
            }

            result[key].baths.push(bath);

            return result;
        }, {})
    );

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>AquaSmart</p>
                    <h1>Histórico de banhos</h1>
                    <p className={styles.description}>
                        Consulte os dados dos seus banhos anteriores.
                    </p>
                </div>
            </div>

            {loading && (
                <p role="status" className={styles.description}>
                    Carregando histórico...
                </p>
            )}

            {error && (
                <p role="alert" className={styles.description}>
                    {error}
                </p>
            )}

            {!loading && !error && baths.length === 0 && (
                <p className={styles.description}>
                    Nenhum banho concluído foi registrado ainda.
                </p>
            )}

            {!loading && !error && baths.length > 0 && (
                <div className={styles.list}>
                    {groups.map((group) => (
                        <section className={styles.group} key={group.key}>
                            <div className={styles.groupHeader}>
                                <h2>{group.label}</h2>
                                <span>
                                    {group.baths.length}{" "}
                                    {group.baths.length === 1 ? "banho" : "banhos"}
                                </span>
                            </div>

                            <div className={styles.groupList}>
                                {group.baths.map((bath) => {
                                    const totalWaterCost = settings
                                        ? (bath.totalWaterLiters / 1000) * settings.waterCostPerM3
                                        : null;

                                    const totalEnergyCost = settings
                                        ? bath.energyKwh * settings.energyCostPerKwh
                                        : null;

                                    const totalCost =
                                        totalWaterCost !== null && totalEnergyCost !== null
                                            ? totalWaterCost + totalEnergyCost
                                            : null;

                                    const isExpanded = expandedBath === bath.id;
                                    const details = bathDetails[bath.id];
                                    const powerWatts = details?.measurements.length
                                        ? details.measurements[details.measurements.length - 1].powerWatts
                                        : null;

                                    return (
                                        <article
                                            className={`${styles.bath} ${isExpanded ? styles.expanded : ""}`}
                                            key={bath.id}
                                        >
                                            <button
                                                type="button"
                                                className={styles.bathButton}
                                                onClick={() => toggleBath(bath.id)}
                                                aria-expanded={isExpanded}
                                            >
                                                <div className={styles.bathHeader}>
                                                    <div>
                                                        <h3>Banho às {formatTime(bath.startedAt)}</h3>
                                                        <span>
                                                            ⏱ {formatDuration(bath.durationSeconds)}
                                                        </span>
                                                    </div>

                                                    <div className={styles.cost}>
                                                        <strong>
                                                            {totalCost === null
                                                                ? "Calculando..."
                                                                : formatMoney(totalCost)}
                                                        </strong>
                                                        <span>{isExpanded ? "▲" : "▼"}</span>
                                                    </div>
                                                </div>

                                                <div className={styles.data}>
                                                    <div>
                                                        <span>Água</span>
                                                        <strong>
                                                            💧 {formatNumber(bath.totalWaterLiters, 1)} L
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>Energia estimada</span>
                                                        <strong>
                                                            ⚡ {formatNumber(bath.energyKwh, 3)} kWh
                                                        </strong>
                                                    </div>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className={styles.details}>
                                                    {loadingDetails === bath.id && (
                                                        <p role="status" className={styles.description}>
                                                            Carregando detalhes...
                                                        </p>
                                                    )}

                                                    {detailsError && (
                                                        <p role="alert" className={styles.description}>
                                                            {detailsError}
                                                        </p>
                                                    )}

                                                    {details && (
                                                        <>
                                                            <div className={styles.detail}>
                                                                <span>Consumo de água</span>
                                                                <strong>
                                                                    {formatNumber(bath.totalWaterLiters, 1)} L
                                                                </strong>
                                                            </div>

                                                            <div className={styles.detail}>
                                                                <span>Energia estimada</span>
                                                                <strong>
                                                                    {formatNumber(bath.energyKwh, 3)} kWh
                                                                </strong>
                                                            </div>

                                                            <div className={styles.detail}>
                                                                <span>Potência registrada</span>
                                                                <strong>
                                                                    {powerWatts === null
                                                                        ? "Sem medições"
                                                                        : `${powerWatts} W`}
                                                                </strong>
                                                            </div>

                                                            <div className={styles.detail}>
                                                                <span>Custo da água</span>
                                                                <strong>
                                                                    {totalWaterCost === null
                                                                        ? "—"
                                                                        : formatMoney(totalWaterCost)}
                                                                </strong>
                                                            </div>

                                                            <div className={styles.detail}>
                                                                <span>Custo da energia</span>
                                                                <strong>
                                                                    {totalEnergyCost === null
                                                                        ? "—"
                                                                        : formatMoney(totalEnergyCost)}
                                                                </strong>
                                                            </div>

                                                            <div className={styles.detail}>
                                                                <span>Duração</span>
                                                                <strong>
                                                                    {formatDuration(bath.durationSeconds)}
                                                                </strong>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </section>
    );
}