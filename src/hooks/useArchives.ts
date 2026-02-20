import { WordCollectionTypeDateString } from "@/types/firebase";
import { useQuery } from "@tanstack/react-query";

const fetchArchives = async (limit: number, lastVisible?: string): Promise<WordCollectionTypeDateString[]> => {
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() });
    if (lastVisible) {
      queryParams.append("lastVisible", lastVisible);
    }
    const response = await fetch(`/api/archive?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch archives");
    }

    return (await response.json()) as WordCollectionTypeDateString[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const useArchives = (limit: number, lastVisible?: string) => {
  const query = useQuery({
    queryKey: ["archives", limit, lastVisible],
    queryFn: () => fetchArchives(limit, lastVisible),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
