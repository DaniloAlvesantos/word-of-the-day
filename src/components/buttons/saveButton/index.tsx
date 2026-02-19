"use client";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bookmark } from "lucide-react";

interface SaveButtonProps {
  word: string;
}

export const SaveButton = ({ word }: SaveButtonProps) => {
  const [savedWords, setSavedWords] = useLocalStorage<string[]>(
    "savedWords",
    [],
  );

  const isCurrentWordSaved = !!savedWords.find(
    (savedWord) => savedWord === word,
  );

  const handleSaveWord = () => {
    if (isCurrentWordSaved) {
      setSavedWords(savedWords.filter((savedWord) => savedWord !== word));
    } else {
      setSavedWords([...savedWords, word]);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-1 py-5 bg-white duration-300"
      onClick={handleSaveWord}
    >
      <Bookmark
        className={`text-app-primary ${isCurrentWordSaved ? "fill-current" : "fill-none"}`}
      />
      Save to list
    </Button>
  );
};
