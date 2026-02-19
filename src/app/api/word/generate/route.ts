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
               Generate a powerful mindset word. 
               Focus on mindset, productivity, and personal growth.
               CRITICAL RULE: You must provide a maximum of 4 synonyms.`,
      prompt: `Today is ${new Date().toLocaleDateString("en-US")}. Generate a unique, uncommon mindset word that is highly useful for English learners to master English. Do not use basic words like 'Resilience' or 'Grit'.`,
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
