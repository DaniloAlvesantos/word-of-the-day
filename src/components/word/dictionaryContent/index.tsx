"use client";
import { BadgeLink } from "@/components/badges/badgeLink";
import { PronounceButton } from "@/components/buttons/pronounceButton";
import { SaveButton } from "@/components/buttons/saveButton";
import { ShareButton } from "@/components/buttons/shareButton";
import { Highlight } from "@/components/highlight";
import { Button } from "@/components/ui/button";
import { DictionaryEntry } from "@/types/dictionary";
import { Volume2, Music } from "lucide-react";
import { useState } from "react";

interface DictionaryContentProps {
  data: DictionaryEntry;
}

export const DictionaryContent = ({ data }: DictionaryContentProps) => {
  const validPhonetics = data.phonetics.filter((p) => p.audio);

  const [selectedAudio, setSelectedAudio] = useState<string | null>(
    validPhonetics[0]?.audio || null,
  );

  const playSelectedAudio = () => {
    if (!selectedAudio) return;
    const audio = new Audio(selectedAudio);
    audio.play().catch((err) => console.error("Audio playback blocked:", err));
  };

  const displayPhonetic = data.phonetics.find((p) => p.text)?.text || "";

  const allSynonyms = Array.from(
    new Set([
      ...data.meanings.flatMap((m) => m.synonyms || []),
      ...data.meanings.flatMap((m) =>
        m.definitions.flatMap((d) => d.synonyms || []),
      ),
    ]),
  ).slice(0, 10);

  return (
    <main
      className="flex flex-col items-center justify-center mt-10 px-4"
      id="content"
    >
      <h1 className="sr-only">Dictionary Lookup Result</h1>

      <p className="text-sm uppercase font-medium text-zinc-400 tracking-widest mb-1">
        Instant Dictionary Search
      </p>

      <section
        id="word-wrapper"
        className="flex flex-col items-center gap-3 text-center"
      >
        <div className="flex gap-4 items-center justify-center flex-wrap">
          <h2 className="font-serif font-semibold text-5xl sm:text-7xl my-2 capitalize">
            {data.word}
          </h2>

          <button
            type="button"
            disabled={!selectedAudio}
            aria-label="Play selected pronunciation"
            className="bg-app-primary text-white p-3 shadow-md shadow-app-primary rounded-full hover:bg-app-primary/80 transition-colors duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={playSelectedAudio}
          >
            <Volume2 className="size-6 sm:size-7" />
          </button>
        </div>

        {displayPhonetic && (
          <div className="text-zinc-400 font-mono text-sm tracking-wide">
            <i title="phonetic spelling">{displayPhonetic}</i>
          </div>
        )}

        {validPhonetics.length > 1 && (
          <div className="mt-2 flex flex-col items-center gap-2">
            <p className="text-xs font-medium text-zinc-400 inline-flex items-center gap-1">
              <Music className="size-3" /> Select pronunciation variant:
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-xs sm:max-w-md">
              {validPhonetics.map((p, index) => {
                const label = p.text || `Audio Track ${index + 1}`;
                const isCurrent = selectedAudio === p.audio;

                return (
                  <Button
                    key={p.audio}
                    size="sm"
                    variant={isCurrent ? "default" : "outline"}
                    onClick={() => setSelectedAudio(p.audio)}
                    className={`text-xs px-3 py-1 h-auto rounded-full transition-all ${
                      isCurrent
                        ? "bg-app-primary hover:bg-app-primary/80 text-white"
                        : "bg-white text-zinc-600 hover:bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
        <PronounceButton word={data.word} style="Regular" />
      </section>

      <section className="mt-12 flex flex-col w-[90%] sm:w-[65%] max-w-2xl">
        <article className="bg-white shadow-md border border-zinc-100 rounded-xl py-6 px-6 sm:px-12 sm:py-8 space-y-6">
          {data.meanings.map((meaning, index) => (
            <div key={`${meaning.partOfSpeech}-${index}`} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="uppercase tracking-wider text-xs text-app-primary font-bold">
                  {meaning.partOfSpeech}
                </h3>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>

              <ul className="space-y-4 pl-1">
                {meaning.definitions.slice(0, 3).map((def, dIndex) => (
                  <li
                    key={dIndex}
                    className="text-base text-zinc-800 leading-relaxed"
                  >
                    <span className="text-zinc-300 font-serif mr-2 font-bold select-none">
                      {dIndex + 1}.
                    </span>
                    {def.definition}

                    {def.example && (
                      <blockquote className="text-sm text-zinc-500 italic mt-1.5 pl-4 border-l-2 border-zinc-100">
                        &quot;
                        <Highlight
                          text={def.example}
                          wordToHighlight={data.word}
                        />
                        &quot;
                      </blockquote>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-2 flex items-center gap-4 w-full">
            <SaveButton word={data.word} />
            <ShareButton word={data.word} />
          </div>
        </article>

        {allSynonyms.length > 0 && (
          <div id="synonyms" className="mt-6 pl-1">
            <h4 className="uppercase font-semibold text-zinc-400 text-xs tracking-wider mb-2.5">
              Synonyms
            </h4>
            <ul className="flex flex-wrap gap-2">
              {allSynonyms.map((synonym) => (
                <li key={synonym}>
                  <BadgeLink word={synonym} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
};
