import { getTodayWord } from "@/actions/word";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WordContent } from "@/components/word/wordContent";
import { WordCollectionType } from "@/types/firebase";
import { Timestamp } from "firebase-admin/firestore";

export default async function Home() {
  const word =
    (await getTodayWord()) ??
    ({
      word: "Ephemeral",
      type: "adjective",
      pronounce: "/əˈfem(ə)rəl/",
      definition:
        "Lasting for a very short time; fleeting or transitory in nature.",
      usage:
        "The beauty of the sunset was ephemeral, fading into the dark of night within minutes, leaving only a memory of its vibrant hues.",
      synonyms: ["transient", "momentary", "brief"],
      createdAt: Timestamp.fromDate(new Date("2026-02-14T00:00:00Z")),
      dayId: "2026-02-14",
    } as WordCollectionType);

  return (
    <>
      <Header />
      <WordContent word={word} />
      <Footer />
    </>
  );
}
