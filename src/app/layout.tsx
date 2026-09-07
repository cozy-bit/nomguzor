import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  themeColor: "#090D16",
};

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nomguzor",
  },
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
    <html lang="tg" className="h-full scroll-smooth dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('nomguzor-theme');
                var theme = stored ? JSON.parse(stored).state?.theme : 'dark';
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className="flex min-h-full flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900 dark:bg-zinc-950 dark:text-zinc-100 dark:selection:bg-emerald-500/20 dark:selection:text-emerald-300 antialiased transition-colors duration-150"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
