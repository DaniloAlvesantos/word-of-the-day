import { createOllama } from "ai-sdk-ollama";
import { generateText, Output } from "ai";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

const modelName = process.env.NEXT_PUBLIC_AIMODEL ?? "llama3.2:latest";

export async function GET(request: Request) {
  const sdk = createOllama();

  const wordId = new Date().toISOString().split("T")[0];
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
      model: sdk(modelName),
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
          pronounce: z.string(),
          definition: z.string(),
          usage: z.string(),
          synonyms: z.array(z.string()).max(4),
        }),
      }),
      system: `You are a linguistic expert on English learners. 
               Generate a powerful mindset word. 
               Return ONLY a raw JSON object.
               Focus on mindset and personal growth words.
               Pronounce in IPA (International Phonetic Alphabet).`,
      prompt: "Generate today's mindset word.",
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
