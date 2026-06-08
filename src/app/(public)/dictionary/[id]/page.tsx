import { getDictionaryWord } from "@/actions/dictionary";
import { DictionaryContent } from "@/components/word/dictionaryContent";
import { redirect } from "next/navigation";

export default async function WordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const word = await getDictionaryWord(id);
  console.log(word);

  if (!word) return redirect('/404');

  return <DictionaryContent data={word[0]} />;
}
