import { adminDb } from "@/lib/firebase/admin";
import { WordCollectionType } from "@/types/firebase";

export async function GET() {
  const wordId = new Date().toISOString().split("T")[0];
  const wordRef = adminDb.collection("word");
  try {
    const todayData = await wordRef.doc(wordId).get();

    if (todayData.exists) {
      return Response.json({
        data: todayData.data() as WordCollectionType,
      });
    }

    const latest = await wordRef.orderBy("createdAt", "desc").limit(1).get();

    if (!latest.empty) {
      return latest.docs[0].data() as WordCollectionType;
    }
  } catch (err) {
    console.error(err);
  }
}
