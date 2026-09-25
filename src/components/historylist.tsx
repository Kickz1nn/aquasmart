import styles from "./historylist.module.css";

const baths = [
    {
        date: "24/09/2026",
        duration: "05:32",
        water: 38.5,
        energy: 0.53,
        waterCost: 0.32,
        energyCost: 0.48,
    },
    {
        date: "23/09/2026",
        duration: "06:10",
        water: 42.1,
        energy: 0.61,
        waterCost: 0.35,
        energyCost: 0.56,
    },
    {
        date: "22/09/2026",
        duration: "05:48",
        water: 40.2,
        energy: 0.57,
        waterCost: 0.33,
        energyCost: 0.52,
    },
    {
        date: "21/09/2026",
        duration: "06:02",
        water: 44.0,
        energy: 0.64,
        waterCost: 0.36,
        energyCost: 0.59,
    },
    {
        date: "20/09/2026",
        duration: "05:35",
        water: 37.8,
        energy: 0.51,
        waterCost: 0.31,
        energyCost: 0.47,
    },
];

export default function HistoryList() {
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
                {baths.map((bath) => {
                    const totalCost =
                        bath.waterCost + bath.energyCost;

                    return (
                        <article
                            className={styles.bath}
                            key={`${bath.date}-${bath.duration}`}
                        >
                            <div className={styles.bathHeader}>
                                <div>
                                    <h2>{bath.date}</h2>
                                    <span>
                                        ⏱ {bath.duration}
                                    </span>
                                </div>

                                <strong>
                                    R$ {totalCost.toFixed(2)}
                                </strong>
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
                        </article>
                    );
                })}
            </div>
        </section>
    );
}