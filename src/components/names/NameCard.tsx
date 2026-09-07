"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NameItem } from "@/types/name";
import { Badge } from "@/components/ui/Badge";
import { Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTranslation } from "@/store/useLocaleStore";
import { cn } from "@/lib/utils";

interface NameCardProps {
  nameItem: NameItem;
}

export function NameCard({ nameItem }: NameCardProps) {
  const { t } = useTranslation();
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavoriteStore = useFavoritesStore((state) => state.isFavorite(nameItem.id));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorite = mounted && isFavoriteStore;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(nameItem.id);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/90 dark:hover:shadow-xl dark:hover:shadow-black/40 cursor-pointer">
      {/* Stretched Link to make entire card clickable */}
      <Link
        href={`/name/${nameItem.slug}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        aria-label={`${t("details")} — ${nameItem.name}`}
      />

      <div className="relative z-10 pointer-events-none">
        {/* Header: First letter badge, Name & Like button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-800 border border-slate-200/70 shadow-inner group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700/50 dark:group-hover:bg-zinc-700 dark:group-hover:text-emerald-400 transition-colors">
              {nameItem.firstLetter || nameItem.name.charAt(0)}
            </span>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                {nameItem.name}
              </h3>
              {nameItem.translit && (
                <p className="font-mono text-xs text-slate-400 dark:text-zinc-400 tracking-wide mt-0.5">
                  {nameItem.translit}
                </p>
              )}
            </div>
          </div>

          {/* Interactive Favorite Button */}
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "pointer-events-auto relative z-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-150 active:scale-90",
              isFavorite
                ? "bg-rose-50 text-rose-500 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50 shadow-xs"
                : "text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
            )}
            aria-label={isFavorite ? t("inFavorites") : t("addToFavorites")}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isFavorite && "fill-rose-500 scale-110"
              )}
            />
          </button>
        </div>

        {/* Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          <Badge variant={nameItem.gender === "male" ? "male" : "female"}>
            {nameItem.gender === "male" ? t("male") : t("female")}
          </Badge>

          {nameItem.inRegistry && (
            <Badge variant="registry">
              <CheckCircle2 className="h-3 w-3" />
              {t("inRegistry")}
            </Badge>
          )}
        </div>

        {/* Meaning if provided */}
        {nameItem.meaning ? (
          <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            {nameItem.meaning}
          </p>
        ) : null}
      </div>

      {/* Footer link indication */}
      <div className="relative z-10 pointer-events-none mt-5 border-t border-slate-100 dark:border-zinc-800/80 pt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300 transition-colors">
          <span>{t("details")}</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>

        {nameItem.origin && (
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">
            {nameItem.origin}
          </span>
        )}
      </div>
    </div>
  );
}
