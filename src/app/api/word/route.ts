import { createOllama } from "ai-sdk-ollama";
import { generateText, Output } from "ai";
import { z } from "zod";

const modelName = "llama3.2:latest";

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
               The flashcards should cover: 1. Definition, 2. Synonym/Antonym, 3. Context usage.`,
      prompt: "Generate today's mindset word.",
    });

    return Response.json(output);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: "Failed to generate word" }, { status: 500 });
  }
}
