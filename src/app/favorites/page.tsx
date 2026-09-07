"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import rawNames from "@/data/names.placeholder.json";
import { NameItem } from "@/types/name";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { NameList } from "@/components/names/NameList";
import { Button } from "@/components/ui/Button";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";

const allNames: NameItem[] = rawNames as NameItem[];

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="h-48 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900" />
      </div>
    );
  }

  const favoriteNames = allNames.filter((item) => favoriteIds.includes(item.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Баргаштан ба каталог
            </Link>
          </div>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            <span>Номҳои дӯстдошта</span>
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-rose-100 px-2 text-xs font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-300">
              {favoriteNames.length}
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Рӯйхати шахсии номҳое, ки шумо қайд намудаед.
          </p>
        </div>

        {favoriteNames.length > 0 && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFavorites}
              className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Тоза кардани рӯйхат
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {favoriteNames.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400 mb-4">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Шумо то ҳол номеро ба дӯстдошта илова накардаед
          </h2>
          <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            Дар каталоги асосӣ ба нишони дил клик кунед, то номҳои писандидаи худро дар ин ҷо захира кунед.
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="primary" size="md">
                Гузариш ба каталог
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <NameList names={favoriteNames} />
      )}
    </div>
  );
}
