import { FlashcardCollectionType, WordCollectionType } from "./firebase";

export interface WordOfTheDayType {
  word: WordCollectionType;
  flashcards: FlashcardCollectionType[];
}
