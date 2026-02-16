export type Flashcard = {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  vietnamese: string;
  createdAt: number;
};

export type FlashcardFormData = Omit<Flashcard, "id" | "createdAt">;

export type CardStatus = "unseen" | "known" | "learning";

export type ViewMode = "list" | "study" | "complete";

export type StudyStats = {
  known: number;
  learning: number;
  total: number;
  progress: number;
};

export type CollectionColor =
  | "blue"
  | "emerald"
  | "purple"
  | "rose"
  | "amber"
  | "cyan";

// Collection chứa nhiều flashcards
export type Collection = {
  id: string;
  name: string;
  description?: string;
  color: CollectionColor;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
  lastStudied?: number;
};

// Form data khi tạo/edit collection
export type CollectionFormData = {
  name: string;
  description?: string;
  color: CollectionColor;
};
