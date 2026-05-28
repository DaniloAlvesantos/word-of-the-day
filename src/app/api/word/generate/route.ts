import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase";

const apiKey = process.env.NEXT_PRIVATE_GOOGLE_API_KEY;

export async function GET() {
  const supabase = await createClient();
  
  if (!apiKey) {
    console.error("Missing NEXT_PRIVATE_GOOGLE_API_KEY environment variable.");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const sdk = createGoogleGenerativeAI({
    apiKey,
  });

  try {
    const { data: recentWords, error } = await supabase
      .from("word")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(10);

    if (error || !recentWords) {
      console.error("Supabase Error:", error);
      throw new Error("Error fetching recent words");
    }

    const usedWords = recentWords.flatMap((word) => word.word).join(", ");

    const { output } = await generateText({
      model: sdk("gemini-2.5-flash"),
      temperature: 0.8,
      maxRetries: 1, 
      abortSignal: AbortSignal.timeout(6000),
      output: Output.object({
        schema: z.object({
          word: z.string(),
          type: z.enum([
            "nouns",
            "verbs",
            "adjective",
            "adverb",
            "pronoun",
            "preposition",
            "conjunction",
            "interjection",
            "phrasal verb",
          ]),
          pronounce: z
            .string()
            .describe("Pronounce in IPA (International Phonetic Alphabet)"),
          definition: z.string(),
          usage: z.string(),
          synonyms: z.array(z.string()),
        }),
      }),
      system: `You are a linguistic expert on English learners. 
               Generate a real English word that exists in standard dictionaries.
               It must be uncommon but legitimate.
               Do not invent words.
               Focus on mindset, productivity, or personal growth.
               The word must be useful for advanced English learners.
               Avoid trendy social media buzzwords.
               CRITICAL RULE 1: You must provide a maximum of 4 synonyms.
               CRITICAL RULE 2: DO NOT generate any of the following previously used words: [${usedWords}].`,
      prompt: `Generate a unique, uncommon mindset word that is highly useful for English learners to master English. Do not use basic words like 'Resilience' or 'Grit'.`,
    });

    if (!output) throw new Error("AI returned empty output");

    const newWordData = {
      ...output,
      createdAt: new Date().toISOString(),
      id: `${output.word.toLowerCase()}_${output.type.toLowerCase().replaceAll(" ", "_")}`,
    };

    const { error: insertError } = await supabase.from("word").insert({
      id: newWordData.id,
      word: newWordData.word,
      type: newWordData.type,
      pronounce: newWordData.pronounce,
      definition: newWordData.definition,
      usage: newWordData.usage,
      synonyms: newWordData.synonyms,
      createdAt: newWordData.createdAt,
    });

    if (insertError) throw insertError;

    return Response.json({
      message: "Created word with success",
      id: newWordData.id,
      data: newWordData,
    });
  } catch (error: any) {
    console.error("Error running generation route:", error);
    
    if (error.name === "TimeoutError" || error.code === "ETIMEDOUT") {
      return Response.json(
        { error: "Connection to Gemini API timed out. Try connecting via a VPN if local." }, 
        { status: 504 }
      );
    }

    return Response.json({ error: "Operation failed" }, { status: 500 });
  }
}