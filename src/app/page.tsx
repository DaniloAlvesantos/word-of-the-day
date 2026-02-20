import { getTodayWord } from "@/actions/word";
import { PronounceButton } from "@/components/buttons/pronounceButton";
import { SaveButton } from "@/components/buttons/saveButton";
import { ShareButton } from "@/components/buttons/shareButton";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Highlight } from "@/components/highlight";
import { Badge } from "@/components/ui/badge";
import { WordCollectionType } from "@/types/firebase";
import { Timestamp } from "firebase-admin/firestore";

export default async function Home() {
  const { word, serverDate } =
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

  console.log(serverDate);

  if (!word) return;

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center mt-10">
        <h1 className="sr-only">Learn a new word today</h1>
        <p className="text-sm uppercase font-medium text-zinc-400 tracking-widest">
          Word of the day -
          <time>
            {word.createdAt.toDate().toLocaleDateString("en-US", {
              month: "long",
              day: "2-digit",
            })}
          </time>
        </p>

        <section id="word-wrapper" className="flex flex-col items-center gap-4">
          <div className="flex gap-4 items-center">
            <h2 className="font-serif font-semibold text-6xl sm:text-8xl my-2">
              {word.word}
            </h2>
            <PronounceButton word={word.word} />
          </div>

          <div className="text-zinc-400">
            <i title="phonetic spelling">{word.pronounce}</i>
            <span className="mx-2" aria-hidden="true">
              &#9679;
            </span>
            <span>{word.type}</span>
          </div>
        </section>

        <section className="mt-18 flex flex-col w-[90%] sm:w-[60%]">
          <article className="bg-white shadow-md rounded-lg py-4 px-8 md:px-18 md:py-10 space-y-8">
            <div>
              <h2 className="uppercase tracking-wider text-sm text-app-primary font-medium my-2">
                Definition
              </h2>
              <p className="text-lg">{word.definition}</p>
            </div>

            <hr />

            <div>
              <h2 className="uppercase tracking-wider text-sm text-app-primary font-medium my-2">
                Usage in context
              </h2>
              <blockquote className="text-lg text-zinc-500 italic">
                &quot;
                <Highlight text={word.usage} wordToHighlight={word.word} />
                &quot;
              </blockquote>
            </div>

            <div className="inline-flex items-center gap-4 w-full">
              <SaveButton word={word.word} />
              <ShareButton word={word.word} />
            </div>
          </article>

          <div id="synonyms" className="mt-4">
            <h3 className="uppercase font-semibold text-zinc-400 text-sm mb-2">
              Synonyms
            </h3>
            <ul className="flex gap-2">
              {word.synonyms.map((d) => (
                <li key={crypto.randomUUID()}>
                  <Badge variant="outline" className="bg-white">
                    {d}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
