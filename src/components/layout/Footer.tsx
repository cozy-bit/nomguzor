import React from "react";
import Link from "next/link";
import { BookOpenCheck, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <BookOpenCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Nomguzor
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Феҳристи миллии номҳои тоҷикӣ — интихоби огоҳона ва эҳтироми асолати забону фарҳанг.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/favorites"
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Интихобшуда
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-800/50 dark:text-slate-500 sm:flex-row">
          <p>© {currentYear} Nomguzor. Ҳамаи ҳуқуқҳо маҳфузанд.</p>
          <p className="flex items-center gap-1">
            Бо муҳаббат ба фарҳанги тоҷикӣ <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
