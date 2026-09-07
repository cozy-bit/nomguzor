"use client";

import React, { useState, useMemo } from "react";
import { Users, Copy, Check, Scale } from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";
import { cn } from "@/lib/utils";

interface PatronymicPreviewProps {
  name: string;
  gender: "male" | "female";
}

type OfficialFormatStyle = "suffix" | "izofat";

export function PatronymicPreview({ name, gender }: PatronymicPreviewProps) {
  const { t } = useTranslation();
  const [fatherName, setFatherName] = useState("Ҷамшед");
  const [selectedFormat, setSelectedFormat] =
    useState<OfficialFormatStyle>("suffix");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper for izofat connector:
  // If ends with vowel: "а, о, ӯ, е, и" -> attached with "-и" or "-йи" (e.g. Анора -> Анораи, Сино -> Синои, Саъдӣ -> Саъдийи)
  const izofatName = useMemo(() => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    const lastChar = trimmed.slice(-1).toLowerCase();

    if (lastChar === "ӣ") {
      return `${trimmed.slice(0, -1)}йи`;
    }
    if (lastChar === "и") {
      return `${trimmed}йи`;
    }
    return `${trimmed}и`;
  }, [name]);

  const activeFatherName = fatherName.trim() || "Ҷамшед";

  // Compute strictly the 2 RT legal national formats
  const formats = useMemo(() => {
    const fn = activeFatherName;
    const isMale = gender === "male";

    // 1. Бо пасванд (-зод барои мардона / -зода барои занона)
    const suffix = isMale ? "зод" : "зода";
    const suffixPrimary = `${izofatName} ${fn}${suffix}`;
    const suffixPassport = `${fn}${suffix} ${name}`;

    // 2. Изофатӣ ({Исм}и {НомиПадар})
    const izofatPrimary = `${izofatName} ${fn}`;
    const izofatPassport = `${fn} ${name}`;

    return {
      suffix: {
        primary: suffixPrimary,
        passport: suffixPassport,
      },
      izofat: {
        primary: izofatPrimary,
        passport: izofatPassport,
      },
    };
  }, [activeFatherName, izofatName, gender, name]);

  const currentResult = formats[selectedFormat];

  const handleCopy = async (text: string, key: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-850/60 transition-all">
      {/* Block Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t("patronymicTitle")}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 sm:line-clamp-none">
              {t("patronymicDesc")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-5 space-y-4">
        {/* Input: Father's Name */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
          <label
            htmlFor="fatherNameInput"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 shrink-0 sm:w-28"
          >
            {t("fatherNameLabel")}:
          </label>
          <div className="relative w-full flex-1">
            <input
              id="fatherNameInput"
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder={t("fatherNamePlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Minimalist 2-tab switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setSelectedFormat("suffix")}
            className={cn(
              "w-full rounded-lg py-2 px-2 text-xs sm:text-sm font-semibold transition-all select-none text-center truncate",
              selectedFormat === "suffix"
                ? "bg-white text-emerald-700 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {t("suffixFormat")}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat("izofat")}
            className={cn(
              "w-full rounded-lg py-2 px-2 text-xs sm:text-sm font-semibold transition-all select-none text-center truncate",
              selectedFormat === "izofat"
                ? "bg-white text-emerald-700 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {t("izofatFormat")}
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent p-4 sm:p-5 dark:border-emerald-500/20 dark:from-emerald-950/20 dark:to-transparent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full sm:flex-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {selectedFormat === "suffix"
                  ? t("suffixFormat")
                  : t("izofatFormat")}
              </span>
              <div className="mt-1 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-words">
                {currentResult.primary}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentResult.primary, "primary")}
              className="w-full sm:w-auto inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-xs"
              title={t("copyFullName")}
            >
              {copiedKey === "primary" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t("copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-300" />
                  <span>{t("copyFullName")}</span>
                </>
              )}
            </button>
          </div>

          {/* Legal Citation Notice */}
          <div className="mt-3.5 pt-3 border-t border-emerald-500/10 dark:border-zinc-800/80 flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">
            <Scale className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{t("lawNotice")}</span>
          </div>
        </div>

        {/* Passport Form Variant */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500">
              {t("passportFormat")}
            </span>
            <div className="font-semibold text-sm text-slate-900 dark:text-zinc-200 truncate">
              {currentResult.passport}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(currentResult.passport, "passport")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 transition-colors shrink-0"
          >
            {copiedKey === "passport" ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                  {t("copied")}
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
                <span>{t("copyLink")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
