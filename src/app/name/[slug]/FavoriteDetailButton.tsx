"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useTranslation } from "@/store/useLocaleStore";
import { cn } from "@/lib/utils";

interface FavoriteDetailButtonProps {
  nameId: string;
}

export function FavoriteDetailButton({ nameId }: FavoriteDetailButtonProps) {
  const { t } = useTranslation();
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavoriteStore = useFavoritesStore((state) => state.isFavorite(nameId));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorite = mounted && isFavoriteStore;

  return (
    <Button
      variant={isFavorite ? "danger" : "outline"}
      size="md"
      onClick={() => toggleFavorite(nameId)}
      className={cn(
        "gap-2 rounded-xl transition-all shadow-xs font-semibold",
        !isFavorite &&
          "border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-100"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform shrink-0",
          isFavorite ? "fill-white text-white" : "text-rose-500 fill-rose-500/10"
        )}
      />
      <span
        className={cn(
          "font-semibold",
          isFavorite ? "text-white" : "text-slate-900 dark:text-zinc-100"
        )}
      >
        {isFavorite ? t("inFavorites") : t("addToFavorites")}
      </span>
    </Button>
  );
}
