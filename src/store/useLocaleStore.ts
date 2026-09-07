"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Locale, dictionaries, TranslationKeys } from "@/locales";
import { getClientCookie, setClientCookie } from "@/lib/cookies";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

function getInitialLocale(): Locale {
  if (typeof document !== "undefined") {
    const cookieLocale = getClientCookie("nomguzor-locale");
    if (cookieLocale === "tg" || cookieLocale === "ru" || cookieLocale === "en") {
      return cookieLocale;
    }
    const docLang = document.documentElement.lang;
    if (docLang === "tg" || docLang === "ru" || docLang === "en") {
      return docLang as Locale;
    }
  }
  return "tg";
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: getInitialLocale(),
      setLocale: (locale: Locale) => {
        set({ locale });
        setClientCookie("nomguzor-locale", locale, 365);
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: "nomguzor-locale",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          const currentCookie = getClientCookie("nomguzor-locale");
          if (!currentCookie) {
            setClientCookie("nomguzor-locale", state.locale, 365);
          }
          document.documentElement.lang = state.locale;
        }
      },
    }
  )
);

export function useTranslation() {
  const currentLocale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const dict = dictionaries[currentLocale] || dictionaries.tg;

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
    locale: currentLocale,
    setLocale,
    t,
    mounted: true,
  };
}
