import { adminDb } from "@/lib/firebase/admin";
import { getAIModel } from "@/util/getModel";
import { generateText, Output } from "ai";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  const model = getAIModel();

  const statement = request.nextUrl.searchParams.get("statement");

  if (!statement) {
    return Response.json(
      {
        message: "Statement is required.",
      },
      { status: 400 },
    );
  }

  const flashcardId = statement.trim().toLowerCase().replace(/\s+/g, "-");
  const flashcardRef = adminDb.collection("flashcard").doc(flashcardId);

  try {
    const existingDoc = await flashcardRef.get();

    const systemInstruction = "";

    const { output } = await generateText({
      model,
      temperature: 0.7,
      output: Output.object({
        schema: z.object({
          data: z
            .array(
              z.object({
                question: z.string(),
                options: z.array(z.string()).length(4),
                answer: z.string(),
                explanation: z.string(),
              }),
            )
            .length(5),
        }),
      }),
      system: `${systemInstruction}
               Target Audience: Advanced English Learners.
               Context: Personal development, professional high-performance, and resilience.
               CRITICAL: Return exactly 5 questions. Options must be plausible distractors.`,
      prompt: ``,
    });
  } catch (err) {
    console.error(err);
  }
}
