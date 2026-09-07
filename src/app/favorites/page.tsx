"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTranslation } from "@/store/useLocaleStore";
import { NameList } from "@/components/names/NameList";
import { Button } from "@/components/ui/Button";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";

const allNames: NameItem[] = rawNames as NameItem[];

export default function FavoritesPage() {
  const { t } = useTranslation();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="h-48 animate-pulse rounded-3xl bg-zinc-900 border border-zinc-800" />
      </div>
    );
  }

  const favoriteNames = allNames.filter((item) => favoriteIds.includes(item.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("backToCatalog")}</span>
            </Link>
          </div>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <span>{t("favorites")}</span>
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-rose-950/60 px-2 text-xs font-bold text-rose-400 border border-rose-900/60">
              {favoriteNames.length}
            </span>
          </h1>
        </div>

        {favoriteNames.length > 0 && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFavorites}
              className="text-xs text-rose-400 border-rose-950 hover:bg-rose-950/40 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t("clearFavorites")}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {favoriteNames.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/40 border border-rose-900/40 text-rose-400 mb-4">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {t("noFavoritesTitle")}
          </h2>
          <p className="mt-1.5 max-w-sm text-xs text-zinc-400 leading-relaxed">
            {t("noFavoritesDesc")}
          </p>
          <div className="mt-6">
            <Link href="/">
              <Button variant="primary" size="md">
                {t("goToCatalog")}
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
