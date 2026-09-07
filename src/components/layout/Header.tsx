"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTranslation } from "@/store/useLocaleStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Locale, localeLabels } from "@/locales";
import { cn } from "@/lib/utils";

const locales: Locale[] = ["tg", "ru", "en"];

export function Header() {
  const { locale, setLocale, t } = useTranslation();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? favoriteIds.length : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85 transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-150 active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30">
            <BookMarked className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Nomguzor
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Right Action Controls: Language Switcher, Theme Toggle & Favorites */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/90">
            {locales.map((loc) => {
              const isActive = locale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocale(loc)}
                  className={cn(
                    "flex h-7 items-center justify-center rounded-lg px-2 text-xs font-bold transition-all duration-150 select-none",
                    isActive
                      ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                  )}
                  title={localeLabels[loc].full}
                  aria-label={localeLabels[loc].full}
                >
                  {localeLabels[loc].label}
                </button>
              );
            })}
          </div>

          {/* Theme Toggle Button (Sun / Moon) */}
          <ThemeToggle />

          {/* Favorites Link */}
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-700 hover:border-rose-300 hover:bg-rose-50/70 hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all active:scale-95 shadow-xs"
          >
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500/30" />
            <span className="hidden sm:inline">{t("favorites")}</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white shadow-sm">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
