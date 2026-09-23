"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    if (pathname === "/access") {
        return null;
    }

    return (
        <nav>
            <h2><Link href="/">AquaSmart</Link></h2>

            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link href="/history">Histórico</Link>
                </li>
                <li>
                    <Link href="/settings">Configurações</Link>
                </li>
            </ul>
        </nav>
    )
}