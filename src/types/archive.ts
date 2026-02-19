import {
  FlashcardCollectionType,
  WordCollectionType,
  QuizCollectionType,
} from "./firebase";

export interface FullArchiveType {
  word: WordCollectionType;
  flashcards: FlashcardCollectionType[];
  quiz: QuizCollectionType[];
}
