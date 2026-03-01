import type { ExamSet } from "@/types/exam";
import { colorMap } from "@/constants";
import { Clock, FileText, ChevronRight, Tag, Star } from "lucide-react";
import Link from "next/link";

type ExamCardProps = {
  exam: ExamSet;
};

const levelConfig: Record<string, { label: string; color: string }> = {
  easy: { label: "Dễ", color: "emerald" },
  medium: { label: "Trung bình", color: "amber" },
  hard: { label: "Khó", color: "rose" },
};

export default function ExamCard({ exam }: ExamCardProps) {
  const level = levelConfig[exam.level] ?? levelConfig.medium;

  return (
    <Link
      href={`/exam/${exam.code}`}
      className="group relative bg-white rounded-3xl border border-neutral-100 p-6 hover:shadow-2xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 block overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl" />
      
      {/* Top badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ring-1 ring-inset ${
              colorMap[level.color]?.bgLight ?? "bg-neutral-100"
            } ${colorMap[level.color]?.text ?? "text-neutral-600"} ${
              level.color === "emerald" ? "ring-emerald-200" : 
              level.color === "amber" ? "ring-amber-200" : "ring-rose-200"
            }`}
          >
            {level.label}
          </span>
          {exam.topic && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100">
              {exam.topic.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
          <Star className="w-3 h-3 fill-amber-500" />
          {exam.total_score}đ
        </div>
      </div>

      {/* Content */}
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-neutral-800 group-hover:text-primary-600 transition-colors leading-tight">
            {exam.title}
          </h3>
          <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0 ml-2 mt-0.5" />
        </div>
        {exam.description && (
          <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 py-4 border-y border-neutral-50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-xl">
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 leading-none mb-1">Câu hỏi</span>
            <span className="text-sm font-bold text-neutral-700 leading-none">{exam.question_count} câu</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 leading-none mb-1">Thời gian</span>
            <span className="text-sm font-bold text-neutral-700 leading-none">{exam.duration_min} phút</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
        {exam.tags?.map((tag, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-1 px-2 py-0.5 bg-neutral-50 text-neutral-500 rounded text-[10px] font-medium border border-neutral-100"
          >
            <Tag className="w-2.5 h-2.5" />
            {tag}
          </div>
        ))}
      </div>
    </Link>
  );
}
