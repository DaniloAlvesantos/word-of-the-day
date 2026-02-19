"use client";
import { Speech } from "@/util/speech";
import { Volume2 } from "lucide-react";
import { useState } from "react";

interface PronounceButtonProps {
  word: string;
}

export const PronounceButton = ({ word }: PronounceButtonProps) => {
  const [speechTime, setSpeechTime] = useState<number>(1);

  const handleSpeech = () => {
    Speech(word, speechTime);
    setSpeechTime((prev) => prev + 1);
  };

  return (
    <button
      type="button"
      aria-label="Play pronunciation"
      className="bg-app-primary text-white p-2 shadow-md shadow-app-primary rounded-full hover:bg-app-primary/80 transition-colors duration-300 cursor-pointer"
      onClick={handleSpeech}
    >
      <Volume2 className="size-5 sm:size-6" aria-label="volume-icon" />
    </button>
  );
};
