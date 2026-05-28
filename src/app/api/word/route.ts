import { createClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data: wordRef, error } = await supabase
      .from("word")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    
    if (!wordRef || wordRef.length === 0) {
      throw new Error("No words found in the database");
    }

    const todayData = wordRef[0];

    return Response.json({
      data: todayData
    });

  } catch (err) {
    console.error("Fetch Error:", err);
    return Response.json(
      { error: "Failed to fetch word of the day" },
      { status: 500 },
    );
  }
}