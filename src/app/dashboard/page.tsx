import styles from "./dashboard.module.css";

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
                    <p>Consumo mensal</p>
                    <h2>Comparativo</h2>
                </div>

                <div className={styles.chartPlaceholder}>
                    Gráfico
                </div>
            </section>
        </main>
    );
}