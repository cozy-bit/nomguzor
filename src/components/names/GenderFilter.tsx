"use client";

import React from "react";
import { Gender } from "@/types/name";
import { cn } from "@/lib/utils";
import { Users, User, HeartHandshake } from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";

export type FilterGender = "all" | Gender;

interface GenderFilterProps {
  value: FilterGender;
  onChange: (value: FilterGender) => void;
}

export function GenderFilter({ value, onChange }: GenderFilterProps) {
  const { t } = useTranslation();

  const filters = [
    { id: "all" as FilterGender, label: t("all"), icon: Users },
    { id: "male" as FilterGender, label: t("male"), icon: User },
    { id: "female" as FilterGender, label: t("female"), icon: HeartHandshake },
  ];

  return (
    <div className="inline-flex rounded-xl bg-zinc-950/60 p-1 border border-zinc-800/80 shadow-inner">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = value === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 select-none",
              isActive
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isActive
                  ? filter.id === "male"
                    ? "text-sky-400"
                    : filter.id === "female"
                    ? "text-rose-400"
                    : "text-emerald-400"
                  : "text-zinc-500"
              )}
            />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
