"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShareButtonsProps {
  name: string;
  translit?: string;
  slug: string;
}

export function ShareButtons({ name, translit, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [slug]);

  const shareUrl = currentUrl || `https://nomguzor.vercel.app/name/${slug}`;
  const shareText = `Номи миллии тоҷикӣ: ${name}${
    translit ? ` (${translit})` : ""
  } — дар феҳристи расмии Nomguzor`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement("input");
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
        Фиристодан:
      </span>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-all active:scale-95"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>WhatsApp</span>
      </a>

      {/* Telegram */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200/80 bg-sky-50/50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 hover:text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-900/50 transition-all active:scale-95"
      >
        <Send className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
        <span>Telegram</span>
      </a>

      {/* Copy link */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="text-xs gap-1.5 relative border-slate-200 dark:border-slate-800 hover:border-slate-300"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Нусхабардорӣ шуд!
            </span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Нусхабардории пайванд</span>
          </>
        )}
      </Button>
    </div>
  );
}
