"use client";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Highlight } from "@/components/highlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordCollectionType } from "@/types/firebase/word.collection";
import { Speech } from "@/util/speech";
import { Bookmark, Share2, Volume2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [speechTime, setSpeechTime] = useState<number>(1);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  const word: WordCollectionType = {
    word: "Ephemeral",
    type: "adjective",
    pronounce: "/əˈfem(ə)rəl/",
    definition:
      "Lasting for a very short time; fleeting or transitory in nature.",
    usage:
      "The beauty of the sunset was ephemeral, fading into the dark of night within minutes, leaving only a memory of its vibrant hues.",
    synonyms: ["transient", "momentary", "brief"],
  };

  const handleSpeech = () => {
    Speech(word.word, speechTime);
    setSpeechTime((prev) => prev + 1);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center mt-10">
        <h1 className="sr-only">Learn a new word today</h1>
        <p className="text-sm uppercase font-medium text-zinc-400 tracking-widest">
          Word of the day - <time>{today}</time>
        </p>

        <section id="word-wrapper" className="flex flex-col items-center gap-4">
          <div className="flex gap-4 items-center">
            <h2 className="font-serif font-semibold text-8xl my-2">
              {word.word}
            </h2>
            <button
              type="button"
              aria-label="Play pronunciation"
              className="bg-app-primary text-white p-2 shadow-md shadow-app-primary rounded-full hover:bg-app-primary/80 transition-colors duration-300"
              onClick={handleSpeech}
            >
              <Volume2 className="size-6" />
            </button>
          </div>

          <div className="text-zinc-400">
            <i title="phonetic spelling">{word.pronounce}</i>
            <span className="mx-2" aria-hidden="true">
              &#9679;
            </span>
            <span>{word.type}</span>
          </div>
        </section>

        <section className="mt-18 flex flex-col w-[60%]">
          <article className="bg-white shadow-md rounded-lg py-4 px-8 md:px-18 md:py-10 space-y-8">
            <div>
              <h2 className="uppercase tracking-wider text-sm text-app-primary font-medium my-2">
                Definition
              </h2>
              <p className="text-lg">{word.definition}</p>
            </div>

            <hr />

            <div>
              <h2 className="uppercase tracking-wider text-sm text-app-primary font-medium my-2">
                Usage in context
              </h2>
              <blockquote className="text-lg text-zinc-500 italic">
                &quot;<Highlight text={word.usage} wordToHighlight={word.word} />&quot;
              </blockquote>
            </div>

            <div className="flex items-center gap-4 w-full">
              <Button variant="outline" className="flex-1 py-5 bg-white duration-300">
                <Bookmark className="text-app-primary" /> Save to list
              </Button>
              <Button variant="outline" className="flex-1 py-5 bg-white duration-300">
                <Share2 className="text-app-primary" /> Share Word
              </Button>
            </div>
          </article>

          <div id="synonyms" className="mt-4">
            <h3 className="uppercase font-semibold text-zinc-400 text-sm mb-2">
              Synonyms
            </h3>
            <ul className="flex gap-2">
              {word.synonyms.map((d) => (
                <li key={crypto.randomUUID()}>
                  <Badge variant="outline" className="bg-white">
                    {d}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
