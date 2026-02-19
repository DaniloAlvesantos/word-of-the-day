import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";

export const ArchiveCardSkeleton = () => {
  return (
    <div className="bg-white border border-zinc-300 p-8 space-y-4 max-w-md rounded-md w-full">
      <div className="w-full inline-flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded" />
        <Bookmark className="text-zinc-100" fill="currentColor" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-9 w-3/4" />

        <Skeleton className="h-4 w-1/4" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      </div>

      <hr className="border-zinc-100" />

      <div className="inline-flex items-center justify-between w-full px-4 py-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
};
