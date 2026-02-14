"use client";
import { Header } from "@/components/header";
import { Speech } from "@/util/speech";
import { Volume2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [speechTime, setSpeechTime] = useState<number>(1);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  const word = {
    text: "Ephemeral",
    pronounce: "/əˈfem(ə)rəl/",
  };

  const handleSpeech = () => {
    Speech(word.text, speechTime);
    setSpeechTime(prev => prev + 1);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center mt-8">
        <p className="text-sm uppercase font-medium text-zinc-400 tracking-widest">
          Word of the day - {today}
        </p>

        <section id="word-wrapper" className="flex flex-col items-center gap-4">
          <div className="flex gap-4 items-center">
            <h1 className="font-serif font-semibold text-8xl my-2">
              {word.text}
            </h1>
            <div
              className="bg-app-primary text-white p-2 shadow-md shadow-app-primary rounded-full cursor-pointer hover:bg-app-primary/80 transition-colors duration-300"
              onClick={handleSpeech}
            >
              <Volume2 className="size-6" />
            </div>
          </div>

          <div className="text-zinc-400">
            <i>{word.pronounce}</i> <span className="mx-2">&#9679;</span>{" "}
            adjective
          </div>
        </section>
      </main>
    </>
  );
}
