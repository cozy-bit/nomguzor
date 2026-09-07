import { tg } from "./tg";
import { ru } from "./ru";
import { en } from "./en";

export type Locale = "tg" | "ru" | "en";
export type TranslationKeys = typeof tg;

export const dictionaries: Record<Locale, TranslationKeys> = {
  tg,
  ru,
  en,
};

export const localeLabels: Record<Locale, { label: string; full: string }> = {
  tg: { label: "TJ", full: "Тоҷикӣ" },
  ru: { label: "RU", full: "Русский" },
  en: { label: "EN", full: "English" },
};
