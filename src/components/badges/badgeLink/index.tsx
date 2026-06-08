import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const BadgeLink = ({ word }: { word: string }) => {
  return (
    <Link href={`/dictionary/${word}`}>
      <Badge
        variant="outline"
        className="bg-white border-zinc-200 text-zinc-700 font-normal py-1 px-2.5 hover:bg-zinc-100 transition-colors duration-150"
      >
        {word}
      </Badge>
    </Link>
  );
};
