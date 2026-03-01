// app/(main)/exam/[slug]/page.tsx

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { examsApi } from "@/api/examsApi";
import { queryKeys } from "@/lib/queryKeys";
import type { ExamDetail, ExamDetailCategoryInfo } from "@/types/exam";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { DifficultyDetailExam } from "@/types";
import { colorMapExamDetail, leaderboard } from "@/constants";
import { difficultyConfig } from "@/constants";
import type { AttemptHistoryItem } from "@/api/examsApi";

export default function ExamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "leaderboard"
  >("overview");

  // Fetch exam detail from API
  const {
    data: examData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.exams.detail(slug),
    queryFn: () => examsApi.getByCode(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch attempt history when history tab is active
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: queryKeys.attempts.byExamCode(slug),
    queryFn: () => examsApi.getAttemptHistory({ exam_code: slug }),
    enabled: !!slug && activeTab === "history",
    staleTime: 30 * 1000,
  });

  const attemptList = historyData?.attempts ?? [];

  // Mutation to start exam attempt
  const startAttemptMutation = useMutation({
    mutationFn: (code: string) => examsApi.startAttempt(code),
    onSuccess: (attemptData) => {
      // Store attempt data in sessionStorage for the start page
      sessionStorage.setItem(
        `exam_attempt_${examData?.code}`,
        JSON.stringify(attemptData),
      );
      router.push(
        `/exam/${examData?.code}/start?attempt_id=${attemptData.attempt_id}`,
      );
    },
    onError: () => {
      alert("Không thể bắt đầu bài thi. Vui lòng thử lại.");
    },
  });

  const handleStartExam = () => {
    if (examData && !startAttemptMutation.isPending) {
      startAttemptMutation.mutate(examData.code);
    }
  };

  const handleBack = () => {
    router.push("/exam");
  };

  // ─── Loading State ───
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-sm text-neutral-400">Đang tải bộ đề...</p>
      </div>
    );
  }

  // ─── Error State ───
  if (isError || !examData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          Không thể tải thông tin bộ đề. Vui lòng thử lại.
        </p>
        <button
          onClick={handleBack}
          className="text-sm text-primary-500 hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // ─── Derived data ───
  const colorKey = "blue"; // default color, can be dynamic later
  const colors = colorMapExamDetail[colorKey];
  const difficulty =
    difficultyConfig[examData.level as DifficultyDetailExam] ??
    difficultyConfig.medium;

  const bestScore =
    attemptList.length > 0
      ? Math.max(...attemptList.map((a) => a.score))
      : null;

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
                  <BookOpen className={`w-8 h-8 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {examData.is_public && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3" />
                        Public
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${difficulty.class}`}
                    >
                      {difficulty.label}
                    </span>
                    {examData.subject && (
                      <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                        {examData.subject.name}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                    {examData.title}
                  </h1>
                  {examData.description && (
                    <p className="text-neutral-500 leading-relaxed">
                      {examData.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {examData.tags && examData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {examData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Action Card */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-neutral-50 rounded-2xl p-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Clock className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.duration_min} phút
                    </p>
                    <p className="text-xs text-neutral-500">Thời gian</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <FileText className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.question_count}
                    </p>
                    <p className="text-xs text-neutral-500">Câu hỏi</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Target className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.total_score}
                    </p>
                    <p className="text-xs text-neutral-500">Tổng điểm</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <Users className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800">
                      {examData.categories?.length ?? 0}
                    </p>
                    <p className="text-xs text-neutral-500">Danh mục</p>
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
                  disabled={startAttemptMutation.isPending}
                  className={`
                    w-full flex items-center justify-center gap-2 py-4 px-6
                    text-base font-semibold text-white rounded-xl
                    bg-gradient-to-r ${colors.gradient}
                    hover:opacity-90 transition-opacity shadow-lg
                    disabled:opacity-70 disabled:cursor-not-allowed
                  `}
                >
                  {startAttemptMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  {startAttemptMutation.isPending
                    ? "Đang bắt đầu..."
                    : attemptList.length > 0
                      ? "Làm lại bài thi"
                      : "Bắt đầu làm bài"}
                </button>

                {attemptList.length > 0 && (
                  <p className="text-xs text-neutral-400 text-center mt-3">
                    Bạn đã làm bài này {attemptList.length} lần
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
          count={attemptList.length > 0 ? attemptList.length : undefined}
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
          {/* Sections (Categories from API) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Nội dung bài thi
            </h2>
            <div className="space-y-3">
              {examData.categories && examData.categories.length > 0 ? (
                examData.categories.map(
                  (category: ExamDetailCategoryInfo, index: number) => (
                    <div
                      key={category.id}
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
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-neutral-500">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-neutral-800">
                          {category.question_count} câu
                        </p>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  Chưa có phân loại nào cho bộ đề này
                </div>
              )}
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
                  <span className="text-sm text-neutral-500">Số câu hỏi</span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {examData.question_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Tổng điểm</span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {examData.total_score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Thời gian</span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {examData.duration_min} phút
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Tự phân điểm</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {examData.auto_distribute_score ? "Có" : "Không"}
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
                  <span>
                    Cập nhật:{" "}
                    {new Date(examData.updated_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {examData.topic && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-neutral-400" />
                    <span>Chủ đề: {examData.topic.name}</span>
                  </div>
                )}
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
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              <p className="text-sm text-neutral-400">Đang tải lịch sử...</p>
            </div>
          ) : attemptList.length > 0 ? (
            <div className="space-y-3">
              {attemptList.map((attempt, index) => {
                const isPassed =
                  attempt.max_score > 0
                    ? (attempt.score / attempt.max_score) * 100 >= 70
                    : false;
                const completedDate = attempt.completed_at
                  ? new Date(attempt.completed_at).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Chưa hoàn thành";

                // Calculate duration
                let durationText = "—";
                if (attempt.started_at && attempt.completed_at) {
                  const startMs = new Date(attempt.started_at).getTime();
                  const endMs = new Date(attempt.completed_at).getTime();
                  const diffSec = Math.max(
                    0,
                    Math.floor((endMs - startMs) / 1000),
                  );
                  const mins = Math.floor(diffSec / 60);
                  const secs = diffSec % 60;
                  durationText = `${mins}:${secs.toString().padStart(2, "0")}`;
                }

                return (
                  <div
                    key={attempt.id}
                    onClick={() =>
                      router.push(
                        `/exam/${slug}/result?attempt_id=${attempt.id}`,
                      )
                    }
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors cursor-pointer"
                  >
                    {/* Status Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isPassed ? "bg-emerald-50" : "bg-rose-50"
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-500" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-neutral-800">
                          Lần {attemptList.length - index}
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
                      <p className="text-sm text-neutral-500">
                        {completedDate}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-neutral-400">Đúng</p>
                        <p className="font-semibold text-neutral-800">
                          {attempt.correct_count}/{attempt.total_questions}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-neutral-400">Thời gian</p>
                        <p className="font-semibold text-neutral-800">
                          {durationText}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-neutral-400">Điểm</p>
                        <p
                          className={`text-2xl font-bold ${
                            isPassed ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {attempt.score}/{attempt.max_score}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-2 text-neutral-400">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
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
