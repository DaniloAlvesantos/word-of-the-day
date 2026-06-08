"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";

interface DatamuseSuggestion {
  word: string;
  score: number;
}

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 250);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const cleanQuery = debouncedQuery.trim();
      if (!cleanQuery) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.datamuse.com/sug?s=${encodeURIComponent(cleanQuery)}&max=6`,
        );
        if (!response.ok) throw new Error("Network response error");

        const data: DatamuseSuggestion[] = await response.json();
        setSuggestions(data.map((item) => item.word));
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error("Autocomplete failure:", error);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      navigateToWord(query.trim());
    }
  };

  const navigateToWord = (targetWord: string) => {
    setIsOpen(false);
    router.push(`/dictionary/${encodeURIComponent(targetWord.toLowerCase())}`);
  };

  return (
    <section className="p-4 sm:p-8 md:p-12 max-w-xl mx-auto">
      <span>
        <h2 className="font-serif font-semibold text-4xl sm:text-6xl my-2 text-center sm:text-left">
          Dictionary
        </h2>
        <p className="text-zinc-400 text-center sm:text-left">
          Insert the word you want to search
        </p>
      </span>

      <main ref={containerRef} className="w-full relative my-8">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a word..."
          className="w-full focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-app-primary/80 selection:bg-app-primary py-3 px-4 h-auto shadow-sm relative z-20"
        />

        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-zinc-100 rounded-lg shadow-lg py-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  navigateToWord(suggestion);
                }}
                className="w-full text-left px-4 py-2 text-sm sm:text-base text-zinc-700 hover:bg-zinc-50 hover:text-app-primary font-medium transition-colors duration-150 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </main>
    </section>
  );
}
