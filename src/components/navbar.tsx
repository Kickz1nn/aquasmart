"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    if (pathname === "/access") {
        return null;
    }

    return (
        <nav className={menuOpen ? "navbar menuOpen" : "navbar"}>
            <h2 className="navBrand">
                <Link href="/">
                    <span className="navBrandMark" aria-hidden="true">〰</span>
                    <span>AquaSmart</span>
                </Link>
            </h2>

            <button
                className="menuToggle"
                type="button"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                aria-controls="primary-navigation"
                onClick={() => setMenuOpen((open) => !open)}
            >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
            </button>

            <ul id="primary-navigation">
                <li>
                    <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                </li>
                <li>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                </li>
                <li>
                    <Link href="/history" onClick={() => setMenuOpen(false)}>Histórico</Link>
                </li>
                <li>
                    <Link href="/settings" onClick={() => setMenuOpen(false)}>Configurações</Link>
                </li>
            </ul>
        </nav>
    )
}