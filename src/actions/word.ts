"use server";
import { createClient } from "@/lib/supabase";
import { Database } from "@/types/database";

export async function getTodayWord(): Promise<
  Database["public"]["Tables"]["word"]["Row"] | null
> {
  const supabase = await createClient();
  const query = supabase
    .from("word")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(1);

  try {
    const { data: todayRef, error } = await query.single();

    if (error) {
      throw new Error(`Error fetching today's word: ${error.message}`);
    }

    if (todayRef) {
      return todayRef;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getWordById(
  id: string,
): Promise<Database["public"]["Tables"]["word"]["Row"] | null> {
  const supabase = await createClient();
  const wordRef = supabase
    .from("word")
    .select("*")
    .eq("id", id)
    .order("createdAt", { ascending: false });

  try {
    const { data: word, error } = await wordRef.single();

    if (error) {
      throw new Error(`Error fetching word: ${error.message}`);
    }

    if (word) {
      return word;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export type GetArchiveResponse = {
  word: Database["public"]["Tables"]["word"]["Row"];
  quiz: (Database["public"]["Tables"]["quiz"]["Row"] & {
    questions: {
      id: string;
      text: string;
      options: string[];
      answer: string;
      explanation: string;
    }[];
  }) | null;
  flashcard: Database["public"]["Tables"]["flashcard"]["Row"] | null;
};

export async function getWholeArchive(
  id?: string,
): Promise<GetArchiveResponse> {
  const supabase = await createClient();
  let query = supabase
    .from("word")
    .select("*")
    .order("createdAt", { ascending: false });

  if (id) {
    query = query.eq("id", id);
  }

  try {
    const { data: wordData, error: wordError } = await query.limit(1).single();

    if (wordError || !wordData) {
      throw new Error(
        `Error fetching word: ${wordError?.message || "Not found"}`,
      );
    }

    const normalizedWord = wordData.word.toLowerCase().trim();
    const quizId = `${normalizedWord}_vocabulary`;
    const flashcardId = `${normalizedWord}_default`;

    const [quizSnap, flashcardSnap] = await Promise.all([
      supabase
        .from("quiz")
        .select(
          `
          *,
          quiz_question (
            position,
            question (
              id,
              text,
              options,
              answer,
              explanation
            )
          )
        `,
        )
        .eq("id", quizId)
        .maybeSingle(),
      supabase
        .from("flashcard")
        .select("*")
        .eq("id", flashcardId)
        .maybeSingle(),
    ]);

    if (quizSnap.error) throw quizSnap.error;
    if (flashcardSnap.error) throw flashcardSnap.error;

    let formattedQuiz = null;
    if (quizSnap.data) {
      const sortedQuestions = (quizSnap.data.quiz_question || [])
        .sort((a, b) => a.position - b.position)
        .map((qq) => qq.question)
        .filter(Boolean);

      formattedQuiz = {
        ...quizSnap.data,
        questions: sortedQuestions,
      };
    }

    return {
      word: wordData,
      quiz: formattedQuiz,
      flashcard: flashcardSnap.data,
    };
  } catch (err) {
    console.error("Error in getWholeArchive:", err);
    throw err;
  }
}
