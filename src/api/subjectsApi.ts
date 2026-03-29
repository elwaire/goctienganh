import { readPagedBody } from "@/lib/apiEnvelope";
import { axiosInstance } from "@/lib/axios";
import type { PageMeta } from "@/types/api";
import type { Subject, SubjectsResponse } from "@/types/subject";

type SubjectsApiResponse = {
  success: boolean;
  message: string;
  data: Subject[];
  metadata?: PageMeta;
};

export const subjectsApi = {
  /** GET /subjects - Fetch all available subjects */
  getAll: async (): Promise<SubjectsResponse> => {
    const response = await axiosInstance.get<SubjectsApiResponse>("/subjects");
    const { rows, meta } = readPagedBody<Subject>(response.data);
    return {
      subjects: rows,
      total: meta?.total_items ?? rows.length,
      page: meta?.page,
      limit: meta?.limit,
      total_pages: meta?.total_pages,
    };
  },
};
