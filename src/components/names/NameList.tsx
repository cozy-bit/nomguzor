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
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center shadow-xs">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-850 text-zinc-400 border border-zinc-800">
          <Search className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-zinc-950 shadow-xs">
            ?
          </span>
        </div>
        <h3 className="text-lg font-bold text-white">
          {emptyMessage || t("notFoundTitle")}
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-zinc-400 leading-relaxed">
          {emptySubtext || t("notFoundDesc")}
        </p>
        {onResetFilters && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              className="gap-2 border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-750 hover:text-white"
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
