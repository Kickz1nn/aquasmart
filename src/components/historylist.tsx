"use client";

import { useState } from "react";
import styles from "./historylist.module.css";

const baths = [
    {
        date: "24/09/2026",
        duration: "05:32",
        water: 38.5,
        energy: 0.53,
        waterCost: 0.32,
        energyCost: 0.48,
        power: "5500 W",
    },
    {
        date: "23/09/2026",
        duration: "06:10",
        water: 42.1,
        energy: 0.61,
        waterCost: 0.35,
        energyCost: 0.56,
        power: "5500 W",
    },
    {
        date: "22/09/2026",
        duration: "05:48",
        water: 40.2,
        energy: 0.57,
        waterCost: 0.33,
        energyCost: 0.52,
        power: "4500 W",
    },
    {
        date: "21/09/2026",
        duration: "06:02",
        water: 44.0,
        energy: 0.64,
        waterCost: 0.36,
        energyCost: 0.59,
        power: "5500 W",
    },
    {
        date: "20/09/2026",
        duration: "05:35",
        water: 37.8,
        energy: 0.51,
        waterCost: 0.31,
        energyCost: 0.47,
        power: "4500 W",
    },
];

export default function HistoryList() {
    const [expandedBath, setExpandedBath] = useState<number | null>(null);

    function toggleBath(index: number) {
        setExpandedBath((current) =>
            current === index ? null : index
        );
    }

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

            <div className={styles.list}>
                {baths.map((bath, index) => {
                    const totalCost =
                        bath.waterCost + bath.energyCost;

                    const isExpanded = expandedBath === index;

                    return (
                        <article
                            className={`${styles.bath} ${
                                isExpanded ? styles.expanded : ""
                            }`}
                            key={`${bath.date}-${bath.duration}`}
                        >
                            <button
                                className={styles.bathButton}
                                onClick={() => toggleBath(index)}
                                aria-expanded={isExpanded}
                            >
                                <div className={styles.bathHeader}>
                                    <div>
                                        <h2>{bath.date}</h2>

                                        <span>
                                            ⏱ {bath.duration}
                                        </span>
                                    </div>

                                    <div className={styles.cost}>
                                        <strong>
                                            R$ {totalCost.toFixed(2)}
                                        </strong>

                                        <span>
                                            {isExpanded ? "▲" : "▼"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.data}>
                                    <div>
                                        <span>Água</span>

                                        <strong>
                                            💧 {bath.water.toFixed(1)} L
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Energia</span>

                                        <strong>
                                            ⚡ {bath.energy.toFixed(2)} kWh
                                        </strong>
                                    </div>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className={styles.details}>
                                    <div className={styles.detail}>
                                        <span>Consumo de água</span>
                                        <strong>
                                            {bath.water.toFixed(1)} L
                                        </strong>
                                    </div>

                                    <div className={styles.detail}>
                                        <span>Consumo de energia</span>
                                        <strong>
                                            {bath.energy.toFixed(2)} kWh
                                        </strong>
                                    </div>

                                    <div className={styles.detail}>
                                        <span>Potência selecionada</span>
                                        <strong>
                                            {bath.power}
                                        </strong>
                                    </div>

                                    <div className={styles.detail}>
                                        <span>Custo da água</span>
                                        <strong>
                                            R$ {bath.waterCost.toFixed(2)}
                                        </strong>
                                    </div>

                                    <div className={styles.detail}>
                                        <span>Custo da energia</span>
                                        <strong>
                                            R$ {bath.energyCost.toFixed(2)}
                                        </strong>
                                    </div>

                                    <div className={styles.detail}>
                                        <span>Duração</span>
                                        <strong>
                                            {bath.duration}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}