"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";

export const popularNamesList = [
  { name: "Анушервон", slug: "anushervon" },
  { name: "Рустам", slug: "rustam" },
  { name: "Сомон", slug: "somon" },
  { name: "Сиёвуш", slug: "siyovush" },
  { name: "Малика", slug: "malika" },
  { name: "Ороста", slug: "orosta" },
  { name: "Фаришта", slug: "farishta" },
  { name: "Шукрона", slug: "shukrona" },
  { name: "Дилшод", slug: "dilshod" },
  { name: "Нигина", slug: "nigina" },
  { name: "Нозанин", slug: "nozanin" },
  { name: "Ҷамшед", slug: "jamshed" },
];

interface PopularNamesProps {
  onSelectName: (name: string) => void;
}

export function PopularNames({ onSelectName }: PopularNamesProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 shrink-0">
        <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{t("popularNames")}:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {popularNamesList.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelectName(item.name)}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/70 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white transition-all active:scale-95 shadow-2xs select-none"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
