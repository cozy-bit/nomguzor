"use client";

import React, { useState, useMemo } from "react";
import { Users, Copy, Check, Sparkles } from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";
import { cn } from "@/lib/utils";

interface PatronymicPreviewProps {
  name: string;
  gender: "male" | "female";
}

type FormatStyle = "national" | "classic" | "traditional";

export function PatronymicPreview({ name, gender }: PatronymicPreviewProps) {
  const { t } = useTranslation();
  const [fatherName, setFatherName] = useState("Ҷамшед");
  const [selectedFormat, setSelectedFormat] = useState<FormatStyle>("national");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper to connect izofat "-и" (Анора -> Анораи, Рустам -> Рустами)
  const izofatName = useMemo(() => {
    const trimmed = name.trim();
    if (!trimmed) return "";
    const lastChar = trimmed.slice(-1).toLowerCase();
    if (lastChar === "ӣ") {
      return trimmed.slice(0, -1) + "йи";
    }
    return `${trimmed}и`;
  }, [name]);

  const activeFatherName = fatherName.trim() || "Ҷамшед";

  // Compute all variants
  const variants = useMemo(() => {
    const fn = activeFatherName;
    const isMale = gender === "male";
    const vowels = ["а", "о", "у", "ӯ", "и", "ӣ", "е", "ё", "э", "ю", "я"];
    const lastFatherChar = fn.slice(-1).toLowerCase();
    const isFatherVowel = vowels.includes(lastFatherChar);

    // 1. National Tajik (-зод / -зода)
    const national = isMale
      ? `${izofatName} ${fn}зод`
      : `${izofatName} ${fn}зода`;

    // 2. Classic (-ович / -овна / -вич)
    const patronymicSuffix = isMale
      ? isFatherVowel
        ? `${fn}евич`
        : `${fn}ович`
      : isFatherVowel
      ? `${fn}евна`
      : `${fn}овна`;
    const classic = `${patronymicSuffix} ${name}`;

    // 3. Traditional ({Name}i {FatherName})
    const traditional = `${izofatName} ${fn}`;

    return {
      national,
      classic,
      traditional,
    };
  }, [activeFatherName, izofatName, gender, name]);

  const activeFullName = variants[selectedFormat];

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-850/60 transition-all">
      {/* Block Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t("patronymicTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {t("patronymicDesc")}
            </p>
          </div>
        </div>
        <Sparkles className="hidden sm:block h-4 w-4 text-emerald-500/50" />
      </div>

      <div className="mt-5 space-y-4">
        {/* Input: Father's Name */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <label
            htmlFor="fatherNameInput"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 shrink-0 sm:w-28"
          >
            {t("fatherNameLabel")}:
          </label>
          <div className="relative flex-1">
            <input
              id="fatherNameInput"
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder={t("fatherNamePlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Format Selector (Tabs / Pills) */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setSelectedFormat("national")}
            className={cn(
              "flex-1 min-w-[130px] rounded-lg py-1.5 px-3 text-xs font-semibold transition-all select-none text-center",
              selectedFormat === "national"
                ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {t("nationalFormat")}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat("classic")}
            className={cn(
              "flex-1 min-w-[130px] rounded-lg py-1.5 px-3 text-xs font-semibold transition-all select-none text-center",
              selectedFormat === "classic"
                ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {t("classicFormat")}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat("traditional")}
            className={cn(
              "flex-1 min-w-[130px] rounded-lg py-1.5 px-3 text-xs font-semibold transition-all select-none text-center",
              selectedFormat === "traditional"
                ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            )}
          >
            {t("traditionalFormat")}
          </button>
        </div>

        {/* Big Live Preview Box */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent p-5 dark:border-emerald-500/20 dark:from-emerald-950/20 dark:to-transparent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {selectedFormat === "national"
                  ? t("nationalFormat")
                  : selectedFormat === "classic"
                  ? t("classicFormat")
                  : t("traditionalFormat")}
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white break-words">
                {activeFullName}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(activeFullName, "main")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-xs"
              title={t("copyFullName")}
            >
              {copiedKey === "main" ? (
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
        </div>

        {/* Small variants grid for quick picking */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {(["national", "classic", "traditional"] as FormatStyle[]).map((fmt) => {
            const val = variants[fmt];
            const isCurrent = selectedFormat === fmt;
            return (
              <div
                key={fmt}
                className={cn(
                  "flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all text-xs cursor-pointer",
                  isCurrent
                    ? "border-emerald-500/40 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                    : "border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-850"
                )}
                onClick={() => setSelectedFormat(fmt)}
              >
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-zinc-200 truncate">
                    {val}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(val, fmt);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-colors shrink-0"
                  aria-label="Copy"
                >
                  {copiedKey === fmt ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
