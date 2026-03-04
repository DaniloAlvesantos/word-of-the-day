import { WordCollectionTypeDateString } from "@/types/firebase";
import { useInfiniteQuery } from "@tanstack/react-query";

type Response = {
  data: WordCollectionTypeDateString[];
  nextCursor: string | null;
};

const fetchArchives = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<Response> => {
  const queryParams = new URLSearchParams({ limit: "7" });
  if (pageParam) queryParams.append("lastVisible", pageParam);

  const response = await fetch(`/api/archive?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch");

  return response.json();
};

export const useArchives = () => {
  const query = useInfiniteQuery({
    queryKey: ["archives"],
    queryFn: fetchArchives,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
