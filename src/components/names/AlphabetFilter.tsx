"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const TAJIK_ALPHABET = [
  "Ҳама",
  "А", "Б", "В", "Г", "Ғ", "Д", "Е", "Ё", "Ж", "З",
  "И", "Ӣ", "Й", "К", "Қ", "Л", "М", "Н", "О", "П",
  "Р", "С", "Т", "У", "Ӯ", "Ф", "Х", "Ҳ", "Ч", "Ҷ",
  "Ш", "Ъ", "Э", "Ю", "Я",
];

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  availableLetters?: Set<string>;
}

export function AlphabetFilter({
  selectedLetter,
  onSelectLetter,
  availableLetters,
}: AlphabetFilterProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none">
        {TAJIK_ALPHABET.map((letter) => {
          const isAll = letter === "Ҳама";
          const isSelected = isAll
            ? !selectedLetter || selectedLetter === "Ҳама"
            : selectedLetter === letter;

          const isAvailable =
            isAll || !availableLetters || availableLetters.has(letter);

          return (
            <button
              key={letter}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectLetter(isAll ? "" : letter)}
              className={cn(
                "flex h-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95",
                isAll ? "px-3.5" : "min-w-9 px-2",
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25 dark:bg-emerald-500 dark:text-slate-950"
                  : isAvailable
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  : "bg-slate-100/50 text-slate-300 dark:bg-slate-900/50 dark:text-slate-700 cursor-not-allowed"
              )}
              aria-label={`Фильтр аз рӯи ҳарфи ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
