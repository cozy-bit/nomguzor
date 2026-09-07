"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";
import { GenderFilter, FilterGender } from "@/components/names/GenderFilter";
import { AlphabetFilter } from "@/components/names/AlphabetFilter";
import { PopularNames } from "@/components/names/PopularNames";
import { NameList } from "@/components/names/NameList";
import { Button } from "@/components/ui/Button";
import { createNameSearchIndex } from "@/lib/search";
import { useTranslation } from "@/store/useLocaleStore";
import {
  Compass,
  ChevronDown,
  Dices,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

const allNames: NameItem[] = rawNames as NameItem[];
const PAGE_SIZE = 36;

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<FilterGender>("all");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const searchIndex = useMemo(() => createNameSearchIndex(allNames), []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(PAGE_SIZE);
  };

  const handleGenderChange = (gender: FilterGender) => {
    setSelectedGender(gender);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLetterChange = (letter: string) => {
    setSelectedLetter(letter);
    setVisibleCount(PAGE_SIZE);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGender("all");
    setSelectedLetter("");
    setVisibleCount(PAGE_SIZE);
  };

  const filteredNames = useMemo(() => {
    let result = allNames;

    if (searchQuery.trim()) {
      const searchResults = searchIndex.search(searchQuery.trim());
      result = searchResults.map((item) => item.item);
    }

    if (selectedGender !== "all") {
      result = result.filter((item) => item.gender === selectedGender);
    }

    if (selectedLetter) {
      result = result.filter(
        (item) => item.firstLetter.toUpperCase() === selectedLetter.toUpperCase()
      );
    }

    return result;
  }, [searchQuery, selectedGender, selectedLetter, searchIndex]);

  // Set of letters available in current search + gender filter
  const availableLetters = useMemo(() => {
    let pool = allNames;
    if (selectedGender !== "all") {
      pool = pool.filter((item) => item.gender === selectedGender);
    }
    return new Set(pool.map((item) => item.firstLetter.toUpperCase()));
  }, [selectedGender]);

  const displayedNames = useMemo(() => {
    return filteredNames.slice(0, visibleCount);
  }, [filteredNames, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredNames.length));
  };

  const handleRandomName = () => {
    const pool = filteredNames.length > 0 ? filteredNames : allNames;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    if (chosen) {
      router.push(`/name/${chosen.slug}`);
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedGender !== "all" || selectedLetter
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Minimalist Textual Hero Section */}
      <section className="text-center pt-4 pb-8 sm:pt-8 sm:pb-12">
        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight sm:leading-tight">
          {t("heroTitle")}
        </h1>

        {/* Subtitle with dynamic name count */}
        <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto mt-3.5 leading-relaxed">
          {t("heroDesc", { count: allNames.length.toLocaleString() })}
        </p>
      </section>

      {/* Monolithic Search and Filter Bar */}
      <section className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-emerald-500/50 dark:border-zinc-800/90 dark:bg-zinc-900/80 dark:shadow-2xl backdrop-blur-md transition-all gap-2 md:gap-0">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Desktop divider */}
          <div className="hidden md:block w-px bg-slate-200 dark:bg-zinc-800 my-1 mx-2" />

          {/* Controls: Gender Filter + Random Button */}
          <div className="flex items-center justify-between md:justify-end gap-2 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-zinc-800/80">
            <GenderFilter value={selectedGender} onChange={handleGenderChange} />

            <button
              type="button"
              onClick={handleRandomName}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white transition-all active:scale-95 shadow-xs select-none shrink-0"
              title={t("random")}
            >
              <Dices className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{t("random")}</span>
            </button>
          </div>
        </div>

        {/* Popular Trending Names Chips */}
        <PopularNames onSelectName={handleSearchChange} />

        {/* Alphabet Filter */}
        <AlphabetFilter
          selectedLetter={selectedLetter}
          onSelectLetter={handleLetterChange}
          availableLetters={availableLetters}
        />

        {/* Info & Counter Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 pt-1 text-xs text-slate-500 dark:border-zinc-800/80 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {t("foundCount")}:{" "}
              <strong className="text-slate-900 dark:text-white">
                {filteredNames.length}
              </strong>
              {selectedLetter && (
                <span className="ml-1 text-slate-400 dark:text-zinc-500">
                  ({t("letter")} «{selectedLetter}»)
                </span>
              )}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t("resetFilters")}</span>
            </button>
          )}
        </div>
      </section>

      {/* Name Cards Grid */}
      <section>
        <NameList
          names={displayedNames}
          onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
        />

        {/* Pagination Section (Explicit button, no infinite scroll) */}
        {filteredNames.length > PAGE_SIZE && (
          <div className="mt-12 flex flex-col items-center justify-center gap-3">
            {/* Indicator: Нишон дода шуд: X аз Y */}
            <div className="flex flex-col items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <p className="font-medium">
                {t("shownCount", {
                  current: displayedNames.length,
                  total: filteredNames.length,
                })}
              </p>
              {/* Sleek progress bar */}
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (displayedNames.length / filteredNames.length) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Load More Button (hidden when all names are displayed) */}
            {filteredNames.length > visibleCount && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                className="mt-1 gap-2 rounded-2xl border-slate-300 bg-white px-8 py-2.5 font-semibold text-slate-800 hover:border-emerald-500 hover:bg-slate-50 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-white shadow-xs transition-all active:scale-95"
              >
                <span>{t("loadMore")}</span>
                <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
