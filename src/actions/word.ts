"use server";
import { adminDb } from "@/lib/firebase/admin";
import { WordCollectionType } from "@/types/firebase";

export async function getTodayWord(): Promise<WordCollectionType | null> {
  const wordRef = adminDb.collection("word");
  const wordId = new Date().toISOString().split("T")[0];

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
