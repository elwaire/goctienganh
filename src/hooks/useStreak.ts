import { useQuery } from "@tanstack/react-query";
import { streakApi } from "@/api/streakApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useStreak() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return useQuery({
    queryKey: ["streak"],
    queryFn: () => streakApi.getStreak(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
