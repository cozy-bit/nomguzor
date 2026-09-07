import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "male" | "female" | "registry" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors";

  const variantStyles = {
    default:
      "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300",
    male:
      "bg-sky-50 text-sky-700 border border-sky-200/70 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30",
    female:
      "bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    registry:
      "bg-emerald-50/80 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-300/80 dark:border-emerald-800/30",
    outline:
      "border border-slate-200 text-slate-700 dark:border-zinc-800 dark:text-zinc-300",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
