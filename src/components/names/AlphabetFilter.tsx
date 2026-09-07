"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/store/useLocaleStore";

export const TAJIK_LETTERS = [
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
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden select-none">
        {/* All button */}
        <button
          type="button"
          onClick={() => onSelectLetter("")}
          className={cn(
            "flex h-9 shrink-0 items-center justify-center rounded-xl px-3.5 text-xs font-semibold transition-all duration-150 active:scale-95",
            !selectedLetter
              ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/25"
              : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          )}
        >
          {t("all")}
        </button>

        {/* Alphabet Letters */}
        {TAJIK_LETTERS.map((letter) => {
          const isSelected = selectedLetter === letter;
          const isAvailable = !availableLetters || availableLetters.has(letter);

          return (
            <button
              key={letter}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelectLetter(letter)}
              className={cn(
                "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl px-2 text-xs font-semibold transition-all duration-150 active:scale-95",
                isSelected
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/25"
                  : isAvailable
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  : "bg-zinc-950 text-zinc-700 border border-zinc-900/50 cursor-not-allowed"
              )}
              aria-label={`Ҳарфи ${letter}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
