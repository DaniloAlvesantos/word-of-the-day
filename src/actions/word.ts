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
  quiz: QuizCollectionType | null;
  flashcard: FlashcardCollectionType | null;
};

export async function getWholeArchive(
  id?: string,
): Promise<GetArchiveResponse> {
  const wordId = id || getTodayId(); 
  
  try {
    const wordDoc = await adminDb.collection("word").doc(wordId).get();

    if (!wordDoc.exists) {
      throw new Error("Word entry not found for this date");
    }

    const wordData = wordDoc.data() as WordCollectionType;
    const normalizedWord = wordData.word.toLowerCase().trim();

    const quizId = `${normalizedWord}_vocabulary`;
    const flashcardId = `${normalizedWord}_default`;

    const [quizSnap, flashcardSnap] = await Promise.all([
      adminDb.collection("quiz").doc(quizId).get(),
      adminDb.collection("flashcard").doc(flashcardId).get()
    ]);

    return {
      word: wordData,
      quiz: quizSnap.exists ? (quizSnap.data() as QuizCollectionType) : null,
      flashcard: flashcardSnap.exists ? (flashcardSnap.data() as FlashcardCollectionType) : null,
    };

  } catch (err) {
    console.error("Error in getWholeArchive:", err);
    throw err;
  }
}
