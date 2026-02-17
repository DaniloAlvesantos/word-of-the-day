export interface WordCollectionType {
  word: string;
  type: WordTypes;
  pronounce: string;
  definition: string;
  usage: string;
  synonyms: string[];
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