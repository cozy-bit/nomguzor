"use client";

import React, { useMemo, useState } from "react";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";
import { NameSearch } from "@/components/names/NameSearch";
import { GenderFilter, FilterGender } from "@/components/names/GenderFilter";
import { NameList } from "@/components/names/NameList";
import { Button } from "@/components/ui/Button";
import { createNameSearchIndex } from "@/lib/search";
import { Sparkles, Compass, ChevronDown } from "lucide-react";

const allNames: NameItem[] = rawNames as NameItem[];
const PAGE_SIZE = 60;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<FilterGender>("all");
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

  const filteredNames = useMemo(() => {
    let result = allNames;

    if (searchQuery.trim()) {
      const searchResults = searchIndex.search(searchQuery.trim());
      result = searchResults.map((item) => item.item);
    }

    if (selectedGender !== "all") {
      result = result.filter((item) => item.gender === selectedGender);
    }

    return result;
  }, [searchQuery, selectedGender, searchIndex]);

  const displayedNames = useMemo(() => {
    return filteredNames.slice(0, visibleCount);
  }, [filteredNames, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredNames.length));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Hero Section */}
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-8 text-white shadow-xl sm:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Каталоги расмии номҳои тоҷикӣ ({allNames.length} ном)</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Номи бомаъно ва зебо барои фарзанди шумо
          </h1>
          <p className="mt-4 text-sm text-emerald-100/90 sm:text-base leading-relaxed">
            Феҳристи расмии миллии номҳои тоҷикӣ бо тасдиқи Ҳукумати Ҷумҳурии Тоҷикистон (Қарори №98 аз 26.02.2026).
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-24 top-0 h-48 w-48 rounded-full bg-teal-300/15 blur-2xl" />
      </section>

      {/* Filter and Search Bar Controls */}
      <section className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <NameSearch
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Ҷустуҷӯ аз рӯи ном ё овонавишт..."
            />
          </div>

          <div className="flex justify-start sm:justify-end">
            <GenderFilter value={selectedGender} onChange={handleGenderChange} />
          </div>
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              Номҳои ёфтшуда:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                {filteredNames.length}
              </strong>
            </span>
          </div>

          {(searchQuery || selectedGender !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedGender("all");
                setVisibleCount(PAGE_SIZE);
              }}
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Тоза кардани филтрҳо
            </button>
          )}
        </div>
      </section>

      {/* Name Cards Grid */}
      <section>
        <NameList names={displayedNames} />

        {/* Load More Button */}
        {filteredNames.length > visibleCount && (
          <div className="mt-10 flex flex-col items-center justify-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="gap-2 px-8"
            >
              <span>Нишон додани боз</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <p className="text-xs text-slate-400">
              Намоиши {displayedNames.length} аз {filteredNames.length} ном
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
