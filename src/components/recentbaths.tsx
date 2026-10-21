"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./recentbaths.module.css";

type Bath = {
    id: string;
    startedAt: string;
    durationSeconds: number | null;
    totalWaterLiters: number;
    energyKwh: number;
};

type BathGroup = {
    key: string;
    label: string;
    baths: Bath[];
};

function formatDuration(seconds: number | null) {
    if (seconds === null) return "—";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getDateKey(date: string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(date));

    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
}

function formatGroupDate(date: string) {
    const today = getDateKey(new Date().toISOString());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getDateKey(yesterdayDate.toISOString());

    const parsedDate = new Date(`${date}T12:00:00`);

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
    }).format(parsedDate);

    if (date === today) return `Hoje · ${formattedDate}`;
    if (date === yesterday) return `Ontem · ${formattedDate}`;

    return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "long",
    }).format(parsedDate);
}

function formatNumber(value: number, digits: number) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

export default function RecentBaths() {
    const [baths, setBaths] = useState<Bath[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadBaths() {
            try {
                const response = await fetch("/api/history", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Não foi possível carregar o histórico.");
                }

                const result = await response.json();
                const records = Array.isArray(result)
                    ? result
                    : result.data;

                if (!Array.isArray(records)) {
                    throw new Error("Formato de resposta inválido.");
                }

                if (!cancelled) {
                    setBaths(records.slice(0, 5));
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

        loadBaths();

        return () => {
            cancelled = true;
        };
    }, []);

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
                <h2>Últimos banhos</h2>
                <Link href="/history">Ver histórico →</Link>
            </div>

            {loading ? (
                <p role="status">Carregando últimos banhos...</p>
            ) : error ? (
                <p role="alert">
                    Não foi possível carregar os banhos. Recarregue a página para tentar novamente.
                </p>
            ) : groups.length === 0 ? (
                <p>Nenhum banho finalizado foi registrado ainda.</p>
            ) : (
                <div className={styles.list}>
                    {groups.map((group) => (
                        <div key={group.key} className={styles.group}>
                            <div className={styles.groupHeader}>
                                <strong>{group.label}</strong>
                                <span>
                                    {group.baths.length}{" "}
                                    {group.baths.length === 1 ? "banho" : "banhos"}
                                </span>
                            </div>

                            {group.baths.map((bath, index) => (
                                <div className={styles.bath} key={bath.id}>
                                    <div className={styles.date}>
                                        <strong>Banho {index + 1}</strong>
                                        <span>
                                            ⏱ {formatDuration(bath.durationSeconds)}
                                        </span>
                                    </div>

                                    <div className={styles.data}>
                                        <span>
                                            💧 {formatNumber(bath.totalWaterLiters, 1)} L
                                        </span>
                                        <span>
                                            ⚡ {formatNumber(bath.energyKwh, 3)} kWh
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}