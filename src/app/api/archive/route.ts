import { adminDb } from "@/lib/firebase/admin";
import { WordCollectionType } from "@/types/firebase/word.collection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 7;
  const lastVisibleId = searchParams.get("lastVisible");

  const wordRef = adminDb.collection("word");

  try {
    let query = wordRef.orderBy("createdAt", "desc").limit(limit);

    if (lastVisibleId) {
      const lastDocInCache = await wordRef.doc(lastVisibleId).get();
      if (lastDocInCache.exists) {
        query = query.startAfter(lastDocInCache);
      }
    }

    const snapshot = await query.get();

    const data = snapshot.docs.map((doc) => {
      const item = doc.data() as WordCollectionType;
      return {
        ...item,
        id: doc.id,
        createdAt: item.createdAt.toDate().toISOString(),
      };
    });

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;
      
    return NextResponse.json({ data, nextCursor });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ data: [], nextCursor: null }, { status: 500 });
  }
}