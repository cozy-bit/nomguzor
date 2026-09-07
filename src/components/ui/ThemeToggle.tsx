"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/store/useThemeStore";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-10 w-10 rounded-xl border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900/90",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-150 active:scale-95 shadow-xs select-none",
        "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
        "dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-800",
        className
      )}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      aria-label={isDark ? "Гузариш ба мавзӯи равшан" : "Гузариш ба мавзӯи торик"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-500 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
