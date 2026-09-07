import React from "react";
import { NameItem } from "@/types/name";
import { NameCard } from "./NameCard";
import { SearchX } from "lucide-react";

interface NameListProps {
  names: NameItem[];
  emptyMessage?: string;
  emptySubtext?: string;
}

export function NameList({
  names,
  emptyMessage = "Ҳеҷ номе ёфт нашуд",
  emptySubtext = "Кӯшиш кунед, ки дархости ҷустуҷӯ ё филтрро иваз намоед.",
}: NameListProps) {
  if (names.length === 0) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {emptyMessage}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          {emptySubtext}
        </p>
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
