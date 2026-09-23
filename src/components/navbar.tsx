import Link from "next/link";

export default function Navbar() {
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