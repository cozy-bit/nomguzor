"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";
import { NameSearch } from "@/components/names/NameSearch";
import { GenderFilter, FilterGender } from "@/components/names/GenderFilter";
import { AlphabetFilter } from "@/components/names/AlphabetFilter";
import { NameList } from "@/components/names/NameList";
import { Button } from "@/components/ui/Button";
import { createNameSearchIndex } from "@/lib/search";
import { Sparkles, Compass, ChevronDown, Dices, RotateCcw } from "lucide-react";

const allNames: NameItem[] = rawNames as NameItem[];
const PAGE_SIZE = 36;

export default function HomePage() {
  const router = useRouter();
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

  // Set of letters available in the current search + gender filter
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
      {/* Hero Section */}
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-8 text-white shadow-xl sm:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Феҳристи расмии номҳои тоҷикӣ</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Номи бомаъно ва зебо барои фарзанди шумо
          </h1>
          <p className="mt-4 text-sm text-emerald-100/90 sm:text-base leading-relaxed">
            Ҳазорҳо номи асили тоҷикӣ (феҳристи расмии дорои {allNames.length} ном) бо
            тафсири маъно, реша ва мутобиқат ба меъёрҳои миллии номгузорӣ.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-24 top-0 h-48 w-48 rounded-full bg-teal-300/15 blur-2xl" />
      </section>

      {/* Filter and Search Bar Controls */}
      <section className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <NameSearch
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Ҷустуҷӯ аз рӯи ном ё овонавишт..."
            />
          </div>

          <div className="flex items-center gap-2">
            <GenderFilter value={selectedGender} onChange={handleGenderChange} />

            {/* Randomizer Button */}
            <Button
              variant="secondary"
              size="md"
              onClick={handleRandomName}
              className="gap-2 shrink-0 border border-slate-200/80 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 shadow-xs"
              title="Номи тасодуфӣ"
            >
              <Dices className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Номи тасодуфӣ</span>
            </Button>
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="pt-1">
          <AlphabetFilter
            selectedLetter={selectedLetter}
            onSelectLetter={handleLetterChange}
            availableLetters={availableLetters}
          />
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 pt-1 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              Номҳои ёфтшуда:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {filteredNames.length}
              </strong>
              {selectedLetter && (
                <span className="ml-1 text-slate-400">
                  (ҳарфи «{selectedLetter}»)
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
              <span>Тоза кардани филтрҳо</span>
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
            <div className="flex flex-col items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <p className="font-medium">
                Нишон дода шуд:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {displayedNames.length}
                </strong>{" "}
                аз{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {filteredNames.length}
                </strong>
              </p>
              {/* Sleek progress bar */}
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
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
                className="mt-1 gap-2 rounded-2xl border-slate-300 px-8 py-2.5 font-semibold text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/70 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 shadow-xs transition-all active:scale-95"
              >
                <span>Боз нишон додан</span>
                <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
