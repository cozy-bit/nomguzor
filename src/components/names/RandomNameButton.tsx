"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dices, Sparkles } from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";
import { cn } from "@/lib/utils";

const allNames = rawNames as NameItem[];

interface RandomNameButtonProps {
  currentSlug: string;
  className?: string;
}

export function RandomNameButton({
  currentSlug,
  className,
}: RandomNameButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isRolling, setIsRolling] = useState(false);

  const handleRandom = () => {
    setIsRolling(true);
    const pool = allNames.filter((item) => item.slug !== currentSlug);
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    if (chosen) {
      router.push(`/name/${chosen.slug}`);
    }

    setTimeout(() => {
      setIsRolling(false);
    }, 600);
  };

  return (
    <button
      type="button"
      onClick={handleRandom}
      disabled={isRolling}
      className={cn(
        "group relative inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] hover:bg-[position:right_center] px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 select-none shrink-0 disabled:opacity-80",
        className
      )}
      title={t("random")}
      aria-label={t("random")}
    >
      <Dices
        className={cn(
          "h-4 w-4 text-white transition-transform duration-500",
          isRolling && "rotate-[360deg] scale-110"
        )}
      />
      <span className="tracking-tight">{t("random")}</span>
      <Sparkles className="h-3.5 w-3.5 text-emerald-200 opacity-80 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
