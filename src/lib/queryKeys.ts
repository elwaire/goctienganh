// lib/queryKeys.ts

export const queryKeys = {
  subjects: {
    all: ["subjects"] as const,
  },
  exams: {
    all: ["exams"] as const,
    list: (params: {
      page?: number;
      limit?: number;
      subject_id?: string;
      search?: string;
    }) => ["exams", "list", params] as const,
    detail: (id: string) => ["exams", "detail", id] as const,
  },
  attempts: {
    byExamCode: (examCode: string) =>
      ["attempts", "byExamCode", examCode] as const,
    result: (attemptId: string) => ["attempts", "result", attemptId] as const,
  },
};
