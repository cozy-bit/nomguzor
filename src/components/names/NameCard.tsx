"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NameItem } from "@/types/name";
import { Badge } from "@/components/ui/Badge";
import { Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";

interface NameCardProps {
  nameItem: NameItem;
}

export function NameCard({ nameItem }: NameCardProps) {
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
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800/90 dark:bg-slate-900/90 dark:hover:border-slate-700">
      <div>
        {/* Header inside card: First letter badge, Name & Like button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-800 shadow-inner dark:bg-slate-800 dark:text-slate-100">
              {nameItem.firstLetter || nameItem.name.charAt(0)}
            </span>
            <div>
              <Link
                href={`/name/${nameItem.slug}`}
                className="text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400"
              >
                {nameItem.name}
              </Link>
              {nameItem.origin && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {nameItem.origin}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150 active:scale-90",
              isFavorite
                ? "bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400 shadow-xs"
                : "text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
            )}
            aria-label={isFavorite ? "Аз дӯстдошта гирифтан" : "Ба дӯстдошта илова кардан"}
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
            {nameItem.gender === "male" ? "Мардона" : "Занона"}
          </Badge>

          {nameItem.inRegistry && (
            <Badge variant="registry">
              <CheckCircle2 className="h-3 w-3" />
              Дар феҳрист
            </Badge>
          )}
        </div>

        {/* Meaning */}
        <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {nameItem.meaning}
        </p>
      </div>

      {/* Footer Link */}
      <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <Link
          href={`/name/${nameItem.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          <span>Муфассал</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
