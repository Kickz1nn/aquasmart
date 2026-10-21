"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./settings.module.css";

type SettingsData = {
    waterCostPerM3: number;
    energyCostPerKwh: number;
    targetDurationMinutes: number;
};

export default function Settings() {
    const [settings, setSettings] = useState<SettingsData>({
        waterCostPerM3: 0,
        energyCostPerKwh: 0,
        targetDurationMinutes: 10,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await fetch("/api/settings");
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error ?? "Não foi possível carregar as configurações."
                    );
                }

                setSettings({
                    waterCostPerM3: result.data.waterCostPerM3,
                    energyCostPerKwh: result.data.energyCostPerKwh,
                    targetDurationMinutes: result.data.targetDurationMinutes,
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Não foi possível carregar as configurações."
                );
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, []);

    function updateField(
        field: keyof SettingsData,
        value: string
    ) {
        setSettings((current) => ({
            ...current,
            [field]: value === "" ? 0 : Number(value),
        }));
        setMessage("");
        setError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ?? "Não foi possível salvar as configurações."
                );
            }

            setSettings({
                waterCostPerM3: result.data.waterCostPerM3,
                energyCostPerKwh: result.data.energyCostPerKwh,
                targetDurationMinutes: result.data.targetDurationMinutes,
            });
            setMessage("Configurações salvas com sucesso.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Não foi possível salvar as configurações."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className={styles.settings}>
            <header className={styles.header}>
                <p>Preferências</p>
                <h1>Configurações</h1>
                <span>
                    Ajuste as preferências utilizadas pelo AquaSmart.
                </span>
            </header>

            <form onSubmit={handleSubmit}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <p>Dados</p>
                        <span>
                            Configure os valores utilizados nos cálculos
                            de consumo e a meta de duração do banho.
                        </span>
                    </div>

                    <div className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="water-unit">
                                Unidade de água
                            </label>
                            <select id="water-unit" defaultValue="liters" disabled>
                                <option value="liters">Litros (L)</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="energy-unit">
                                Unidade de energia
                            </label>
                            <select id="energy-unit" defaultValue="kwh" disabled>
                                <option value="kwh">Quilowatt-hora (kWh)</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="water-cost">
                                Custo da água
                            </label>
                            <div className={styles.inputWithPrefix}>
                                <span>R$</span>
                                <input
                                    id="water-cost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={settings.waterCostPerM3}
                                    onChange={(event) =>
                                        updateField("waterCostPerM3", event.target.value)
                                    }
                                    disabled={loading || saving}
                                    required
                                />
                                <small>/ m³</small>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="energy-cost">
                                Custo da energia
                            </label>
                            <div className={styles.inputWithPrefix}>
                                <span>R$</span>
                                <input
                                    id="energy-cost"
                                    type="number"
                                    min="0"
                                    step="0.001"
                                    value={settings.energyCostPerKwh}
                                    onChange={(event) =>
                                        updateField("energyCostPerKwh", event.target.value)
                                    }
                                    disabled={loading || saving}
                                    required
                                />
                                <small>/ kWh</small>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="target-duration">
                                Meta de duração do banho
                            </label>
                            <div className={styles.inputWithPrefix}>
                                <input
                                    id="target-duration"
                                    type="number"
                                    min="1"
                                    max="120"
                                    step="1"
                                    value={settings.targetDurationMinutes}
                                    onChange={(event) =>
                                        updateField("targetDurationMinutes", event.target.value)
                                    }
                                    disabled={loading || saving}
                                    required
                                />
                                <small>minutos</small>
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <p className={styles.statusMessage}>
                            Carregando configurações...
                        </p>
                    )}

                    {message && (
                        <p className={styles.successMessage} role="status">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className={styles.errorMessage} role="alert">
                            {error}
                        </p>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading || saving}
                        >
                            {saving ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </section>
            </form>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p>Aplicação</p>
                    <span>Informações gerais sobre o aplicativo.</span>
                </div>

                <div className={styles.applicationInfo}>
                    <div>
                        <span>Nome</span>
                        <strong>AquaSmart</strong>
                    </div>
                    <div>
                        <span>Versão</span>
                        <strong>1.3.0</strong>
                    </div>
                    <div>
                        <span>Descrição</span>
                        <strong>
                            Aplicação para acompanhamento do consumo de água
                            e energia no banho.
                        </strong>
                    </div>
                </div>
            </section>
        </main>
    );
}