import React from "react";
import { NameItem } from "@/types/name";
import { NameCard } from "./NameCard";
import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NameListProps {
  names: NameItem[];
  emptyMessage?: string;
  emptySubtext?: string;
  onResetFilters?: () => void;
}

export function NameList({
  names,
  emptyMessage = "Ҳеҷ чиз ёфт нашуд",
  emptySubtext = "Чунин ном дар феҳристи расмӣ пайдо нашуд. Лутфан имлои онро санҷед ё дигар калимаро ҷустуҷӯ намоед.",
  onResetFilters,
}: NameListProps) {
  if (names.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Search className="h-6 w-6" />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-xs">
            ?
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {emptyMessage}
        </h3>
        <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {emptySubtext}
        </p>
        {onResetFilters && (
          <div className="mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Тоза кардани филтрҳо</span>
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
