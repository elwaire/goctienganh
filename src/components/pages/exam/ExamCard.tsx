import { colorMap, difficultyConfig } from "@/constants";
import { Exam } from "@/types";
import {
  Clock,
  FileText,
  MoreHorizontal,
  Play,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

// Exam Card Component
export default function ExamCard({
  exam,
  isMyExam,
}: {
  exam: Exam;
  isMyExam: boolean;
}) {
  const colors = colorMap[exam.color];
  const Icon = exam.icon;
  const difficulty = difficultyConfig[exam.difficulty];

  return (
    <div className="group bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:border-neutral-200 transition-all duration-200">
      {/* Header */}
      <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-5">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 ${colors.bgLight} rounded-xl flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="flex items-center gap-2">
            {exam.isOfficial && (
              <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <Sparkles className="w-3 h-3" />
                Official
              </span>
            )}
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg ${difficulty.class}`}
            >
              {difficulty.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-lg text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
          {exam.title}
        </h3>
        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
          {exam.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {exam.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            {exam.questions} câu
          </span>
          {exam.attempts !== undefined && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {exam.attempts}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="text-sm">
            {exam.bestScore !== undefined ? (
              <span className="text-neutral-500">
                Điểm cao nhất:{" "}
                <span className={`font-semibold ${colors.text}`}>
                  {exam.bestScore}
                </span>
              </span>
            ) : (
              <span className="text-neutral-400 italic">Chưa làm bài</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isMyExam && (
              <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
            <Link href={`/exam/${exam.id}`}>
              <button
                className={`
                flex items-center gap-1.5 px-4 py-2
                text-sm font-medium text-white rounded-xl
                bg-gradient-to-r ${colors.gradient}
                hover:opacity-90 transition-opacity
              `}
              >
                <Play className="w-4 h-4" />
                Bắt đầu
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
