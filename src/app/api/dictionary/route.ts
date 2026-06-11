import { InternalError } from "@/errors/InternalError";
import { DictionaryResponse } from "@/types/dictionary";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  if (!word || !word.trim()) {
    return Response.json(
      { error: "A search term word query parameter is required." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`,
    );

    if (response.status === 404) {
      return Response.json(
        { error: `The word "${word}" could not be found in the dictionary.` },
        { status: 404 },
      );
    }

    if (!response.ok) {
      throw new InternalError(
        `Dictionary API responded with status: ${response.status}`,
      );
    }

    const data = (await response.json()) as DictionaryResponse[];

    if (!data || data.length === 0) {
      throw new InternalError("Parsed response contains empty array payload data.");
    }

    return Response.json(data, { status: 200 });
  } catch (err: InternalError | Error | unknown) {
    console.error("Error in dictionary route utility handler:", err);

    return Response.json(
      {
        error:
          (err as Error).message ||
          "An unexpected dictionary retrieval error occurred.",
      },
      { status: 500 },
    );
  }
}
