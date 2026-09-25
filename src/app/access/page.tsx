"use client";

import { FormEvent, useState } from "react";
import styles from "./access.module.css";

const ACCESS_CODE = "231206";

export default function Access() {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [isValid, setIsValid] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const valid = code === ACCESS_CODE;
        setIsValid(valid);
        setMessage(valid ? "Código confirmado. Vamos começar." : "Código incorreto. Tente novamente.");

        if (valid) {
            document.cookie = "aquasmart_access=true; Path=/; Max-Age=86400; SameSite=Lax";
            window.location.replace("/");
        }
    }

    return (
        <main className={styles.page}>
            <div className={styles.glow} aria-hidden="true" />
            <section className={styles.card} aria-labelledby="access-title">
                <div className={styles.brandMark} aria-hidden="true">
                    <span>〰</span>
                </div>

                <p className={styles.eyebrow}>AquaSmart</p>
                <h1 id="access-title">Bem-vindo</h1>
                <p className={styles.description}>
                    Insira o código do produto para a visualização do seu consumo.
                </p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="access-code">Código de acesso</label>
                    <input
                        id="access-code"
                        name="access-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={6}
                        placeholder="••••••"
                        value={code}
                        onChange={(event) => {
                            setCode(event.target.value.replace(/\D/g, ""));
                            setMessage("");
                            setIsValid(false);
                        }}
                        aria-describedby={message ? "access-message" : undefined}
                        required
                    />
                    <button type="submit">Começar análise <span aria-hidden="true">→</span></button>
                </form>

                {message && (
                    <p
                        id="access-message"
                        className={`${styles.message} ${isValid ? styles.success : styles.error}`}
                        role="status"
                    >
                        {message}
                    </p>
                )}
            </section>
        </main>
    );
}