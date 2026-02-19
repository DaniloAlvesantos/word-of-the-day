import { adminDb } from "@/lib/firebase/admin";
import { WordCollectionType } from "@/types/firebase/word.collection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 6;
  const lastVisible = searchParams.get("lastVisible");

  const wordRef = adminDb.collection("word");

  try {
    let query = wordRef.orderBy("createdAt", "desc").limit(limit);

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    const snapshot = await query.get();

    const data = snapshot.docs.map((doc) => {
      const item = doc.data() as WordCollectionType;

      return {
        ...item,
        createdAt: item.createdAt.toDate(),
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
