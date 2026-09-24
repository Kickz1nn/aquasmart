"use client";

import { useState } from "react";
import styles from "./bathcarousel.module.css";

export default function BathCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const slides = [
        {
            title: "Água",
            value: currentBath.water,
            cost: currentBath.waterCost,
            duration: currentBath.duration,
        },
        {
            title: "Energia",
            value: currentBath.energy,
            cost: currentBath.energyCost,
            duration: currentBath.duration,
        },
        {
            title: "Comparativo",
            duration: currentBath.duration,
        },
    ];

    return (
        <div className={styles.carousel}>
            <div className={styles.card}>
                <h2>Banho Atual</h2>

                {currentSlide === 2 ? (
                    <div>
                        <h3>Comparativo</h3>

                        <p>Banho atual</p>
                        <p>💧 {currentBath.water} L</p>
                        <p>⚡ {currentBath.energy} kWh</p>

                        <p>Banho anterior</p>
                        <p>💧 {previousBath.water} L</p>
                        <p>⚡ {previousBath.energy} kWh</p>

                        <p>↓ {waterDifference.toFixed(1)}% de água</p>
                        <p>↓ {energyDifference.toFixed(1)}% de energia</p>

                        <p>⏱ {currentBath.duration}</p>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <h3>{slides[currentSlide].title}</h3>

                        <p className={styles.mainValue}>
                            {currentSlide === 0
                                ? `${currentBath.water} L`
                                : `${currentBath.energy} kWh`}
                        </p>

                        <div className={styles.details}>
                            <p>
                                <span>R$</span> {currentSlide === 0
                                    ? currentBath.waterCost.toFixed(2)
                                    : currentBath.energyCost.toFixed(2)}
                            </p>

                            <p>⏱ {slides[currentSlide].duration}</p>
                        </div>
                    </div>
                )}

                <div>
                    <span>{currentSlide === 0 ? "●" : "○"}</span>
                    <span>{currentSlide === 1 ? "●" : "○"}</span>
                    <span>{currentSlide === 2 ? "●" : "○"}</span>
                </div>

                <button
                    onClick={() =>
                        setCurrentSlide((prev) => (prev - 1 + 3) % 3)
                    }
                >
                    Anterior
                </button>

                <button
                    onClick={() =>
                        setCurrentSlide((prev) => (prev + 1) % 3)
                    }
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}