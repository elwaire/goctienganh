// Types
export type DifficultyDetailExam = "easy" | "medium" | "hard";

export type AttemptResult = {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: string;
  isPassed: boolean;
};

export type ExamSection = {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  duration: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  date: string;
};
