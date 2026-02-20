import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import { getTodayId } from "@/util/date";

const apiKey = process.env.NEXT_PRIVATE_GOOGLE_API_KEY;

export async function GET(request: Request) {
  const sdk = createGoogleGenerativeAI({
    apiKey,
  });

  const wordId = getTodayId();
  const wordRef = adminDb.collection("word").doc(wordId);

  try {
    const existingDoc = await wordRef.get();

    if (existingDoc.exists) {
      return Response.json({
        message: "Word for today already exists",
        data: existingDoc.data(),
      });
    }

    const recentWordsSnapshot = await adminDb
      .collection("word")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const usedWords = recentWordsSnapshot.docs
      .map((doc) => doc.data().word)
      .join(", ");

    const { output } = await generateText({
      model: sdk("gemini-2.5-flash"),
      temperature: 0.8,
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
      prompt: `Today is ${wordId}. Generate a unique, uncommon mindset word that is highly useful for English learners to master English. Do not use basic words like 'Resilience' or 'Grit'.`,
    });

    if (!output) throw new Error("AI returned empty output");

    const newWordData = {
      ...output,
      createdAt: Timestamp.now(),
      dayId: wordId,
    };

    await wordRef.set(newWordData);

    return Response.json({
      message: "Created word with success",
      id: wordId,
      data: newWordData,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Operation failed" }, { status: 500 });
  }
}
