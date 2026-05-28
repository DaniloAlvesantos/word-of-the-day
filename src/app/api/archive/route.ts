import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 7;
  const lastVisibleId = searchParams.get("lastVisible");

  try {
    let query = supabase
      .from("word")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (lastVisibleId) {
      const { data: anchor, error: anchorError } = await supabase
        .from("word")
        .select("id")
        .eq("id", lastVisibleId)
        .single();

      if (anchorError) {
        throw new Error(anchorError.message);
      }

      if (anchor) {
        query = query.lt("id", anchor.id);
      }
    }

    const { data: words, error } = await query;

    if (error) throw new Error(error.message);

    if (!words || words.length === 0) {
      return NextResponse.json({ data: [], nextCursor: null });
    }

    const lastItem = words[words.length - 1];
    const nextCursor = lastItem ? lastItem.id : null;

    return NextResponse.json({
      data: words,
      nextCursor,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ data: [], nextCursor: null }, { status: 500 });
  }
}
