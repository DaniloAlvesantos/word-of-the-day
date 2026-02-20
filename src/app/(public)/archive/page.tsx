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

  if (!isSuccess && !isLoading) {
    return null;
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

      <main className="p-4 min-h-[calc(80dvh-200px)] sm:min-h-auto columns-1 sm:columns-2 md:columns-3 gap-4 space-y-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="break-inside-avoid">
                <ArchiveCardSkeleton />
              </div>
            ))
          : data?.map((archive) => (
              <div key={archive.createdAt} className="break-inside-avoid">
                <ArchiveCard {...archive} />
              </div>
            ))}
      </main>
      <Footer />
    </>
  );
}
