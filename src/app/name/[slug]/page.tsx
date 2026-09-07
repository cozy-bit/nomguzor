import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rawNames from "@/data/names.placeholder.json";
import { NameItem } from "@/types/name";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Info,
  ShieldCheck,
} from "lucide-react";
import { FavoriteDetailButton } from "./FavoriteDetailButton";

const allNames: NameItem[] = rawNames as NameItem[];

export async function generateStaticParams() {
  return allNames.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nameItem = allNames.find((item) => item.slug === slug);

  if (!nameItem) {
    return {
      title: "Ном ёфт нашуд | Nomguzor",
    };
  }

  return {
    title: `Маънои номи ${nameItem.name} | Nomguzor`,
    description: nameItem.meaning,
  };
}

export default async function NameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nameItem = allNames.find((item) => item.slug === slug);

  if (!nameItem) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Баргаштан ба рӯйхати номҳо</span>
        </Link>
      </div>

      {/* Main Detail Card */}
      <article className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        {/* Header section with Name and Actions */}
        <div className="flex flex-col justify-between gap-6 border-b border-slate-100 pb-8 dark:border-slate-800/80 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl font-bold text-white shadow-lg shadow-emerald-500/20">
              {nameItem.firstLetter || nameItem.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {nameItem.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={nameItem.gender === "male" ? "male" : "female"}>
                  {nameItem.gender === "male" ? "Мардона" : "Занона"}
                </Badge>
                {nameItem.inRegistry && (
                  <Badge variant="registry">
                    <CheckCircle2 className="h-3 w-3" />
                    Мутобиқ ба феҳристи расмӣ
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FavoriteDetailButton nameId={nameItem.id} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Meaning Section */}
          <div className="rounded-2xl bg-slate-50/80 p-5 dark:bg-slate-800/50 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <BookOpen className="h-4 w-4" />
              <span>Маъно ва тафсири ном</span>
            </div>
            <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-200">
              {nameItem.meaning}
            </p>
          </div>

          {/* Origin Section */}
          <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Info className="h-4 w-4" />
              <span>Реша ва пайдоиш</span>
            </div>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
              {nameItem.origin || "Форсӣ-тоҷикӣ"}
            </p>
          </div>

          {/* Registry Status Section */}
          <div className="rounded-2xl border border-slate-100 p-5 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Мақоми ҳуқуқӣ</span>
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {nameItem.inRegistry
                ? "Ба Феҳристи ягонаи миллии номҳои тоҷикӣ ворид шудааст ва аз ҷониби САҲШ тавсия мешавад."
                : "Дар феҳристи асосӣ вуҷуд надорад."}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
