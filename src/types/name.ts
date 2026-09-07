export type Gender = 'male' | 'female';

export interface NameItem {
  id: string;
  slug: string;
  name: string;
  gender: Gender;
  meaning: string;
  origin?: string;
  inRegistry: boolean;
  firstLetter: string;
}
