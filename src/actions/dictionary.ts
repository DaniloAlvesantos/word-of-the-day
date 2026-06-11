"use server";

import { ServiceError } from "@/errors/ServiceError";
import { DictionaryEntry } from "@/types/dictionary";

export async function getDictionaryWord(
  word: string,
): Promise<DictionaryEntry[] | null> {
  const cleanWord = word?.trim().toLowerCase();
  if (!cleanWord) return null;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`,
    );

    if (response.status === 404) {
      console.warn(`Word "${cleanWord}" not found in the dictionary database.`);
      return null;
    }

    if (!response.ok) {
      throw new ServiceError(
        `Dictionary API responded with status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data as DictionaryEntry[];
  } catch (error) {
    console.error("Error executing getDictionaryWord Server Action:", error);
    return null;
  }
}
