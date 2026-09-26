import styles from "./settings.module.css";

export default function Settings() {
    return (
        <main className={styles.settings}>
            <header className={styles.header}>
                <p>Preferências</p>
                <h1>Configurações</h1>
                <span>
                    Ajuste as preferências utilizadas pelo AquaSmart.
                </span>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p>Dados</p>
                    <span>
                        Configure as unidades e valores utilizados nos cálculos
                        de consumo.
                    </span>
                </div>

                <div className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="water-unit">
                            Unidade de água
                        </label>

                        <select id="water-unit" defaultValue="liters">
                            <option value="liters">
                                Litros (L)
                            </option>
                            <option value="cubic-meters">
                                Metros cúbicos (m³)
                            </option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="energy-unit">
                            Unidade de energia
                        </label>

                        <select id="energy-unit" defaultValue="kwh">
                            <option value="kwh">
                                Quilowatt-hora (kWh)
                            </option>
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
                                placeholder="0,00"
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
                                step="0.01"
                                placeholder="0,00"
                            />
                            <small>/ kWh</small>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <p>Aplicação</p>
                    <span>
                        Informações gerais sobre o aplicativo.
                    </span>
                </div>

                <div className={styles.applicationInfo}>
                    <div>
                        <span>Nome</span>
                        <strong>AquaSmart</strong>
                    </div>

                    <div>
                        <span>Versão</span>
                        <strong>1.0.0</strong>
                    </div>

                    <div>
                        <span>Descrição</span>
                        <strong>
                            Aplicação para acompanhamento
                            do consumo de água e energia no banho.
                        </strong>
                    </div>
                </div>
            </section>
        </main>
    );
}