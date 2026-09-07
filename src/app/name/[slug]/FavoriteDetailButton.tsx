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
        "gap-2 rounded-xl transition-all shadow-xs",
        !isFavorite &&
          "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:border-zinc-750 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-200"
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform",
          isFavorite ? "fill-white" : "text-rose-500"
        )}
      />
      <span>{isFavorite ? t("inFavorites") : t("addToFavorites")}</span>
    </Button>
  );
}
