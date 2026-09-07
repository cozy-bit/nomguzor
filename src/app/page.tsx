"use client";

import React, { useMemo, useState } from "react";
import rawNames from "@/data/names.placeholder.json";
import { NameItem } from "@/types/name";
import { NameSearch } from "@/components/names/NameSearch";
import { GenderFilter, FilterGender } from "@/components/names/GenderFilter";
import { NameList } from "@/components/names/NameList";
import { createNameSearchIndex } from "@/lib/search";
import { Sparkles, Compass } from "lucide-react";

const allNames: NameItem[] = rawNames as NameItem[];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<FilterGender>("all");

  const searchIndex = useMemo(() => createNameSearchIndex(allNames), []);

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Hero Section */}
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 p-8 text-white shadow-xl sm:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Каталоги расмии номҳои тоҷикӣ</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Номи бомаъно ва зебо барои фарзанди шумо
          </h1>
          <p className="mt-4 text-sm text-emerald-100/90 sm:text-base leading-relaxed">
            Ҳазорҳо номи асили тоҷикӣ бо тафсири маъно, реша ва мутобиқат ба феҳристи расмии номгузорӣ.
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
            <NameSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="flex justify-start sm:justify-end">
            <GenderFilter value={selectedGender} onChange={setSelectedGender} />
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
        <NameList names={filteredNames} />
      </section>
    </div>
  );
}
