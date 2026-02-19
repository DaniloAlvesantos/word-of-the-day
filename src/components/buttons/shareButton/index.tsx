"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  word: string;
}

export const ShareButton = ({ word }: ShareButtonProps) => {
  const handleShare = async () => {
    try {
      const shareData = {
        title: `Word of the Day: ${word}`,
        text: `Check out today's word: ${word}!\n\nDiscover its meaning, pronunciation, and usage. Expand your vocabulary with Word of the Day!`,
        url: `${window.location.origin}/archive/${word.toLowerCase()}`,
      };

      await navigator.share(shareData);
    } catch (error) {
      console.warn("Error sharing:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-1 py-5 bg-white duration-300"
      onClick={handleShare}
    >
      <Share2 className="text-app-primary" /> Share Word
    </Button>
  );
};
