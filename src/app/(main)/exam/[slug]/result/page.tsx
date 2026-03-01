// app/(main)/exam/[slug]/result/page.tsx

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { examsApi } from "@/api/examsApi";
import type { AttemptResultAnswer } from "@/api/examsApi";
import { queryKeys } from "@/lib/queryKeys";
import type {
  ExamAttemptGroup,
  ExamAttemptOption,
} from "@/types/exam";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  X,
  Trophy,
  Target,
  BookOpen,
  Loader2,
  AlertCircle,
  Home,
  FileText,
} from "lucide-react";
import { useState, useMemo } from "react";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

type FlatQuestion = {
  id: string;
  questionId: string;
  stem: string;
  options: ExamAttemptOption[];
  explanation: string;
  type: string;
  audio_url: string;
  image_url: string;
  score: number;
  group: ExamAttemptGroup | null;
  isFirstInGroup: boolean;
  orderLabel: number;
};

export default function ExamResultPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const attemptId = searchParams.get("attempt_id") ?? "";

  const [filterMode, setFilterMode] = useState<"all" | "correct" | "wrong">(
    "all",
  );

  // Fetch attempt result from API
  const {
    data: resultData,
    isLoading: isResultLoading,
    isError: isResultError,
  } = useQuery({
    queryKey: queryKeys.attempts.result(attemptId),
    queryFn: () => examsApi.getAttemptResult(attemptId),
    enabled: !!attemptId,
  });

  // Flatten questions from API result
  const questions = useMemo(() => {
    if (!resultData) return [];

    const flat: FlatQuestion[] = [];
    let orderCounter = 1;
    let lastGroupId: string | null = null;

    // Sort answers by question order if available
    const sortedAnswers = [...resultData.answers].sort(
      (a, b) => (a.question.order || 0) - (b.question.order || 0),
    );

    for (const ans of sortedAnswers) {
      const q = ans.question;
      const groupId = q.group?.id || null;

      flat.push({
        id: q.id,
        questionId: q.id,
        stem: q.stem,
        options: q.options,
        explanation: q.explanation,
        type: q.type,
        audio_url: q.audio_url,
        image_url: q.image_url,
        score: ans.score,
        group: q.group
          ? ({
              ...q.group,
              text: (q.group as any).text || "",
              audio_url: (q.group as any).audio_url || "",
              image_url: (q.group as any).image_url || "",
              status: "published",
              subject: q.subject,
              topic: q.topic as any,
            } as ExamAttemptGroup)
          : null,
        isFirstInGroup: groupId !== null && groupId !== lastGroupId,
        orderLabel: orderCounter++,
      });

      lastGroupId = groupId;
    }

    return flat;
  }, [resultData]);

  // Build answer map: questionId -> AttemptResultAnswer
  const answerMap = useMemo(() => {
    if (!resultData) return new Map<string, AttemptResultAnswer>();
    const map = new Map<string, AttemptResultAnswer>();
    resultData.answers.forEach((a) => map.set(a.question_id, a));
    return map;
  }, [resultData]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    if (filterMode === "all") return questions;
    return questions.filter((q) => {
      const answer = answerMap.get(q.questionId) ?? answerMap.get(q.id);
      if (filterMode === "correct") return answer?.is_correct === true;
      return !answer?.is_correct;
    });
  }, [questions, answerMap, filterMode]);

  const isPassed =
    resultData && resultData.max_score > 0
      ? (resultData.score / resultData.max_score) * 100 >= 70
      : false;

  // ─── Loading ───
  if (isResultLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-sm text-neutral-400">Đang tải kết quả...</p>
      </div>
    );
  }

  // ─── Error ───
  if (isResultError || !resultData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          Không thể tải kết quả bài thi. Vui lòng thử lại.
        </p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary-500 hover:underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Back */}
      <button
        onClick={() => router.push(`/exam/${slug}`)}
        className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại</span>
      </button>

      {/* Score Summary Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden mb-6">
        <div
          className={`p-6 text-center ${
            isPassed
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
              : "bg-gradient-to-r from-rose-500 to-rose-600"
          }`}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            {isPassed ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <Target className="w-8 h-8 text-white" />
            )}
            <h1 className="text-2xl font-bold text-white">
              {isPassed ? "Hoàn thành xuất sắc!" : "Kết quả bài thi"}
            </h1>
          </div>
          <p className="text-white/80 text-sm">
            {resultData.completed_at &&
              `Hoàn thành lúc ${new Date(resultData.completed_at).toLocaleString("vi-VN")}`}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">
                {resultData.score}
                <span className="text-lg text-blue-400">
                  /{resultData.max_score}
                </span>
              </p>
              <p className="text-sm text-blue-600 mt-1">Điểm</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald-600">
                {resultData.correct_count}
              </p>
              <p className="text-sm text-emerald-600">Đúng</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-xl">
              <XCircle className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-rose-600">
                {resultData.total_questions - resultData.correct_count}
              </p>
              <p className="text-sm text-rose-600">Sai</p>
            </div>
            <div className="text-center p-4 bg-neutral-50 rounded-xl">
              <FileText className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-neutral-600">
                {resultData.total_questions}
              </p>
              <p className="text-sm text-neutral-500">Tổng câu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <FilterButton
          active={filterMode === "all"}
          onClick={() => setFilterMode("all")}
          label={`Tất cả (${questions.length})`}
        />
        <FilterButton
          active={filterMode === "correct"}
          onClick={() => setFilterMode("correct")}
          label={`Đúng (${resultData.correct_count})`}
          color="emerald"
        />
        <FilterButton
          active={filterMode === "wrong"}
          onClick={() => setFilterMode("wrong")}
          label={`Sai (${resultData.total_questions - resultData.correct_count})`}
          color="rose"
        />
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="text-neutral-500">
            Không tìm thấy dữ liệu câu hỏi. Vui lòng quay lại trang bài thi và
            thử lại.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const answer = answerMap.get(q.questionId) ?? answerMap.get(q.id);
            const isCorrect = answer?.is_correct ?? false;
            const selectedOptionIds = answer?.selected_options ?? [];
            const sortedOptions = [...q.options].sort(
              (a, b) => a.order - b.order,
            );

            return (
              <div key={q.id}>
                {/* Group header */}
                {q.group && q.isFirstInGroup && (
                  <div className="bg-blue-50 rounded-t-2xl border border-blue-100 border-b-0 px-6 py-3">
                    <h3 className="font-semibold text-blue-800 text-sm">
                      {q.group.title}
                    </h3>
                    {q.group.text && (
                      <p className="text-sm text-blue-700 mt-1 whitespace-pre-line">
                        {q.group.text}
                      </p>
                    )}
                    {q.group.audio_url && (
                      <audio
                        controls
                        className="w-full mt-2"
                        src={q.group.audio_url}
                      />
                    )}
                    {q.group.image_url && (
                      <img
                        src={q.group.image_url}
                        alt="Group image"
                        className="max-w-full rounded-lg mt-2"
                      />
                    )}
                  </div>
                )}

                <div
                  className={`bg-white rounded-2xl border-2 p-5 ${
                    q.group && q.isFirstInGroup ? "rounded-t-none" : ""
                  } ${isCorrect ? "border-emerald-200" : "border-rose-200"}`}
                >
                  {/* Question stem */}
                  <div className="flex items-start gap-3 mb-4">
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-lg font-bold text-sm shrink-0 ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {q.orderLabel}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-800 leading-relaxed">
                        {q.stem}
                      </p>
                      {answer && (
                        <div className="flex items-center gap-2 mt-1">
                          {isCorrect ? (
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              ✓ Đúng
                              {answer.score > 0 && ` (+${answer.score} điểm)`}
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                              ✗ Sai
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question audio */}
                  {q.audio_url && (
                    <div className="mb-3 pl-12">
                      <audio controls className="w-full" src={q.audio_url} />
                    </div>
                  )}

                  {/* Question image */}
                  {q.image_url && (
                    <div className="mb-3 pl-12">
                      <img
                        src={q.image_url}
                        alt="Question image"
                        className="max-w-full rounded-lg border border-neutral-200"
                      />
                    </div>
                  )}

                  {/* Options */}
                  <div className="pl-12 space-y-2">
                    {sortedOptions.map((opt, idx) => {
                      const isUserSelected = selectedOptionIds.includes(opt.id);
                      const isCorrectOption = opt.is_correct;
                      const label = OPTION_LABELS[idx] ?? `${idx + 1}`;

                      let optionClass = "text-neutral-600 bg-white";
                      if (isCorrectOption) {
                        optionClass =
                          "bg-emerald-50 text-emerald-700 border-emerald-200";
                      } else if (isUserSelected && !isCorrect) {
                        optionClass =
                          "bg-rose-50 text-rose-700 border-rose-200 line-through";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${optionClass}`}
                        >
                          <span
                            className={`flex items-center justify-center w-8 h-8 rounded-lg font-semibold shrink-0 ${
                              isCorrectOption
                                ? "bg-emerald-500 text-white"
                                : isUserSelected && !isCorrect
                                  ? "bg-rose-500 text-white"
                                  : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {label}
                          </span>
                          <span className="flex-1">{opt.content}</span>
                          {isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          {isUserSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          {isUserSelected && isCorrectOption && (
                            <span className="text-xs text-emerald-500 shrink-0">
                              Bạn chọn ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="mt-4 ml-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">💡 Giải thích:</span>{" "}
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Action */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => router.push(`/exam/${slug}`)}
          className="flex items-center gap-2 py-3 px-6 text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 font-medium rounded-xl transition-colors"
        >
          <Home className="w-5 h-5" />
          Về trang bài thi
        </button>
        <button
          onClick={() => router.push("/exam")}
          className="flex items-center gap-2 py-3 px-6 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-xl transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Danh sách bài thi
        </button>
      </div>
    </div>
  );
}

// ─── Filter Button ───
function FilterButton({
  active,
  onClick,
  label,
  color = "blue",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: "blue" | "emerald" | "rose";
}) {
  const colorMap = {
    blue: active
      ? "bg-blue-500 text-white"
      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50",
    emerald: active
      ? "bg-emerald-500 text-white"
      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50",
    rose: active
      ? "bg-rose-500 text-white"
      : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${colorMap[color]}`}
    >
      {label}
    </button>
  );
}
