import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getClientCookie, setClientCookie, deleteClientCookie } from "@/lib/cookies";

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

function getInitialFavorites(): string[] {
  if (typeof document !== "undefined") {
    const cookieFavs = getClientCookie("nomguzor-favs");
    if (cookieFavs) {
      try {
        const parsed = JSON.parse(cookieFavs);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
  }
  return [];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: getInitialFavorites(),
      toggleFavorite: (id: string) => {
        const { favoriteIds } = get();
        const next = favoriteIds.includes(id)
          ? favoriteIds.filter((item) => item !== id)
          : [...favoriteIds, id];
        set({ favoriteIds: next });
        setClientCookie("nomguzor-favs", JSON.stringify(next), 365);
      },
      isFavorite: (id: string) => get().favoriteIds.includes(id),
      clearFavorites: () => {
        set({ favoriteIds: [] });
        deleteClientCookie("nomguzor-favs");
      },
    }),
    {
      name: "nomguzor-favorites-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          const cookieFavs = getClientCookie("nomguzor-favs");
          if (!cookieFavs && state.favoriteIds.length > 0) {
            setClientCookie("nomguzor-favs", JSON.stringify(state.favoriteIds), 365);
          }
        }
      },
    }
  )
);
