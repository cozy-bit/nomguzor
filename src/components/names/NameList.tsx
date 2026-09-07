"use client";

import React from "react";
import { NameItem } from "@/types/name";
import { NameCard } from "./NameCard";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/store/useLocaleStore";

interface NameListProps {
  names: NameItem[];
  emptyMessage?: string;
  emptySubtext?: string;
  onResetFilters?: () => void;
}

export function NameList({
  names,
  emptyMessage,
  emptySubtext,
  onResetFilters,
}: NameListProps) {
  const { t } = useTranslation();

  if (names.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200/80 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800">
          <Search className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-xs">
            ?
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {emptyMessage || t("notFoundTitle")}
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          {emptySubtext || t("notFoundDesc")}
        </p>
        {onResetFilters && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-750 dark:hover:text-white shadow-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t("resetFilters")}</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {names.map((item) => (
        <NameCard key={item.id} nameItem={item} />
      ))}
    </div>
  );
}
