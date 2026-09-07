import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Locale } from "@/locales";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("nomguzor-theme")?.value;
  const localeCookie = cookieStore.get("nomguzor-locale")?.value as Locale | undefined;

  const theme = themeCookie === "light" ? "light" : "dark";
  const locale: Locale =
    localeCookie && ["tg", "ru", "en"].includes(localeCookie) ? localeCookie : "tg";

  return (
    <html
      lang={locale}
      className={theme === "light" ? "h-full scroll-smooth" : "h-full scroll-smooth dark"}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                function getCookie(name) {
                  var match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\\]\\\\/+^])/g, '\\\\$1') + '=([^;]*)'));
                  return match ? decodeURIComponent(match[1]) : null;
                }
                var theme = getCookie('nomguzor-theme');
                if (!theme) {
                  var stored = localStorage.getItem('nomguzor-theme');
                  theme = stored ? JSON.parse(stored).state?.theme : 'dark';
                }
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
