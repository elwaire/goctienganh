import { axiosInstance } from "@/lib/axios";
import type { SubjectsResponse } from "@/types/subject";

type SubjectsApiResponse = {
  success: boolean;
  message: string;
  data: SubjectsResponse;
};

export const subjectsApi = {
  /** GET /subjects - Fetch all available subjects */
  getAll: async (): Promise<SubjectsResponse> => {
    const response = await axiosInstance.get<SubjectsApiResponse>("/subjects");
    return response.data.data;
  },
};
