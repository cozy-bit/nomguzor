"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { BookMarked, Heart, Menu, X, Globe } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const count = mounted ? favoriteIds.length : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85 transition-colors">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
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

        {/* Right Action Controls: Theme Toggle & Burger Menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button (placed to the left of the burger menu) */}
          <ThemeToggle />

          {/* Burger Menu Button (placed on the right) */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 shadow-xs select-none",
              menuOpen
                ? "border-emerald-500/50 bg-emerald-50/80 text-emerald-700 dark:border-emerald-600/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800"
            )}
            aria-label={menuOpen ? t("close") : t("menu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-200" />
            )}

            {/* Notification Badge on Burger Icon if favorites exist */}
            {count > 0 && !menuOpen && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs ring-2 ring-white dark:ring-zinc-950">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Burger Menu Backdrop */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] dark:bg-black/40 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Burger Menu Dropdown Panel */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-4 top-[calc(100%+0.5rem)] z-50 w-72 sm:w-80 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 transition-all"
            role="dialog"
            aria-modal="true"
          >
            {/* Section 1: Language Switcher */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t("language")}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-zinc-800 dark:bg-zinc-950/60">
                {locales.map((loc) => {
                  const isActive = locale === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocale(loc)}
                      className={cn(
                        "flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all duration-150 select-none",
                        isActive
                          ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                          : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                      )}
                      title={localeLabels[loc].full}
                    >
                      <span className="text-xs">{localeLabels[loc].label}</span>
                      <span className="text-[10px] font-medium opacity-75">
                        {localeLabels[loc].full}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3.5 h-px bg-slate-100 dark:bg-zinc-800/80" />

            {/* Section 2: Favorites Link */}
            <Link
              href="/favorites"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-rose-300 hover:bg-rose-50/70 hover:text-rose-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all active:scale-98 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-500 group-hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:group-hover:bg-rose-900/50 transition-colors">
                  <Heart className="h-4 w-4 fill-rose-500/30" />
                </div>
                <span>{t("favorites")}</span>
              </div>

              {count > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white shadow-xs">
                  {count}
                </span>
              ) : (
                <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">
                  0
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
