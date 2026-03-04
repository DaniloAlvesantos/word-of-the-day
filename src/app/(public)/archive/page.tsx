"use client";

import {
  ArchiveCard,
  ArchiveCardSkeleton,
} from "@/components/cards/archiveCard";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useArchives } from "@/hooks/useArchives";

export default function ArchivePage() {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useArchives();

  const sortedData =
    data?.pages
      .flatMap((p) => p.data)
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ) ?? [];

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

      <main>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 space-y-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="break-inside-avoid">
                  <ArchiveCardSkeleton />
                </div>
              ))
            : sortedData.map((archive) => (
                <div key={archive.dayId} className="break-inside-avoid">
                  <ArchiveCard {...archive} />
                </div>
              ))}
        </div>
        <div
          className="w-full flex items-center justify-center mt-10"
          id="next"
        >
          {hasNextPage ? (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="bg-white w-full sm:w-xs"
            >
              {isFetchingNextPage ? "Loading more..." : "Load More"}
            </Button>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
