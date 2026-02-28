// Types
export type ExamCategory =
  | "all"
  | "fundamentals"
  | "ui"
  | "ux"
  | "tools"
  | "case-study";
export type TabType = "explore" | "my-exams";
export type Difficulty = "easy" | "medium" | "hard";

export type Exam = {
  id: string;
  title: string;
  description: string;
  category: ExamCategory;
  icon: React.ElementType;
  color: string;
  duration: string;
  questions: number;
  difficulty: Difficulty;
  attempts?: number;
  bestScore?: number;
  isOfficial?: boolean;
  createdBy?: string;
};
