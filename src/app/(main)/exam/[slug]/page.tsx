// app/(main)/exam/[slug]/page.tsx

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { examsApi } from "@/api/examsApi";
import type { LeaderboardEntry } from "@/api/examsApi";
import { queryKeys } from "@/lib/queryKeys";
import type { ExamDetailCategoryInfo } from "@/types/exam";
import {
  ArrowLeft,
  Clock,
  FileText,
  Trophy,
  Users,
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
  Layers,
} from "lucide-react";
import { DifficultyDetailExam } from "@/types";
import { colorMapExamDetail } from "@/constants";
import { difficultyConfig } from "@/constants";
import { useTranslations } from "next-intl";
import { ButtonPrimary } from "@/components/ui";

export default function ExamDetailPage() {
  const t = useTranslations("exam.page");
  const td = useTranslations("exam.detail");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const activeTab =
    (searchParams.get("tab") as "overview" | "history" | "leaderboard") ||
    "overview";

  const handleTabChange = (tab: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", tab);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`/exam/${slug}${query}`, { scroll: false });
  };

  // Fetch exam detail from API
  const {
    data: examData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.exams.detail(slug),
    queryFn: () => examsApi.getByCode(slug),
    enabled: !!slug,
  });

  // Fetch attempt history when history tab is active
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: queryKeys.attempts.byExamCode(slug),
    queryFn: () => examsApi.getAttemptHistory({ exam_code: slug }),
    enabled: !!slug && activeTab === "history",
  });

  const attemptList = historyData?.attempts ?? [];

  // Fetch leaderboard when leaderboard tab is active
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: queryKeys.exams.leaderboard(slug, { sort: "score" }),
    queryFn: () => examsApi.getLeaderboard(slug, { sort: "score" }),
    enabled: !!slug && activeTab === "leaderboard",
  });

  const leaderboardList = leaderboardData?.entries ?? [];
  const userEntry = leaderboardData?.user_entry;

  // Derive top 3 for podium
  const top3 = [
    leaderboardList.find((e: LeaderboardEntry) => e.rank === 1),
    leaderboardList.find((e: LeaderboardEntry) => e.rank === 2),
    leaderboardList.find((e: LeaderboardEntry) => e.rank === 3),
  ];
  const restOfLeaderboard = leaderboardList.filter(
    (e: LeaderboardEntry) => e.rank > 3,
  );

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
      alert(td("startError"));
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
        <p className="text-sm text-neutral-400">{td("loadingExam")}</p>
      </div>
    );
  }

  // ─── Error State ───
  if (isError || !examData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">{td("errorLoading")}</p>
        <button
          onClick={handleBack}
          className="text-sm text-primary-500 hover:underline"
        >
          {td("backToList")}
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
        <span className="font-medium">{t("back")}</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 ${colors.bgLight} rounded-xl flex items-center justify-center shrink-0`}
                >
                  <BookOpen className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {examData.is_public && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <Sparkles className="w-3 h-3" />
                        {t("public")}
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-md ${difficulty.class}`}
                    >
                      {difficulty.label}
                    </span>
                    {examData.subject && (
                      <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
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
              </div>
            </div>

            {/* Right: Action Card */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-neutral-50 rounded-xl p-5">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="text-center p-3 bg-white rounded-xl border border-neutral-100/50">
                    <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800 leading-tight">
                      {examData.duration_min} {t("minus")}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
                      {t("duration")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-neutral-100/50">
                    <FileText className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800 leading-tight">
                      {examData.question_count}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
                      {t("questions")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-neutral-100/50">
                    <Target className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800 leading-tight">
                      {examData.total_score}
                      {td("points")}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
                      {td("totalScore")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-neutral-100/50">
                    <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800 leading-tight">
                      {examData.participant_count ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
                      {td("participants")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-neutral-100/50">
                    <RotateCcw className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800 leading-tight">
                      {examData.attempt_count ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
                      {td("attempts")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl border border-neutral-100/50">
                    <Layers className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-neutral-800 leading-tight">
                      {examData.categories?.length ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mt-0.5">
                      {td("categories")}
                    </p>
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
                        {td("bestScore")}
                      </p>
                      <p className={`text-2xl font-bold ${colors.text}`}>
                        {bestScore}
                      </p>
                    </div>
                  </div>
                )}

                {/* Start Button */}
                <ButtonPrimary
                  onClick={handleStartExam}
                  disabled={startAttemptMutation.isPending}
                  className="w-full"
                >
                  {startAttemptMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  {startAttemptMutation.isPending
                    ? td("starting")
                    : attemptList.length > 0
                      ? td("retakeExam")
                      : td("startExam")}
                </ButtonPrimary>

                {attemptList.length > 0 && (
                  <p className="text-xs text-neutral-400 text-center mt-3">
                    {td("attemptCount", { count: attemptList.length })}
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
          onClick={() => handleTabChange("overview")}
          icon={<BookOpen className="w-4 h-4" />}
          label={td("tabOverview")}
        />
        <TabButton
          active={activeTab === "history"}
          onClick={() => handleTabChange("history")}
          icon={<RotateCcw className="w-4 h-4" />}
          label={td("tabHistory")}
          count={attemptList.length > 0 ? attemptList.length : undefined}
        />
        <TabButton
          active={activeTab === "leaderboard"}
          onClick={() => handleTabChange("leaderboard")}
          icon={<Trophy className="w-4 h-4" />}
          label={td("tabLeaderboard")}
        />
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections (Categories from API) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              {td("examContent")}
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
                          {category.question_count} {td("questionsUnit")}
                        </p>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  {td("noCategories")}
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
                {td("generalStats")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {td("questionCount")}
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {examData.question_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {td("totalScoreLabel")}
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {examData.total_score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {td("durationLabel")}
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {td("durationValue", { value: examData.duration_min })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {td("autoScore")}
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {examData.auto_distribute_score ? td("yes") : td("no")}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {td("tips")}
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{td("tip1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{td("tip2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{td("tip3")}</span>
                </li>
              </ul>
            </div>

            {/* Info */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-neutral-400" />
                {td("info")}
              </h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>
                    {td("updatedAt")}{" "}
                    {new Date(examData.updated_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {examData.topic && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-neutral-400" />
                    <span>
                      {td("topic")} {examData.topic.name}
                    </span>
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
            {td("historyTitle")}
          </h2>
          {isHistoryLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              <p className="text-sm text-neutral-400">{td("loadingHistory")}</p>
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
                  : td("notCompleted");

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
                          {td("attemptNumber", {
                            number: attemptList.length - index,
                          })}
                        </span>
                        {index === 0 && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {td("latest")}
                          </span>
                        )}
                        {attempt.score === bestScore && (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            {td("highestScore")}
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
                        <p className="text-neutral-400">{td("correct")}</p>
                        <p className="font-semibold text-neutral-800">
                          {attempt.correct_count}/{attempt.total_questions}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-neutral-400">{td("time")}</p>
                        <p className="font-semibold text-neutral-800">
                          {durationText}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-neutral-400">{td("score")}</p>
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
                {td("noHistory")}
              </h3>
              <p className="text-neutral-500">{td("noHistoryDesc")}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            {td("leaderboardTitle")}
          </h2>
          {isLeaderboardLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              <p className="text-sm text-neutral-400">
                {td("loadingLeaderboard")}
              </p>
            </div>
          ) : leaderboardList.length > 0 ? (
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
              {/* Top 3 Podium */}
              <div className="p-6 bg-linear-to-br from-amber-50 to-orange-50">
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold text-neutral-600 overflow-hidden ring-2 ring-white shadow-md">
                        {top3[1].avatar ? (
                          <img
                            src={top3[1].avatar}
                            alt={top3[1].fullname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          top3[1].fullname.charAt(0)
                        )}
                      </div>
                      <div className="w-8 h-8 bg-neutral-300 rounded-full flex items-center justify-center mx-auto -mt-4 mb-2 text-sm font-bold text-white relative z-10 border-2 border-white shadow-sm">
                        2
                      </div>
                      <p className="font-medium text-neutral-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                        {top3[1].fullname}
                      </p>
                      <p className="text-lg font-bold text-neutral-600">
                        {top3[1].best_score}/{top3[1].max_score}
                      </p>
                    </div>
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <div className="text-center -mt-4">
                      <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold text-white ring-4 ring-amber-200 overflow-hidden shadow-lg">
                        {top3[0].avatar ? (
                          <img
                            src={top3[0].avatar}
                            alt={top3[0].fullname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          top3[0].fullname.charAt(0)
                        )}
                      </div>
                      <div className="w-8 h-8 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto -mt-4 mb-2 text-sm font-bold text-white relative z-10 border-2 border-white shadow-md">
                        <Medal className="w-4 h-4" />
                      </div>
                      <p className="font-semibold text-neutral-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                        {top3[0].fullname}
                      </p>
                      <p className="text-2xl font-bold text-amber-600">
                        {top3[0].best_score}/{top3[0].max_score}
                      </p>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold text-amber-700 overflow-hidden ring-2 ring-white shadow-md">
                        {top3[2].avatar ? (
                          <img
                            src={top3[2].avatar}
                            alt={top3[2].fullname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          top3[2].fullname.charAt(0)
                        )}
                      </div>
                      <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mx-auto -mt-4 mb-2 text-sm font-bold text-amber-700 relative z-10 border-2 border-white shadow-sm">
                        3
                      </div>
                      <p className="font-medium text-neutral-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                        {top3[2].fullname}
                      </p>
                      <p className="text-lg font-bold text-amber-600">
                        {top3[2].best_score}/{top3[2].max_score}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rest of leaderboard */}
              <div className="divide-y divide-neutral-100">
                {restOfLeaderboard.map((entry: LeaderboardEntry) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors`}
                  >
                    <span className="w-8 text-center font-semibold text-neutral-400">
                      #{entry.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-neutral-200 text-neutral-600 overflow-hidden ring-1 ring-neutral-100">
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        entry.fullname.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-800">
                        {entry.fullname}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(entry.completed_at).toLocaleDateString(
                          "vi-VN",
                        )}{" "}
                        • {td("attemptsCount", { count: entry.attempt_count })}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-neutral-800">
                      {entry.best_score}/{entry.max_score}
                    </p>
                  </div>
                ))}
              </div>

              {/* Current user entry if not in list */}
              {userEntry &&
                !leaderboardList.some(
                  (e: LeaderboardEntry) => e.user_id === userEntry.user_id,
                ) && (
                  <div className="bg-blue-50 border-t border-blue-100 p-4 flex items-center gap-4">
                    <span className="w-8 text-center font-bold text-blue-600">
                      #{userEntry.rank}
                    </span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-blue-500 text-white overflow-hidden ring-1 ring-blue-400 shadow-sm">
                      {userEntry.avatar ? (
                        <img
                          src={userEntry.avatar}
                          alt={userEntry.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userEntry.fullname.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-blue-700">
                        {userEntry.fullname} ({td("you")})
                      </p>
                      <p className="text-xs text-blue-500">
                        {td("bestResult")} •{" "}
                        {td("attemptsCount", {
                          count: userEntry.attempt_count,
                        })}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      {userEntry.best_score}/{userEntry.max_score}
                    </p>
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-neutral-100">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {td("noLeaderboard")}
              </h3>
              <p className="text-neutral-500">{td("noLeaderboardDesc")}</p>
            </div>
          )}
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
