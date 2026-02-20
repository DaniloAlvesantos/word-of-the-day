"use server";
import { adminDb } from "@/lib/firebase/admin";
import { WordCollectionType } from "@/types/firebase";
import { getTodayId } from "@/util/date";

interface GetTodayWordResponse {
  word: WordCollectionType | null;
  serverDate: Date;
}

export async function getTodayWord(): Promise<GetTodayWordResponse> {
  const wordRef = adminDb.collection("word");
  const wordId = getTodayId();

  try {
    const todayRef = await wordRef.doc(wordId).get();

    if (todayRef.exists) {
      return {
        word: todayRef.data() as WordCollectionType,
        serverDate: new Date(),
      };
    }

    const latest = await getLatestWord();

    if (latest) {
      return {
        word: latest,
        serverDate: new Date(),
      };
    }

    return { word: null, serverDate: new Date() } as GetTodayWordResponse;
  } catch (err) {
    console.error(err);
    return { word: null, serverDate: new Date() } as GetTodayWordResponse;
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
