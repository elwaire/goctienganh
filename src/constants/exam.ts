import { Difficulty } from "@/types";

export const colorMap: Record<
  string,
  { bg: string; bgLight: string; text: string; gradient: string }
> = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600",
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  rose: {
    bg: "bg-rose-500",
    bgLight: "bg-rose-50",
    text: "text-rose-600",
    gradient: "from-rose-500 to-rose-600",
  },
  amber: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-50",
    text: "text-amber-600",
    gradient: "from-amber-500 to-amber-600",
  },
  cyan: {
    bg: "bg-cyan-500",
    bgLight: "bg-cyan-50",
    text: "text-cyan-600",
    gradient: "from-cyan-500 to-cyan-600",
  },
  orange: {
    bg: "bg-orange-500",
    bgLight: "bg-orange-50",
    text: "text-orange-600",
    gradient: "from-orange-500 to-orange-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    bgLight: "bg-indigo-50",
    text: "text-indigo-600",
    gradient: "from-indigo-500 to-indigo-600",
  },
};

export const difficultyConfig: Record<
  Difficulty,
  { label: string; class: string }
> = {
  easy: { label: "Dễ", class: "text-emerald-600 bg-emerald-50" },
  medium: { label: "Trung bình", class: "text-amber-600 bg-amber-50" },
  hard: { label: "Khó", class: "text-rose-600 bg-rose-50" },
};
