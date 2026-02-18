// app/(main)/exam/[id]/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  FileText,
  Trophy,
  Users,
  Star,
  Play,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Target,
  Zap,
  BookOpen,
  Calendar,
  TrendingUp,
  Medal,
  Info,
  Sparkles,
} from "lucide-react";
import { DifficultyDetailExam } from "@/types";
import {
  attemptHistory,
  colorMap,
  examSections,
  leaderboard,
} from "@/constants/examDetail";
import { difficultyConfig } from "@/constants";

// Mock data
const examData = {
  id: "1",
  title: "UI/UX Fundamentals",
  description:
    "Bài kiểm tra toàn diện về kiến thức nền tảng UI/UX Design. Bao gồm các chủ đề: User Research, Information Architecture, Wireframing, Prototyping và các nguyên tắc thiết kế cơ bản.",
  category: "Nền tảng",
  icon: BookOpen,
  color: "blue",
  duration: "30 phút",
  totalQuestions: 40,
  passingScore: 70,
  difficulty: "medium" as DifficultyDetailExam,
  attempts: 1250,
  avgScore: 78,
  isOfficial: true,
  createdAt: "2024-01-15",
  updatedAt: "2024-02-01",
  topics: [
    "User Research",
    "Information Architecture",
    "Wireframing",
    "Visual Design",
    "Prototyping",
    "Usability Testing",
  ],
};

export default function ExamDetailPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "leaderboard"
  >("overview");

  const colors = colorMap[examData.color];
  const difficulty = difficultyConfig[examData.difficulty];
  const Icon = examData.icon;
  const bestScore =
    attemptHistory.length > 0
      ? Math.max(...attemptHistory.map((a) => a.score))
      : null;

  const handleStartExam = () => {
    router.push(`/exam/${examData.id}/start`);
  };

  const handleBack = () => {
    router.push("/exam");
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6">
        {/* Gradient Bar */}
        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${colors.bgLight} rounded-2xl flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-8 h-8 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {examData.isOfficial && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3" />
                        Official
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${difficulty.class}`}
                    >
                      {difficulty.label}
                    </span>
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                      {examData.category}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                    {examData.title}
                  </h1>
                  <p className="text-neutral-500 leading-relaxed">
                    {examData.description}
                  </p>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mt-4">
                {examData.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Action Card */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-neutral-50 rounded-2xl p-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Clock className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.duration}
                    </p>
                    <p className="text-xs text-neutral-500">Thời gian</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <FileText className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.totalQuestions}
                    </p>
                    <p className="text-xs text-neutral-500">Câu hỏi</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Target className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.passingScore}%
                    </p>
                    <p className="text-xs text-neutral-500">Điểm đạt</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Users className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.attempts.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500">Lượt thi</p>
                  </div>
                </div>

                {/* Best Score */}
                {bestScore !== null && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl mb-5 ${colors.bgLight}`}
                  >
                    <div
                      className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center`}
                    >
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">
                        Điểm cao nhất của bạn
                      </p>
                      <p className={`text-2xl font-bold ${colors.text}`}>
                        {bestScore}
                      </p>
                    </div>
                  </div>
                )}

                {/* Start Button */}
                <button
                  onClick={handleStartExam}
                  className={`
                    w-full flex items-center justify-center gap-2 py-4 px-6
                    text-base font-semibold text-white rounded-xl
                    bg-gradient-to-r ${colors.gradient}
                    hover:opacity-90 transition-opacity shadow-lg
                  `}
                >
                  <Play className="w-5 h-5" />
                  {attemptHistory.length > 0
                    ? "Làm lại bài thi"
                    : "Bắt đầu làm bài"}
                </button>

                {attemptHistory.length > 0 && (
                  <p className="text-xs text-neutral-400 text-center mt-3">
                    Bạn đã làm bài này {attemptHistory.length} lần
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 mb-6">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          icon={<BookOpen className="w-4 h-4" />}
          label="Tổng quan"
        />
        <TabButton
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
          icon={<RotateCcw className="w-4 h-4" />}
          label="Lịch sử"
          count={attemptHistory.length}
        />
        <TabButton
          active={activeTab === "leaderboard"}
          onClick={() => setActiveTab("leaderboard")}
          icon={<Trophy className="w-4 h-4" />}
          label="Bảng xếp hạng"
        />
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Nội dung bài thi
            </h2>
            <div className="space-y-3">
              {examSections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${colors.bgLight} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <span className={`text-sm font-bold ${colors.text}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-800">
                      {section.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {section.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-neutral-800">
                      {section.questionsCount} câu
                    </p>
                    <p className="text-xs text-neutral-400">
                      {section.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips & Info */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-neutral-100 p-4">
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neutral-400" />
                Thống kê chung
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    Điểm trung bình
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {examData.avgScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Tỷ lệ đạt</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    72%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Thời gian TB</span>
                  <span className="text-sm font-semibold text-neutral-800">
                    24 phút
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Mẹo làm bài
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Đọc kỹ câu hỏi trước khi chọn đáp án</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Phân bổ thời gian hợp lý cho từng phần</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Đánh dấu câu khó để quay lại sau</span>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-neutral-400" />
                Thông tin
              </h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>Cập nhật: {examData.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Lịch sử làm bài
          </h2>
          {attemptHistory.length > 0 ? (
            <div className="space-y-3">
              {attemptHistory.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors"
                >
                  {/* Status Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      attempt.isPassed ? "bg-emerald-50" : "bg-rose-50"
                    }`}
                  >
                    {attempt.isPassed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-800">
                        Lần {attemptHistory.length - index}
                      </span>
                      {index === 0 && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Gần nhất
                        </span>
                      )}
                      {attempt.score === bestScore && (
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          Điểm cao nhất
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">{attempt.date}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-neutral-400">Đúng</p>
                      <p className="font-semibold text-neutral-800">
                        {attempt.correctAnswers}/{attempt.totalQuestions}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-neutral-400">Thời gian</p>
                      <p className="font-semibold text-neutral-800">
                        {attempt.duration}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-neutral-400">Điểm</p>
                      <p
                        className={`text-2xl font-bold ${
                          attempt.isPassed
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {attempt.score}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Chưa có lịch sử
              </h3>
              <p className="text-neutral-500">
                Bạn chưa làm bài thi này lần nào
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Bảng xếp hạng
          </h2>
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
            {/* Top 3 Podium */}
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-end justify-center gap-4">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold text-neutral-600">
                    {leaderboard[1].avatar}
                  </div>
                  <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center mx-auto -mt-4 mb-2 text-sm font-bold text-white">
                    2
                  </div>
                  <p className="font-medium text-neutral-800 text-sm">
                    {leaderboard[1].name}
                  </p>
                  <p className="text-lg font-bold text-neutral-600">
                    {leaderboard[1].score}
                  </p>
                </div>

                {/* 1st Place */}
                <div className="text-center -mt-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold text-white ring-4 ring-amber-200">
                    {leaderboard[0].avatar}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto -mt-4 mb-2 text-sm font-bold text-white">
                    <Medal className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-neutral-800">
                    {leaderboard[0].name}
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {leaderboard[0].score}
                  </p>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold text-amber-700">
                    {leaderboard[2].avatar}
                  </div>
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mx-auto -mt-4 mb-2 text-sm font-bold text-amber-700">
                    3
                  </div>
                  <p className="font-medium text-neutral-800 text-sm">
                    {leaderboard[2].name}
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    {leaderboard[2].score}
                  </p>
                </div>
              </div>
            </div>

            {/* Rest of leaderboard */}
            <div className="divide-y divide-neutral-100">
              {leaderboard.slice(3).map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 ${
                    entry.avatar === "ME" ? "bg-blue-50" : "hover:bg-neutral-50"
                  } transition-colors`}
                >
                  <span className="w-8 text-center font-semibold text-neutral-400">
                    #{entry.rank}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      entry.avatar === "ME"
                        ? "bg-blue-500 text-white"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${entry.avatar === "ME" ? "text-blue-600" : "text-neutral-800"}`}
                    >
                      {entry.name}
                    </p>
                    <p className="text-xs text-neutral-400">{entry.date}</p>
                  </div>
                  <p
                    className={`text-lg font-bold ${entry.avatar === "ME" ? "text-blue-600" : "text-neutral-800"}`}
                  >
                    {entry.score}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${
          active
            ? "border-primary-500 text-primary-600"
            : "border-transparent text-neutral-500 hover:text-neutral-700"
        }
      `}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            active
              ? "bg-primary-100 text-primary-600"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
