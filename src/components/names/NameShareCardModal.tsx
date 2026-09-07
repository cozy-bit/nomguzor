"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
import { TranslationKeys } from "@/locales";
import { cn } from "@/lib/utils";

type CardRatio = "9:16" | "16:9" | "4:3" | "1:1";

const RATIOS: { id: CardRatio; key: keyof TranslationKeys }[] = [
  { id: "9:16", key: "ratioStory" },
  { id: "16:9", key: "ratioLandscape" },
  { id: "4:3", key: "ratioClassic" },
  { id: "1:1", key: "ratioSquare" },
];

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
  const [aspectRatio, setAspectRatio] = useState<CardRatio>("9:16");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      // Small delay to allow fonts and styles to settle
      await new Promise((resolve) => setTimeout(resolve, 150));
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#090D16",
      });
      const link = document.createElement("a");
      link.download = `${slug}-${aspectRatio.replace(":", "x")}-nomguzor.png`;
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
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xs select-none"
      >
        <ImageIcon className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>{t("createImageCard")}</span>
      </button>

      {/* Modal Dialog rendered into document.body to prevent parent CSS interference */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={modalContentRef}
              className="relative flex flex-col items-center w-full max-w-[460px] sm:max-w-[500px] bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-2xl my-auto animate-in zoom-in-95 duration-200 max-h-[96vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors z-20"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-3 pr-8 pl-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {t("cardExportTitle")}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {t("cardExportSubtitle")}
                </p>
              </div>

              {/* Canvas / Card Container */}
              <div className="w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl p-1 bg-gradient-to-b from-emerald-500/25 via-emerald-500/10 to-transparent">
                <div
                  ref={cardRef}
                  style={{
                    backgroundColor: "#090D16",
                  }}
                  className={cn(
                    "flex flex-col justify-between rounded-2xl border border-emerald-500/30 text-white select-none relative overflow-hidden mx-auto transition-all duration-200 shadow-2xl",
                    aspectRatio === "9:16" &&
                      "w-[260px] sm:w-[290px] aspect-[9/16] p-5 sm:p-6",
                    aspectRatio === "16:9" &&
                      "w-[330px] sm:w-[420px] aspect-[16/9] p-4 sm:p-5",
                    aspectRatio === "4:3" &&
                      "w-[310px] sm:w-[370px] aspect-[4/3] p-4 sm:p-5",
                    aspectRatio === "1:1" &&
                      "w-[280px] sm:w-[330px] aspect-square p-5"
                  )}
                >
                  {/* Background decorative glows */}
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-teal-500/15 blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Card Top Brand */}
                  <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/80 pb-2.5 sm:pb-3">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 shrink-0">
                        <BookMarked className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-white leading-none">
                          Nomguzor
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-zinc-400 font-medium leading-none mt-1">
                          Феҳристи миллии номҳо
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-emerald-400 font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 shadow-xs">
                      Реестр №98
                    </span>
                  </div>

                  {/* Card Main Body */}
                  {aspectRatio === "16:9" ? (
                    // 16:9 Horizontal Layout
                    <div className="relative z-10 py-2 sm:py-3 grid grid-cols-2 gap-3 items-center">
                      <div className="flex flex-col items-center text-center space-y-2 border-r border-zinc-800/60 pr-2">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl font-black text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-500/20">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                            {name}
                          </h2>
                          {translit && (
                            <p className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 mt-0.5">
                              {translit}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center rounded-md bg-zinc-800/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 border border-zinc-700/80">
                          {gender === "male" ? "Мардона" : "Занона"}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center space-y-2 pl-1">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-700/60 w-fit">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
                          Дар феҳристи расмӣ
                        </span>
                        <p className="text-[10px] sm:text-[11px] leading-relaxed text-zinc-300/95 line-clamp-3 font-normal">
                          {meaning ||
                            "Номи шомили феҳристи расмии миллии Ҷумҳурии Тоҷикистон буда, истифодаи он дар санадҳои расмӣ тавсия шудааст."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Vertical / Centered Layouts (9:16, 1:1, 4:3)
                    <div
                      className={cn(
                        "relative z-10 text-center space-y-2.5 sm:space-y-3",
                        aspectRatio === "9:16" && "py-4 sm:py-6 space-y-3.5",
                        aspectRatio === "1:1" && "py-1.5 sm:py-2 space-y-2",
                        aspectRatio === "4:3" && "py-2 sm:py-3 space-y-2.5"
                      )}
                    >
                      {/* Avatar Letter */}
                      <div
                        className={cn(
                          "mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 font-black text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20",
                          aspectRatio === "9:16"
                            ? "h-16 w-16 sm:h-20 sm:w-20 text-3xl sm:text-4xl"
                            : "h-12 w-12 sm:h-14 sm:w-14 text-xl sm:text-2xl"
                        )}
                      >
                        {name.charAt(0)}
                      </div>

                      {/* Name & Translit */}
                      <div>
                        <h2
                          className={cn(
                            "font-black tracking-tight text-white break-words leading-tight",
                            aspectRatio === "9:16"
                              ? "text-2xl sm:text-3xl"
                              : "text-xl sm:text-2xl"
                          )}
                        >
                          {name}
                        </h2>
                        {translit && (
                          <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-400 mt-0.5">
                            {translit}
                          </p>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pt-0.5">
                        <span className="inline-flex items-center rounded-lg bg-zinc-800/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-zinc-300 border border-zinc-700/80">
                          {gender === "male" ? "Мардона" : "Занона"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/70 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-300 border border-emerald-700/60">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          Дар феҳристи расмӣ
                        </span>
                      </div>

                      {/* Meaning snippet */}
                      <p
                        className={cn(
                          "leading-relaxed text-zinc-300/95 font-normal px-2",
                          aspectRatio === "9:16"
                            ? "text-xs sm:text-[13px] line-clamp-4 pt-1"
                            : aspectRatio === "1:1"
                            ? "text-[10px] sm:text-[11px] line-clamp-2"
                            : "text-[10px] sm:text-[11px] line-clamp-2 sm:line-clamp-3"
                        )}
                      >
                        {meaning ||
                          "Номи шомили феҳристи расмии миллии Ҷумҳурии Тоҷикистон буда, истифодаи он дар санадҳои расмӣ ва САҲШ тавсия шудааст."}
                      </p>
                    </div>
                  )}

                  {/* Card Bottom Footer */}
                  <div className="relative z-10 border-t border-zinc-800/80 pt-2.5 sm:pt-3 flex items-center justify-between text-[9px] sm:text-[11px] text-zinc-400 font-medium">
                    <span className="font-semibold text-zinc-300">
                      nomguzor.vercel.app
                    </span>
                    <span className="text-zinc-500">Тоҷикистон • 2026</span>
                  </div>
                </div>
              </div>

              {/* Aspect Ratio Selector (9:16, 16:9, 4:3, 1:1) */}
              <div className="w-full mt-3.5 mb-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium mb-1.5 px-1">
                  <span>{t("cardRatio")}:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {aspectRatio}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                  {RATIOS.map((item) => {
                    const isActive = aspectRatio === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setAspectRatio(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition-all duration-150 select-none",
                          isActive
                            ? "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        )}
                      >
                        <span className="font-mono text-xs sm:text-sm font-bold">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-normal opacity-85 mt-0.5">
                          {t(item.key)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("generating")}</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>{t("downloadImage")} ({aspectRatio})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-xs sm:text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-[0.98]"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
