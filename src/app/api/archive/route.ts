import { createAdminClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 7;

  const lastCreatedAt = searchParams.get("lastVisible");

  try {
    let query = supabase
      .from("word")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (lastCreatedAt) {
      query = query.lt("createdAt", lastCreatedAt);
    }

    const { data: words, error } = await query;

    if (error) throw new Error(error.message);

    if (!words || words.length === 0) {
      return Response.json({ data: [], nextCursor: null });
    }

    const lastItem = words[words.length - 1];
    const nextCursor = lastItem ? lastItem.createdAt : null;

    return Response.json({
      data: words,
      nextCursor,
    });
  } catch (err) {
    console.error("Fetch error inside archive cursor endpoint:", err);
    return Response.json(
      {
        data: [],
        nextCursor: null,
        error: (err as Error).message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
