import type { ExamSet } from "@/types/exam";
import { colorMap } from "@/constants";
import { Clock, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

type ExamCardProps = {
  exam: ExamSet;
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: "Dễ", color: "emerald" },
  medium: { label: "Trung bình", color: "amber" },
  hard: { label: "Khó", color: "rose" },
};

export default function ExamCard({ exam }: ExamCardProps) {
  const difficulty =
    difficultyConfig[exam.difficulty] ?? difficultyConfig.medium;

  return (
    <Link
      href={`/exam/${exam.code}`}
      className="group bg-white rounded-2xl border border-neutral-100 p-5 hover:shadow-lg hover:border-primary-200 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-neutral-800 truncate group-hover:text-primary-600 transition-colors">
            {exam.title}
          </h3>
          {exam.description && (
            <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
              {exam.description}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 transition-colors shrink-0 ml-2 mt-0.5" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          <FileText className="w-4 h-4" />
          <span>{exam.total_questions} câu</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          <Clock className="w-4 h-4" />
          <span>{exam.duration_minutes} phút</span>
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="mt-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
            colorMap[difficulty.color]?.bgLight ?? "bg-neutral-100"
          } ${colorMap[difficulty.color]?.text ?? "text-neutral-600"}`}
        >
          {difficulty.label}
        </span>
      </div>
    </Link>
  );
}
