"use client";

import React from "react";
import Link from "next/link";
import { BookOpenCheck, Heart } from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 transition-colors">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <BookOpenCheck className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-zinc-200">
                Nomguzor
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-md">
              {t("footerDesc")}
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <Link
              href="/"
              className="hover:text-emerald-400 transition-colors"
            >
              {t("catalog")}
            </Link>
            <Link
              href="/favorites"
              className="hover:text-rose-400 transition-colors"
            >
              {t("favorites")}
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-zinc-850 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {currentYear} Nomguzor. {t("copyright")}</p>
          <p className="flex items-center gap-1">
            {t("withLove")} <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
