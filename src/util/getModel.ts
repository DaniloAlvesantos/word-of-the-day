import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ai-sdk-ollama";

const apiKey = process.env.NEXT_PRIVATE_GOOGLE_API_KEY;

export const getAIModel = () => {
  const isDev = process.env.NODE_ENV === "development";
  const sdk = isDev ? createOllama() : createGoogleGenerativeAI({ apiKey });
  const model = isDev ? sdk("") : sdk("gemini-2.5-flash");

  return model;
};
