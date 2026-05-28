import { generateText, Output } from "ai";
import { z } from "zod";
import { NextRequest } from "next/server";
import { getAIModel } from "@/util/getModel";
import { createClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const model = getAIModel();
  const supabase = await createClient();

  const statement = request.nextUrl.searchParams.get("statement");
  const mode =
    request.nextUrl.searchParams.get("mode")?.toLowerCase() ?? "vocabulary";

  if (!statement) {
    return Response.json(
      { message: "Statement param is required!" },
      { status: 400 },
    );
  }

  const normalizedId = statement.trim().toLowerCase().replace(/\s+/g, "-");
  const quizId = `${normalizedId}_${mode}`;

  try {
    const { data: existingQuiz, error: fetchError } = await supabase
      .from("quiz")
      .select("*")
      .eq("id", quizId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (existingQuiz) {
      return Response.json({
        message: `Quiz for "${statement}" already exists`,
        data: existingQuiz,
      });
    }

    const systemInstruction =
      mode === "grammar"
        ? `You are an English Grammar specialist. Create a quiz focusing on:
           - Rules, syntax, and structures of the given statement: "${statement}".
           - For tenses, focus on when and how to use them in professional/mindset contexts.
           - Common mistakes advanced learners (B2/C1/C2) make with this specific topic.`
        : `You are a linguistic expert and mindset coach. Create a quiz focusing on:
           - Semantic nuances and connotations of "${statement}".
           - Contextual meaning in growth and productivity scenarios.
           - Subtle differences compared to near-synonyms or similar concepts.`;

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
      prompt: `Generate a comprehensive ${mode} quiz for the topic: "${statement.toUpperCase()}"`,
    });

    if (!output?.data) throw new Error("AI returned empty output");

    const { error: quizInsertError } = await supabase.from("quiz").insert({
      id: quizId,
      statement: statement.trim(),
      slug: normalizedId,
      mode,
      updatedAt: new Date().toISOString(),
    });

    if (quizInsertError) throw quizInsertError;

    const itemsToInsert = output.data.map((item) => ({
      text: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
      createdAt: new Date().toISOString(),
    }));

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from("question")
      .insert(itemsToInsert)
      .select("id");

    if (questionsError || !insertedQuestions) throw questionsError;

    const junctionRows = insertedQuestions.map((q, index) => ({
      quiz_id: quizId,
      question_id: q.id,
      position: index + 1,
    }));

    const { error: junctionError } = await supabase
      .from("quiz_question")
      .insert(junctionRows);

    if (junctionError) throw junctionError;

    return Response.json({
      message: "Created quiz with success",
      data: {
        id: quizId,
        statement: statement.trim(),
        slug: normalizedId,
        mode,
        questions: output.data,
      },
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 429
    ) {
      return Response.json(
        {
          error:
            "Limite de requisições atingido. Tente novamente em 1 minuto ou use o Ollama local.",
        },
        { status: 429 },
      );
    }

    console.error("AI Generation Error:", error);
    return Response.json({ error: "Operation failed" }, { status: 500 });
  }
}
