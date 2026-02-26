import { getWholeArchive } from "@/actions/word";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { DefaultQuiz } from "@/components/quiz/defaultQuiz";
import { WordContent } from "@/components/word/wordContent";
import { redirect } from "next/navigation";

export default async function WordPAge({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { word, quiz } = await getWholeArchive(id);

  if (!word) redirect("/notFound");

  const serializedQuiz = quiz ? {
    ...quiz,
    updatedAt: quiz.updatedAt.toDate().toISOString(),
  } : null;

  return (
    <>
      <Header />
      <WordContent word={word} />
      <section className="w-full flex flex-col items-center mt-16" id="quiz">
        <div className="w-[90%] sm:w-[60%]">
          {!!serializedQuiz ? <DefaultQuiz quizData={serializedQuiz} /> : null}
        </div>
      </section>
      <Footer />
    </>
  );
}
