import { InternalError } from "@/errors/InternalError";
import { createAdminClient } from "@/lib/supabase";

export const revalidate = 86400;

export async function GET() {
  const supabase = createAdminClient();

  try {
    const { data: wordRef, error } = await supabase
      .from("word")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(1);

    if (error) {
      throw new InternalError(error.message);
    }

    if (!wordRef || wordRef.length === 0) {
      return Response.json(
        { error: "No words found in the database" },
        { status: 404 },
      );
    }

    const todayData = wordRef[0];

    return Response.json(
      {
        data: todayData,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": `public, max-age=${revalidate}, stale-while-revalidate=${revalidate}`,
        },
      },
    );
  } catch (err) {
    console.error("Fetch Error:", err);
    return Response.json(
      { error: (err as Error).message || "Failed to fetch word of the day" },
      { status: 500 },
    );
  }
}
