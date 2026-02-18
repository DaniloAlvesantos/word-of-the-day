import { type Timestamp } from "firebase-admin/firestore";

export interface WordCollectionType {
  word: string;
  dayId: string;
  type: WordTypes;
  pronounce: string;
  definition: string;
  usage: string;
  synonyms: string[];
  createdAt: Timestamp;
}

export type WordTypes =
  | "nouns"
  | "verbs"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "interjection"
  | "phrasal verb";