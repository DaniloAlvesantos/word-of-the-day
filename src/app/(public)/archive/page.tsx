"use client";
import {
  ArchiveCard,
  ArchiveCardSkeleton,
} from "@/components/cards/archiveCard";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useArchives } from "@/hooks/useArchives";

export default function ArchivePage() {
  const { data, isLoading, isSuccess } = useArchives(6);

  if (!data || !isSuccess) {
    return;
  }

  return (
    <>
      <Header />
      <section className="my-4 p-4">
        <h2 className="font-serif font-semibold text-4xl">Archive</h2>
        <p className="text-zinc-500">
          A chronicle of curiosity, one day at a time
        </p>
        <hr className="mt-6" />
      </section>

      <main className="p-4 min-h-[calc(80dvh-200px)] sm:min-h-auto">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ArchiveCardSkeleton key={index} />
            ))
          : data.map((archive) => {
              return <ArchiveCard {...archive} key={crypto.randomUUID()} />;
            })}
      </main>
      <Footer />
    </>
  );
}
