import { createOllama } from "ai-sdk-ollama";
import { generateText, Output } from "ai";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

const modelName = process.env.NEXT_PUBLIC_AIMODEL ?? "llama3.2:latest";

export async function GET(request: Request) {
  const sdk = createOllama();

  try {
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
          // flashcards: z
          //   .array(
          //     z.object({
          //       front: z.string(),
          //       back: z.string(),
          //     }),
          //   )
          //   .length(3),
        }),
      }),
      system: `You are a linguistic expert on English learners. 
               Generate a powerful mindset word. 
               Return ONLY a raw JSON object.
               DO NOT include <thing> tags.
               DO NOT include markdown headers or explanations.
               Focus on mindset and personal growth words.
               Pronounce in IPA (International Phonetic Alphabet)
               The flashcards should cover: 1. Definition, 2. Synonym/Antonym, 3. Context usage.`,
      prompt: "Generate today's mindset word.",
    });

    if (!output) {
      return Response.json({ error: "Output is empty." }, { status: 400 });
    }

    const wordRef = adminDb.collection("word");
    const wordId = output.word.trim().toLocaleLowerCase();
    const docRef = await wordRef.doc(wordId);

    await docRef.set(
      {
        ...output,
        timestamp: Timestamp.now(),
      },
      { merge: true },
    );

    return Response.json({
      message: "Created word with success",
      id: docRef.id,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: "Failed to generate word" }, { status: 500 });
  }
}
