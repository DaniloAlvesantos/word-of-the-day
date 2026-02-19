import { useQuery } from "@tanstack/react-query";
import { getTodayWord } from "@/actions/word";

export const useWord = () => {
  const query = useQuery({
    queryKey: ["word"],
    queryFn: getTodayWord,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
