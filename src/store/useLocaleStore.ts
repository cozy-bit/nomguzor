"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import { Locale, dictionaries, TranslationKeys } from "@/locales";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "tg",
      setLocale: (locale: Locale) => set({ locale }),
    }),
    {
      name: "nomguzor-locale",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useTranslation() {
  const currentLocale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLocale: Locale = mounted ? currentLocale : "tg";
  const dict = dictionaries[activeLocale] || dictionaries.tg;

  const t = (
    key: keyof TranslationKeys,
    variables?: Record<string, string | number>
  ): string => {
    let text = dict[key] || dictionaries.tg[key] || "";
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  };

  return {
    locale: activeLocale,
    setLocale,
    t,
    mounted,
  };
}
