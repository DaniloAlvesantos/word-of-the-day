"use client";
import { Speech } from "@/util/speech";
import { Volume2 } from "lucide-react";
import { useState } from "react";

interface PronounceButtonProps {
  word: string;
  style?: "Circle" | "Regular";
}

export const PronounceButton = ({
  word,
  style = "Circle",
}: PronounceButtonProps) => {
  const [speechTime, setSpeechTime] = useState<number>(1);

  const handleSpeech = () => {
    Speech(word, speechTime);
    setSpeechTime((prev) => prev + 1);
  };

  return (
    <button
      type="button"
      aria-label="Play pronunciation"
      className={`bg-app-primary text-white p-2 shadow-md shadow-app-primary hover:bg-app-primary/80 transition-colors duration-300 cursor-pointer rounded-full ${style === "Regular" && "text-xs px-3 py-1 h-auto"}`}
      onClick={handleSpeech}
    >
      {style === "Circle" ? (
        <Volume2 className="size-5 sm:size-6" aria-label="volume-icon" />
      ) : (
        "Pronounce by AI"
      )}
    </button>
  );
};
