"use client";

import React from "react";
import { Gender } from "@/types/name";
import { cn } from "@/lib/utils";
import { Users, User, HeartHandshake } from "lucide-react";

export type FilterGender = "all" | Gender;

interface GenderFilterProps {
  value: FilterGender;
  onChange: (value: FilterGender) => void;
}

const filters: { id: FilterGender; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "Ҳама", icon: Users },
  { id: "male", label: "Мардона", icon: User },
  { id: "female", label: "Занона", icon: HeartHandshake },
];

export function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <div className="inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/80 shadow-inner">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = value === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 select-none",
              isActive
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors",
                isActive
                  ? filter.id === "male"
                    ? "text-sky-500"
                    : filter.id === "female"
                    ? "text-rose-500"
                    : "text-emerald-500"
                  : "text-slate-400"
              )}
            />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
