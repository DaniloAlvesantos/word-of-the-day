"use server";
import { adminDb } from "@/lib/firebase/admin";
import {
  FlashcardCollectionType,
  QuizCollectionType,
  WordCollectionType,
} from "@/types/firebase";
import { getTodayId } from "@/util/date";

export async function getTodayWord(): Promise<WordCollectionType | null> {
  const wordRef = adminDb.collection("word");
  const wordId = getTodayId();

  try {
    const todayRef = await wordRef.doc(wordId).get();

    if (todayRef.exists) {
      return todayRef.data() as WordCollectionType;
    }

    const latest = await getLatestWord();

    if (latest) {
      return latest;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getLatestWord(): Promise<WordCollectionType | null> {
  const wordRef = adminDb.collection("word");

  try {
    const latest = await wordRef.orderBy("createdAt", "desc").limit(1).get();

    if (!latest.empty) {
      return latest.docs[0].data() as WordCollectionType;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getWordById(
  id: string,
): Promise<WordCollectionType | null> {
  const wordRef = adminDb.collection("word");

  try {
    const word = await wordRef.doc(id).get();

    if (word.exists) {
      return word.data() as WordCollectionType;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export type GetArchiveResponse = {
  word: WordCollectionType;
  quiz: QuizCollectionType;
  flashcard: FlashcardCollectionType;
};

export async function getWholeArchive(
  id?: string,
): Promise<GetArchiveResponse> {
  const wordId = id || getTodayId();
  const wordRef = adminDb.collection("word");
  const quizRef = adminDb.collection("quiz");
  const flashcardRef = adminDb.collection("flashcard");

  try {
    const wordsSnapshot = await wordRef.doc(wordId).get();

    if (!wordsSnapshot.exists) {
      throw new Error("Word not found");
    }

    const word = wordsSnapshot.data() as WordCollectionType;

    const quizSnapshot = await quizRef.doc(word.word.toLowerCase()).get();
    const flashcardSnapshot = await flashcardRef
      .doc(word.word.toLowerCase())
      .get();

    const quizData = (quizSnapshot.data() as QuizCollectionType) ?? [];
    const flashcardData =
      (flashcardSnapshot.data() as FlashcardCollectionType) ?? [];

    return { word, quiz: quizData, flashcard: flashcardData };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
