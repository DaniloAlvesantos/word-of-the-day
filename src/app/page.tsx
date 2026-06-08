import { getTodayWord } from "@/actions/word";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WordContent } from "@/components/word/wordContent";
import { Database } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Home() {
  const word =
    (await getTodayWord()) ??
    ({
      id: "ephemeral_adjective",
      word: "Ephemeral",
      type: "adjective",
      pronounce: "/əˈfem(ə)rəl/",
      definition:
        "Lasting for a very short time; fleeting or transitory in nature.",
      usage:
        "The beauty of the sunset was ephemeral, fading into the dark of night within minutes, leaving only a memory of its vibrant hues.",
      synonyms: ["transient", "momentary", "brief"],
      createdAt: new Date("2026-02-14T00:00:00Z"),
      dayId: "2026-02-14",
    } as unknown as Database["public"]["Tables"]["word"]["Row"]);

  return <WordContent word={word} />;
}
