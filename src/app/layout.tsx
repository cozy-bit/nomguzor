import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nomguzor — Каталог таджикских имён | Феҳристи номҳои тоҷикӣ",
  description:
    "Ҷустуҷӯ ва интихоби огоҳонаи номҳои миллии тоҷикӣ. Маъно, пайдоиш ва санҷиши мутобиқат ба феҳристи расмии номгузорӣ.",
  keywords: [
    "номҳои тоҷикӣ",
    "каталог таджикских имен",
    "номи тоҷикӣ барои писар",
    "номи тоҷикӣ барои духтар",
    "феҳристи номҳо",
    "Nomguzor",
  ],
  authors: [{ name: "Nomguzor Team" }],
  openGraph: {
    title: "Nomguzor — Каталог таджикских имён",
    description:
      "Мукаммалтарин роҳнамо ва феҳристи номҳои зебои тоҷикӣ бо маънову реша.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tg" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className="flex min-h-full flex-col bg-slate-50/70 text-slate-900 antialiased selection:bg-emerald-500/20 selection:text-emerald-800 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-300"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
