import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Info,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { FavoriteDetailButton } from "./FavoriteDetailButton";
import { ShareButtons } from "@/components/names/ShareButtons";

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

  const translitText = nameItem.translit ? ` (${nameItem.translit})` : "";

  return {
    title: `Номи ${nameItem.name}${translitText} — тарзи дурусти навишт | Nomguzor`,
    description: `Маълумот оид ба номи миллии тоҷикии ${nameItem.name}. Шакли лотинӣ: ${
      nameItem.translit || nameItem.slug
    }. Шомили феҳристи расмии Ҷумҳурии Тоҷикистон.`,
    openGraph: {
      title: `Номи ${nameItem.name}${translitText} — Nomguzor`,
      description: `Маълумот ва тарзи навишти номи ${nameItem.name} тибқи феҳристи расмии миллии тоҷикӣ.`,
    },
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Баргаштан ба рӯйхати номҳо</span>
        </Link>
      </div>

      {/* Main Detail Card */}
      <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md sm:p-10">
        {/* Header section with Name and Actions */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-800/80 pb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl font-bold text-white shadow-lg shadow-emerald-500/20">
              {nameItem.firstLetter || nameItem.name.charAt(0)}
            </span>
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {nameItem.name}
                </h1>
                {nameItem.translit && (
                  <span className="font-mono text-base font-medium text-zinc-400">
                    {nameItem.translit}
                  </span>
                )}
              </div>
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
          <div className="rounded-2xl bg-zinc-850/60 p-5 border border-zinc-800/80 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <BookOpen className="h-4 w-4" />
              <span>Маъно ва мақоми ном</span>
            </div>
            <p className="mt-2 text-base leading-relaxed text-zinc-300">
              {nameItem.meaning ||
                "Номи шомили феҳристи расмии миллии Ҷумҳурии Тоҷикистон буда, истифодаи он дар санадҳои расмӣ ва САҲШ тавсия шудааст."}
            </p>
          </div>

          {/* Translit / Latin spelling */}
          {nameItem.translit && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-850/40 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <Globe className="h-4 w-4 text-sky-400" />
                <span>Овонавишти лотинӣ</span>
              </div>
              <p className="mt-2 text-base font-semibold text-white font-mono">
                {nameItem.translit}
              </p>
            </div>
          )}

          {/* Origin Section */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-850/40 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <Info className="h-4 w-4 text-emerald-400" />
              <span>Реша ва пайдоиш</span>
            </div>
            <p className="mt-2 text-base font-semibold text-white">
              {nameItem.origin || "Тоҷикӣ"}
            </p>
          </div>

          {/* Registry Status Section */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-850/40 p-5 sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Мақоми ҳуқуқӣ ва реестри давлатӣ</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
              {nameItem.inRegistry
                ? "Ба Феҳристи ягонаи миллии номҳои тоҷикӣ ворид шудааст (Қарори Ҳукумати Ҷумҳурии Тоҷикистон №98 аз 26.02.2026) ва аз ҷониби мақомоти САҲШ бемамониат сабт мегардад."
                : "Дар феҳристи асосӣ вуҷуд надорад."}
            </p>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-8 border-t border-zinc-800/80 pt-6">
          <ShareButtons
            name={nameItem.name}
            translit={nameItem.translit}
            slug={nameItem.slug}
          />
        </div>
      </article>
    </div>
  );
}
