"use client";

import { useState, useEffect } from "react";
import styles from "./bathcarousel.module.css";

export default function BathCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const currentBath = {
        water: 38.5,
        waterCost: 0.32,
        energy: 0.53,
        energyCost: 0.48,
        duration: "05:32",
    };

    const previousBath = {
        water: 42.1,
        energy: 0.61,
        duration: "06:10",
    };

    const waterDifference =
        ((previousBath.water - currentBath.water) /
            previousBath.water) *
        100;

    const energyDifference =
        ((previousBath.energy - currentBath.energy) /
            previousBath.energy) *
        100;

    return (
        <div className={styles.carousel}>
            <div className={styles.card}>
                <h2>Banho Atual</h2>

                <div className={styles.viewport}>
                    <div
                        className={styles.slides}
                        style={{
                            transform: `translateX(-${currentSlide * 100}%)`,
                        }}
                    >
                        {/* Slide Água */}
                        <div className={styles.slide}>
                            <h3>Água</h3>

                            <p className={styles.mainValue}>
                                {currentBath.water} L
                            </p>

                            <div className={styles.details}>
                                <p>
                                    R$ {currentBath.waterCost.toFixed(2)}
                                </p>

                                <p>
                                    ⏱ {currentBath.duration}
                                </p>
                            </div>
                        </div>

                        {/* Slide Energia */}
                        <div className={styles.slide}>
                            <h3>Energia</h3>

                            <p className={styles.mainValue}>
                                {currentBath.energy} kWh
                            </p>

                            <div className={styles.details}>
                                <p>
                                    R$ {currentBath.energyCost.toFixed(2)}
                                </p>

                                <p>
                                    ⏱ {currentBath.duration}
                                </p>
                            </div>
                        </div>

                        {/* Slide Comparativo */}
                        <div className={styles.slide}>
                            <h3>Comparativo</h3>

                            <div className={styles.comparison}>
                                <div>
                                    <strong>Banho atual</strong>

                                    <p>
                                        💧 {currentBath.water} L
                                    </p>

                                    <p>
                                        ⚡ {currentBath.energy} kWh
                                    </p>
                                </div>

                                <div>
                                    <strong>Banho anterior</strong>

                                    <p>
                                        💧 {previousBath.water} L
                                    </p>

                                    <p>
                                        ⚡ {previousBath.energy} kWh
                                    </p>
                                </div>
                            </div>

                            <div className={styles.difference}>
                                <p>
                                    ↓ {waterDifference.toFixed(1)}% de água
                                </p>

                                <p>
                                    ↓ {energyDifference.toFixed(1)}% de energia
                                </p>
                            </div>

                            <p className={styles.duration}>
                                ⏱ {currentBath.duration}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.indicators}>
                    <span
                        className={
                            currentSlide === 0
                                ? styles.active
                                : ""
                        }
                    >
                        ●
                    </span>

                    <span
                        className={
                            currentSlide === 1
                                ? styles.active
                                : ""
                        }
                    >
                        ●
                    </span>

                    <span
                        className={
                            currentSlide === 2
                                ? styles.active
                                : ""
                        }
                    >
                        ●
                    </span>
                </div>

                <div className={styles.navigation}>
                    <button
                        className={styles.button}
                        onClick={() =>
                            setCurrentSlide(
                                (prev) => (prev - 1 + 3) % 3
                            )
                        }
                    >
                        ← Anterior
                    </button>

                    <button
                        className={styles.button}
                        onClick={() =>
                            setCurrentSlide(
                                (prev) => (prev + 1) % 3
                            )
                        }
                    >
                        Próximo →
                    </button>
                </div>
            </div>
        </div>
    );
}