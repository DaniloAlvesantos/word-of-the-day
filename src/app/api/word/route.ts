import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const modelName = "deepseek/deepseek-r1-0528:free";

export async function GET(request: Request) {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_APIKEY,
  });

  const today = new Date().toISOString().split("T")[0];

  const response = await generateText({
    model: openrouter(modelName),
    prompt: [
      {
        role: "system",
        content: `You are a linguistic expert focusing on personal growth and mindset. 
          Provide a Word of the Day in strict JSON format.
          
          Allowed 'type' values: "nouns", "verbs", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection", "phrasal verb".
          Constraints: Max 4 synonyms.
          
          JSON Structure:
          {
            "word": "string",
            "type": "string",
            "pronounce": "string",
            "definition": "string",
            "usage": "string",
            "synonyms": ["string"]
          }`,
      },
      {
        role: "user",
        content: "Generate a powerful mindset-related word for today.",
      },
    ],
  });

  return new Response(JSON.stringify({text: response.text}), {
    status: 200,
  });
}
