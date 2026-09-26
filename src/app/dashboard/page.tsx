import styles from "./dashboard.module.css";
import ConsumptionChart from "@/components/consumptionchart";

const waterData = [
    { month: "Jan", consumption: 120 },
    { month: "Fev", consumption: 135 },
    { month: "Mar", consumption: 128 },
    { month: "Abr", consumption: 142 },
    { month: "Mai", consumption: 156 },
    { month: "Jun", consumption: 149 },
];

const energyData = [
    { month: "Jan", consumption: 1.82 },
    { month: "Fev", consumption: 2.05 },
    { month: "Mar", consumption: 1.94 },
    { month: "Abr", consumption: 2.21 },
    { month: "Mai", consumption: 2.48 },
    { month: "Jun", consumption: 2.41 },
];

export default function Dashboard() {
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
                    <p>Água</p>
                    <strong>156,4 L</strong>
                    <span>↓ 8,2% este mês</span>
                </div>

                <div className={styles.card}>
                    <p>Energia</p>
                    <strong>2,41 kWh</strong>
                    <span>↓ 5,7% este mês</span>
                </div>

                <div className={styles.card}>
                    <p>Duração média</p>
                    <strong>05:42</strong>
                    <span>↓ 12s este mês</span>
                </div>
            </section>

            <section className={styles.chartCard}>
                <div>
                    <p>Consumo de água</p>
                    <h2>Consumo mensal</h2>
                </div>

                <ConsumptionChart
                    data={waterData}
                    unit="L"
                    color="#127e83"
                />
            </section>
            <section className={styles.chartCard}>
                <div>
                    <p>Consumo de energia</p>
                    <h2>Consumo mensal</h2>
                </div>

                <ConsumptionChart
                    data={energyData}
                    unit="kWh"
                    color="#d28b32"
                />
            </section>
        </main>
    );
}