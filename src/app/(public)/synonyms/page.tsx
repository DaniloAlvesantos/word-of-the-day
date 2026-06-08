"use client";
import { BadgeLink } from "@/components/badges/badgeLink";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSynonyms } from "@/hooks/useSynonyms";
import { useState } from "react";

export default function SynonymPage() {
  const [word, setWord] = useState("");
  const { fetchSynonyms, synonyms, isLoading } = useSynonyms(20);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (!value) return;

    setWord(value);
    fetchSynonyms(value);
  };

  return (
    <section className="p-4 sm:p-8 md:p-12 max-w-xl mx-auto">
      <span>
        <h2 className="font-serif font-semibold text-4xl sm:text-6xl my-2">
          Synonyms
        </h2>
        <p className="text-zinc-400">
          Input the word you want to get synonyms for
        </p>
      </span>

      <main className="my-6 w-full max-w-sm">
        <div className="flex items-center gap-4 w-full">
          <Input
            type="text"
            placeholder="Type a word..."
            className="flex-1 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-app-primary/80 selection:bg-app-primary"
            onBlur={handleBlur}
          />
        </div>

        <p className="font-medium text-zinc-500 mt-8">Synonyms:</p>
        <ul>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          ) : synonyms.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-w-sm pt-1">
              {synonyms.map((synonym) => (
                <BadgeLink word={synonym} key={synonym} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-xs italic pt-1">
              {word === "pronounce"
                ? "Type a word to load synonyms"
                : "No synonyms found"}
            </p>
          )}
        </ul>
      </main>
    </section>
  );
}
