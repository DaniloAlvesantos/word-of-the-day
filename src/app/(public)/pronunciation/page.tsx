"use client";
import { PronounceButton } from "@/components/buttons/pronounceButton";
import { Input } from "@/components/ui/input";
import { useSynonyms } from "@/hooks/useSynonyms";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeLink } from "@/components/badges/badgeLink";

export default function PronunciationPage() {
  const [word, setWord] = useState("pronounce");
  const [ipaText, setIpaText] = useState("/prəˈnaʊns/");

  const { fetchSynonyms, synonyms, isLoading } = useSynonyms();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/workers/ipa.worker.ts", import.meta.url),
    );

    workerRef.current.onmessage = (event: MessageEvent<string>) => {
      setIpaText(event.data);
    };

    return () => workerRef.current?.terminate();
  }, []);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (!value) return;

    setWord(value);
    fetchSynonyms(value);

    if (workerRef.current) {
      workerRef.current.postMessage(value);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center mt-8 px-4">
      <span className="text-center">
        <h2 className="font-serif font-semibold text-4xl sm:text-6xl my-2">
          Pronunciation
        </h2>
        <p className="text-zinc-400">Input the word you want to pronounce</p>
      </span>

      <main className="my-6 w-full max-w-sm">
        <div className="flex items-center gap-4 w-full">
          <Input
            type="text"
            placeholder="Type a word..."
            className="flex-1 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-app-primary/80 selection:bg-app-primary"
            onBlur={handleBlur}
          />
          <PronounceButton word={word} />
        </div>

        <ul className="space-y-4 my-6 text-sm sm:text-base">
          <li className="flex items-center gap-2">
            <span className="font-medium text-zinc-500">Pronunciation:</span>

            {ipaText ? (
              <i
                className="font-mono text-app-primary font-semibold tracking-wide"
                title="phonetic spelling"
              >
                {ipaText}
              </i>
            ) : (
              <span className="text-zinc-400 text-xs italic">
                Not found in local dictionary
              </span>
            )}
          </li>

          <li className="space-y-2">
            <p className="font-medium text-zinc-500">Synonyms:</p>

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
          </li>
        </ul>
      </main>
    </section>
  );
}
