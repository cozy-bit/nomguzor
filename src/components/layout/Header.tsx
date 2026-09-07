"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookMarked, Heart, Dices } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import rawNames from "@/data/names.json";

const allNames = rawNames as { slug: string }[];

export function Header() {
  const router = useRouter();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? favoriteIds.length : 0;

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * allNames.length);
    const chosen = allNames[randomIndex];
    if (chosen) {
      router.push(`/name/${chosen.slug}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85 transition-colors">
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
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Феҳристи номҳои тоҷикӣ
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
          >
            Каталог
          </Link>

          {/* Randomizer in Header */}
          <button
            type="button"
            onClick={handleRandom}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 transition-all active:scale-95"
            title="Номи тасодуфӣ"
          >
            <Dices className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Тасодуфӣ</span>
          </button>

          {/* Favorites Link */}
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 text-sm font-medium text-slate-700 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all active:scale-95"
          >
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500/30" />
            <span>Дӯстдошта</span>
            {count > 0 && (
              <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white shadow-sm">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
