import { useState } from "react";

export function useSynonyms(limit: number = 5) {
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSynonyms = async (lookupWord: string) => {
    const cleanWord = lookupWord.trim();
    if (!cleanWord) return;

    setIsLoading(true);
    try {
      const apiUrl = `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(cleanWord)}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      const wordsOnly = data
        .slice(0, limit)
        .map((item: { word: string }) => item.word);

      setSynonyms(wordsOnly);
    } catch (error) {
      console.error("Failed to fetch synonyms:", error);
      setSynonyms([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { synonyms, isLoading, fetchSynonyms };
}
