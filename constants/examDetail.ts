import { AttemptResult, ExamSection, LeaderboardEntry } from "@/types";
import { Difficulty } from "@/types/examDetail";

export const examSections: ExamSection[] = [
  {
    id: "1",
    title: "User Research & Analysis",
    description: "Phương pháp nghiên cứu và phân tích người dùng",
    questionsCount: 10,
    duration: "8 phút",
  },
  {
    id: "2",
    title: "Information Architecture",
    description: "Cấu trúc thông tin và navigation",
    questionsCount: 8,
    duration: "6 phút",
  },
  {
    id: "3",
    title: "Visual Design Principles",
    description: "Nguyên tắc thiết kế thị giác",
    questionsCount: 12,
    duration: "10 phút",
  },
  {
    id: "4",
    title: "Prototyping & Testing",
    description: "Tạo prototype và kiểm thử",
    questionsCount: 10,
    duration: "6 phút",
  },
];

export const attemptHistory: AttemptResult[] = [
  {
    id: "1",
    date: "15/02/2024",
    score: 92,
    totalQuestions: 40,
    correctAnswers: 37,
    duration: "25:30",
    isPassed: true,
  },
  {
    id: "2",
    date: "10/02/2024",
    score: 78,
    totalQuestions: 40,
    correctAnswers: 31,
    duration: "28:45",
    isPassed: true,
  },
  {
    id: "3",
    date: "05/02/2024",
    score: 65,
    totalQuestions: 40,
    correctAnswers: 26,
    duration: "30:00",
    isPassed: false,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Minh Nguyễn", avatar: "MN", score: 98, date: "12/02" },
  { rank: 2, name: "Hương Trần", avatar: "HT", score: 96, date: "14/02" },
  { rank: 3, name: "Đức Phạm", avatar: "DP", score: 95, date: "11/02" },
  { rank: 4, name: "Linh Lê", avatar: "LL", score: 94, date: "13/02" },
  { rank: 5, name: "Bạn", avatar: "ME", score: 92, date: "15/02" },
];

export const colorMap: Record<
  string,
  { bg: string; bgLight: string; text: string; gradient: string; ring: string }
> = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    ring: "ring-blue-200",
  },
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600",
    ring: "ring-emerald-200",
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    ring: "ring-purple-200",
  },
};

const difficultyConfig: Record<Difficulty, { label: string; class: string }> = {
  easy: { label: "Dễ", class: "text-emerald-600 bg-emerald-50" },
  medium: { label: "Trung bình", class: "text-amber-600 bg-amber-50" },
  hard: { label: "Khó", class: "text-rose-600 bg-rose-50" },
};
