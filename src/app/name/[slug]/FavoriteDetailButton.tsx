"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";

interface FavoriteDetailButtonProps {
  nameId: string;
}

export function FavoriteDetailButton({ nameId }: FavoriteDetailButtonProps) {
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
      className="gap-2"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-transform",
          isFavorite ? "fill-white" : "text-rose-500"
        )}
      />
      <span>{isFavorite ? "Дар дӯстдошта ҳаст" : "Ба дӯстдошта"}</span>
    </Button>
  );
}
