"use client";

import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import {
  Image as ImageIcon,
  Download,
  X,
  BookMarked,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useTranslation } from "@/store/useLocaleStore";

interface NameShareCardModalProps {
  name: string;
  translit?: string;
  gender: "male" | "female";
  meaning?: string;
  slug: string;
}

export function NameShareCardModal({
  name,
  translit,
  gender,
  meaning,
  slug,
}: NameShareCardModalProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      // Small timeout to allow styles to settle
      await new Promise((resolve) => setTimeout(resolve, 150));
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#090D16",
      });
      const link = document.createElement("a");
      link.download = `${slug}-nomguzor.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating image", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-xs"
      >
        <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
        <span>{t("createImageCard")}</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex flex-col items-center max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">
                {t("cardExportTitle")}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t("cardExportSubtitle")}
              </p>
            </div>

            {/* Canvas / Card to export */}
            <div className="overflow-hidden rounded-2xl shadow-2xl p-1 bg-gradient-to-b from-emerald-500/20 to-transparent">
              <div
                ref={cardRef}
                style={{
                  backgroundColor: "#090D16",
                  width: "320px",
                  minHeight: "440px",
                }}
                className="flex flex-col justify-between p-6 rounded-2xl border border-emerald-500/30 text-white select-none relative overflow-hidden"
              >
                {/* Background decorative glows */}
                <div
                  className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-teal-500/15 blur-2xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Card Top Brand */}
                <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs">
                      <BookMarked className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wider uppercase text-white">
                        Nomguzor
                      </div>
                      <div className="text-[9px] text-zinc-400 font-medium">
                        Феҳристи миллии номҳо
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/40">
                    Реестр №98
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="relative z-10 py-6 text-center space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl font-extrabold text-white shadow-lg shadow-emerald-500/30">
                    {name.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-white">
                      {name}
                    </h2>
                    {translit && (
                      <p className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400 mt-1">
                        {translit}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                    <span className="inline-flex items-center rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 border border-zinc-700">
                      {gender === "male" ? "Мардона" : "Занона"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/50">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                      Дар феҳристи расмӣ
                    </span>
                  </div>

                  {/* Meaning snippet */}
                  <p className="text-[11px] leading-relaxed text-zinc-300/90 line-clamp-3 px-2 pt-1 font-normal">
                    {meaning ||
                      "Номи шомили феҳристи расмии миллии Ҷумҳурии Тоҷикистон буда, истифодаи он дар санадҳои расмӣ ва САҲШ тавсия шудааст."}
                  </p>
                </div>

                {/* Card Bottom Footer */}
                <div className="relative z-10 border-t border-zinc-800/80 pt-3 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                  <span>nomguzor.vercel.app</span>
                  <span className="text-zinc-500">Тоҷикистон • 2026</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={handleDownload}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("generating")}</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>{t("downloadImage")}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
