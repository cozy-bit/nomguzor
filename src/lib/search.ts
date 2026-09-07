import Fuse, { type IFuseOptions } from "fuse.js";
import { NameItem } from "@/types/name";

const defaultOptions: IFuseOptions<NameItem> = {
  keys: [
    { name: "name", weight: 0.6 },
    { name: "meaning", weight: 0.25 },
    { name: "origin", weight: 0.15 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 1,
};

export function createNameSearchIndex(
  names: NameItem[],
  customOptions?: IFuseOptions<NameItem>
) {
  return new Fuse(names, {
    ...defaultOptions,
    ...customOptions,
  });
}
