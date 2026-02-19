import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ArchiveCardProps {
  word: string;
  type: string;
  definition: string;
  createdAt: string;
  dayId: string;
}

export const ArchiveCard = (props: ArchiveCardProps) => {
  const { word, type, definition, createdAt, dayId } = props;
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

  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-zinc-300 p-8 space-y-4 max-w-md rounded-md">
      <div className="w-full inline-flex items-center justify-between">
        <span className="py-1 px-2 bg-app-primary/20 text-app-primary uppercase text-[0.813rem] font-medium rounded">
          {date}
        </span>
        <Bookmark
          onClick={handleSaveWord}
          className={`cursor-pointer ${isCurrentWordSaved ? "text-app-primary" : "text-zinc-400"}`}
          fill="currentColor"
        />
      </div>

      <div className="space-y-2">
        <h5 className="font-serif font-bold text-3xl">{word}</h5>
        <p className="text-zinc-500 italic text-sm">{type}</p>
        <p className="text-zinc-500 w-[85%]">{definition}</p>
      </div>

      <hr />

      <Link
        href={`/archive/${dayId}`}
        className="inline-flex items-center justify-between w-full hover:bg-zinc-100 transition-colors duration-300 px-4 py-2 rounded-md"
      >
        <p className="text-sm text-zinc-500">Read more</p>
        <ArrowRight className="text-app-primary" />
      </Link>
    </div>
  );
};

export * from "./loading";
