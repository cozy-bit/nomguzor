"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface NameSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NameSearch({
  value,
  onChange,
  placeholder = "Ҷустуҷӯи ном, маъно ё реша...",
}: NameSearchProps) {
  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Тоза кардан"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
