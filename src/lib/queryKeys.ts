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
    leaderboard: (code: string, params?: Record<string, unknown>) => ["exams", "leaderboard", code, params] as const,
  },
  attempts: {
    byExamCode: (examCode: string) =>
      ["attempts", "byExamCode", examCode] as const,
    result: (attemptId: string) => ["attempts", "result", attemptId] as const,
  },
  flashcardDecks: {
    all: ["flashcard-decks"] as const,
    list: (params?: Record<string, unknown>) =>
      ["flashcard-decks", "list", params] as const,
    detail: (deckId: string) =>
      ["flashcard-decks", "detail", deckId] as const,
    cards: (deckId: string, params?: Record<string, unknown>) =>
      ["flashcard-decks", deckId, "cards", params] as const,
    studyStats: (deckId: string) =>
      ["flashcard-decks", deckId, "study-stats"] as const,
    studyHistory: (deckId: string, params?: Record<string, unknown>) =>
      ["flashcard-decks", deckId, "study-history", params] as const,
  },
};
