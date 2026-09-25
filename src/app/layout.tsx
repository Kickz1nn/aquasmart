import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import ServiceWorkerRegistration from "@/components/serviceworkerregistration";

export const metadata: Metadata = {
  title: "AquaSmart",
  description: "Aplicação para gerenciamento de água no banho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ServiceWorkerRegistration />
        <Navbar />
        {children}
      </body>
    </html>
  );
}