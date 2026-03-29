import { axiosInstance } from "@/lib/axios";
import type { UserStreak, StreakResponse } from "@/types/streak";

export const streakApi = {
  /** GET /v1/streak - Fetch and check-in user streak */
  getStreak: async (): Promise<UserStreak> => {
    const response = await axiosInstance.get<StreakResponse>("/streak");
    return response.data.data;
  },
};
