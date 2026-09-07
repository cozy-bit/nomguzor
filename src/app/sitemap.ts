import type { MetadataRoute } from "next";
import rawNames from "@/data/names.json";
import { NameItem } from "@/types/name";

const allNames: NameItem[] = rawNames as NameItem[];
const BASE_URL = "https://nomguzor.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const nameEntries: MetadataRoute.Sitemap = allNames.map((item) => ({
    url: `${BASE_URL}/name/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...nameEntries,
  ];
}
