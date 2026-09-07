"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTranslation } from "@/store/useLocaleStore";
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md transition-colors">
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
            <span className="text-lg font-bold tracking-tight text-white">
              Nomguzor
            </span>
            <span className="text-xs font-medium text-zinc-400">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Right Action Controls: Language Switcher & Favorites */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 shadow-inner">
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
                      ? "bg-zinc-800 text-emerald-400 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  )}
                  title={localeLabels[loc].full}
                  aria-label={localeLabels[loc].full}
                >
                  {localeLabels[loc].label}
                </button>
              );
            })}
          </div>

          {/* Favorites Link */}
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-sm font-medium text-zinc-200 hover:border-rose-900/60 hover:bg-rose-950/30 hover:text-rose-400 transition-all active:scale-95"
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
