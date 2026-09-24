import Link from "next/link";
import styles from "./recentbaths.module.css";

const recentBaths = [
    {
        date: "24/09",
        duration: "05:32",
        water: 38.5,
        energy: 0.53,
    },
    {
        date: "23/09",
        duration: "06:10",
        water: 42.1,
        energy: 0.61,
    },
    {
        date: "22/09",
        duration: "05:48",
        water: 40.2,
        energy: 0.57,
    },
    {
        date: "21/09",
        duration: "06:02",
        water: 44.0,
        energy: 0.64,
    },
    {
        date: "20/09",
        duration: "05:35",
        water: 37.8,
        energy: 0.51,
    },
];

export default function RecentBaths() {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2>Últimos banhos</h2>

                <Link href="/history">
                    Ver histórico →
                </Link>
            </div>

            <div className={styles.list}>
                {recentBaths.map((bath) => (
                    <div className={styles.bath} key={`${bath.date}-${bath.duration}`}>
                        <div className={styles.date}>
                            <strong>{bath.date}</strong>
                            <span>⏱ {bath.duration}</span>
                        </div>

                        <div className={styles.data}>
                            <span>💧 {bath.water.toFixed(1)} L</span>
                            <span>⚡ {bath.energy.toFixed(2)} kWh</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}