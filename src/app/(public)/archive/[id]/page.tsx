import { getWordById } from "@/actions/word";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WordContent } from "@/components/word/wordContent";
import { redirect } from "next/navigation";

export default async function WordPAge({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const word = await getWordById(id);

  if(!word) redirect("/notFound");

  return (
    <>
      <Header />
      <WordContent word={word} />
      <Footer />
    </>
  );
}
