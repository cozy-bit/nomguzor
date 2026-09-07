import Fuse, { type IFuseOptions } from "fuse.js";
import { NameItem } from "@/types/name";

const defaultOptions: IFuseOptions<NameItem> = {
  keys: [
    { name: "name", weight: 1.0 },
    { name: "translit", weight: 0.7 },
  ],
  threshold: 0.3,
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
