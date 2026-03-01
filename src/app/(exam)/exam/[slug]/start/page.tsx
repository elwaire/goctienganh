// app/(main)/exam/[slug]/start/page.tsx

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { examsApi, type ExamSubmitResult } from "@/api/examsApi";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  RotateCcw,
  Home,
  Trophy,
  Target,
  Zap,
  BookOpen,
  Loader2,
  Volume2,
  ImageIcon,
} from "lucide-react";
import type {
  ExamAttempt,
  ExamAttemptQuestion,
  ExamAttemptQuestionData,
  ExamAttemptGroup,
  ExamAttemptOption,
} from "@/types/exam";

// ─── Derived types for flattened questions ───

type FlatQuestion = {
  /** Unique ID used for tracking answers */
  id: string;
  /** The question stem text */
  stem: string;
  /** Options for this question */
  options: ExamAttemptOption[];
  /** Explanation (shown after submit) */
  explanation: string;
  /** Question type */
  type: string;
  /** Audio URL if any */
  audio_url: string;
  /** Image URL if any */
  image_url: string;
  /** Score for this question */
  score: number;
  /** Group info (for grouped questions) */
  group: ExamAttemptGroup | null;
  /** Whether this is the first question in a group (to show group header) */
  isFirstInGroup: boolean;
  /** Original question index label (1-based) */
  orderLabel: number;
};

type QuestionStatus =
  | "unanswered"
  | "answered"
  | "flagged"
  | "flagged-answered";

/**
 * Flatten attempt questions into a linear list of FlatQuestion.
 * - If a question has sub-questions (grouped), each sub-question becomes a FlatQuestion.
 * - If a question has a direct question (single), it becomes a single FlatQuestion.
 */
function flattenQuestions(
  attemptQuestions: ExamAttemptQuestion[],
): FlatQuestion[] {
  const flat: FlatQuestion[] = [];
  let orderCounter = 1;

  for (const aq of attemptQuestions) {
    if (aq.questions && aq.questions.length > 0) {
      // Grouped question — flatten sub-questions
      aq.questions.forEach((sub, idx) => {
        flat.push({
          id: sub.id,
          stem: sub.question.stem,
          options: sub.question.options,
          explanation: sub.question.explanation,
          type: sub.question.type,
          audio_url: sub.question.audio_url,
          image_url: sub.question.image_url,
          score: sub.score,
          group: aq.group,
          isFirstInGroup: idx === 0,
          orderLabel: orderCounter++,
        });
      });
    } else if (aq.question) {
      // Single question
      flat.push({
        id: aq.id,
        stem: aq.question.stem,
        options: aq.question.options,
        explanation: aq.question.explanation,
        type: aq.question.type,
        audio_url: aq.question.audio_url,
        image_url: aq.question.image_url,
        score: aq.score,
        group: aq.group,
        isFirstInGroup: aq.group !== null,
        orderLabel: orderCounter++,
      });
    }
  }

  return flat;
}

/** Map option index to letter label */
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function StartExamPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  // ─── Load attempt data from sessionStorage ───
  const [attemptData, setAttemptData] = useState<ExamAttempt | null>(null);
  const [isLoadingAttempt, setIsLoadingAttempt] = useState(true);

  useEffect(() => {
    if (!slug) return;
    try {
      const stored = sessionStorage.getItem(`exam_attempt_${slug}`);
      if (stored) {
        const parsed: ExamAttempt = JSON.parse(stored);
        setAttemptData(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setIsLoadingAttempt(false);
  }, [slug]);

  // ─── Flatten questions ───
  const questions = useMemo(() => {
    if (!attemptData) return [];
    return flattenQuestions(attemptData.questions);
  }, [attemptData]);

  // ─── State ───
  const [currentIndex, setCurrentIndex] = useState(0);
  // answers: questionId -> selected option id
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerReady, setIsTimerReady] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ExamSubmitResult | null>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);

  // Initialize timer from attempt data, accounting for elapsed time
  useEffect(() => {
    if (attemptData && !isTimerReady) {
      const totalSeconds = attemptData.duration_min * 60;
      if (attemptData.started_at) {
        const startedMs = new Date(attemptData.started_at).getTime();
        const nowMs = Date.now();
        const elapsedSec = Math.floor((nowMs - startedMs) / 1000);
        setTimeLeft(Math.max(0, totalSeconds - elapsedSec));
      } else {
        setTimeLeft(totalSeconds);
      }
      setIsTimerReady(true);
    }
  }, [attemptData, isTimerReady]);

  // ─── Fullscreen ───
  const examContainerRef = useRef<HTMLDivElement>(null);
  const isExitingIntentionally = useRef(false);

  // Enter fullscreen when exam starts
  useEffect(() => {
    if (!attemptData || isSubmitted || isLoadingAttempt) return;

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // Fullscreen not supported or blocked by browser
      }
    };

    enterFullscreen();
  }, [attemptData, isSubmitted, isLoadingAttempt]);

  // Detect fullscreen exit → show confirm modal
  useEffect(() => {
    if (!attemptData || isSubmitted) return;

    const handleFullscreenChange = () => {
      if (
        !document.fullscreenElement &&
        !isExitingIntentionally.current &&
        !isSubmitted
      ) {
        setShowExitModal(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [attemptData, isSubmitted]);

  // Warn before closing tab/navigating away
  useEffect(() => {
    if (!attemptData || isSubmitted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [attemptData, isSubmitted]);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalQuestions = questions.length;

  // ─── Timer ───
  useEffect(() => {
    if (!isTimerReady || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerReady, isSubmitted, timeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get question status
  const getQuestionStatus = (questionId: string): QuestionStatus => {
    const isAnswered =
      answers[questionId] !== undefined && answers[questionId] !== null;
    const isFlagged = flaggedQuestions.has(questionId);

    if (isFlagged && isAnswered) return "flagged-answered";
    if (isFlagged) return "flagged";
    if (isAnswered) return "answered";
    return "unanswered";
  };

  // ─── Submit answer mutation ───
  const submitAnswerMutation = useMutation({
    mutationFn: (params: { questionId: string; optionId: string }) =>
      examsApi.submitAnswer(attemptData!.attempt_id, {
        question_id: params.questionId,
        selected_options: [params.optionId],
      }),
    onError: (error) => {
      // Silently log - don't interrupt the exam experience
      console.error("Failed to submit answer:", error);
    },
  });

  // ─── Handlers ───
  const handleSelectAnswer = useCallback(
    (optionId: string) => {
      if (isSubmitted || !currentQuestion || !attemptData) return;
      // Update local state immediately for responsive UI
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
      // Call API in the background
      submitAnswerMutation.mutate({
        questionId: currentQuestion.id,
        optionId,
      });
    },
    [isSubmitted, currentQuestion, attemptData],
  );

  const handleSelectByIndex = useCallback(
    (index: number) => {
      if (!currentQuestion) return;
      const sortedOptions = [...currentQuestion.options].sort(
        (a, b) => a.order - b.order,
      );
      if (index < sortedOptions.length) {
        handleSelectAnswer(sortedOptions[index].id);
      }
    },
    [currentQuestion, handleSelectAnswer],
  );

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowQuestionNav(false);
  };

  // ─── Submit exam mutation ───
  const submitExamMutation = useMutation({
    mutationFn: (attemptId: string) => examsApi.submitExam(attemptId),
    onSuccess: (data) => {
      setSubmitResult(data);
      setIsSubmitted(true);
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setShowExitModal(false);
      // Exit fullscreen when showing results
      isExitingIntentionally.current = true;
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    },
    onError: () => {
      setIsSubmitting(false);
      alert("Không thể nộp bài. Vui lòng thử lại.");
    },
  });

  const handleSubmit = () => {
    if (!attemptData || isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);
    submitExamMutation.mutate(attemptData.attempt_id);
  };

  const handleExit = () => {
    isExitingIntentionally.current = true;
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    // Clean up sessionStorage
    if (slug) {
      sessionStorage.removeItem(`exam_attempt_${slug}`);
    }
    router.push("/exam");
  };

  const handleReEnterFullscreen = () => {
    setShowExitModal(false);
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      }
    } catch {
      // ignore
    }
  };

  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || showConfirmModal || showExitModal) return;

      switch (e.key) {
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "1":
        case "a":
        case "A":
          handleSelectByIndex(0);
          break;
        case "2":
        case "b":
        case "B":
          handleSelectByIndex(1);
          break;
        case "3":
        case "c":
        case "C":
          handleSelectByIndex(2);
          break;
        case "4":
        case "d":
        case "D":
          handleSelectByIndex(3);
          break;
        case "f":
        case "F":
          handleToggleFlag();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isSubmitted, showConfirmModal, showExitModal, questions]);

  // ─── Loading State ───
  if (isLoadingAttempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-sm text-neutral-400">Đang tải bài thi...</p>
      </div>
    );
  }

  // ─── Submitting State ───
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-500">Đang nộp bài...</p>
      </div>
    );
  }

  // ─── No Data State ───
  if (!attemptData || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          Không tìm thấy dữ liệu bài thi. Vui lòng quay lại và thử lại.
        </p>
        <button
          onClick={() => router.push("/exam")}
          className="text-sm text-primary-500 hover:underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // ─── Result Screen ───
  if (isSubmitted && submitResult) {
    return (
      <ResultScreen
        submitResult={submitResult}
        questions={questions}
        answers={answers}
        examTitle={attemptData.title}
        slug={slug}
        attemptId={attemptData.attempt_id}
        onRetry={() => {
          setIsSubmitted(false);
          setSubmitResult(null);
          setAnswers({});
          setFlaggedQuestions(new Set());
          setCurrentIndex(0);
          const totalSec = attemptData.duration_min * 60;
          if (attemptData.started_at) {
            const elapsed = Math.floor(
              (Date.now() - new Date(attemptData.started_at).getTime()) / 1000,
            );
            setTimeLeft(Math.max(0, totalSec - elapsed));
          } else {
            setTimeLeft(totalSec);
          }
        }}
        onExit={handleExit}
      />
    );
  }

  if (!currentQuestion) return null;

  const sortedOptions = [...currentQuestion.options].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Exit & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExitModal(true)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
              <div>
                <h1 className="font-semibold text-neutral-800">
                  {attemptData.title}
                </h1>
                <p className="text-sm text-neutral-500">
                  Câu {currentIndex + 1}/{totalQuestions}
                </p>
              </div>
            </div>

            {/* Center: Progress */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-neutral-600 whitespace-nowrap">
                {answeredCount}/{totalQuestions}
              </span>
            </div>

            {/* Right: Timer & Submit */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-semibold
                  ${timeLeft <= 60 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-neutral-100 text-neutral-700"}
                `}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Nộp bài</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Group Header (if this is a grouped question) */}
        {currentQuestion.group && currentQuestion.isFirstInGroup && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-4">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <h3 className="font-semibold text-blue-800">
                {currentQuestion.group.title}
              </h3>
            </div>
            {currentQuestion.group.text && (
              <div className="px-6 py-4">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {currentQuestion.group.text}
                </p>
              </div>
            )}
            {currentQuestion.group.audio_url && (
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe audio</span>
                </div>
                <audio
                  controls
                  className="w-full"
                  src={currentQuestion.group.audio_url}
                />
              </div>
            )}
            {currentQuestion.group.image_url && (
              <div className="px-6 pb-4">
                <img
                  src={currentQuestion.group.image_url}
                  alt="Group image"
                  className="max-w-full rounded-lg border border-neutral-200"
                />
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-xl">
                {currentQuestion.orderLabel}
              </span>
              <div>
                <p className="text-sm text-neutral-500">Câu hỏi</p>
                <p className="text-xs text-neutral-400">
                  {currentQuestion.type === "single_choice"
                    ? "Chọn một đáp án đúng"
                    : currentQuestion.type === "multiple_choice"
                      ? "Chọn nhiều đáp án đúng"
                      : "Chọn đáp án"}
                  {currentQuestion.score > 0 && (
                    <span className="ml-2 text-blue-500">
                      ({currentQuestion.score} điểm)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleFlag}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                ${
                  flaggedQuestions.has(currentQuestion.id)
                    ? "bg-amber-100 text-amber-600"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }
              `}
            >
              <Flag className="w-4 h-4" />
              <span className="text-sm font-medium">
                {flaggedQuestions.has(currentQuestion.id)
                  ? "Đã đánh dấu"
                  : "Đánh dấu"}
              </span>
            </button>
          </div>

          {/* Question Content */}
          <div className="p-6">
            {/* Question Audio */}
            {currentQuestion.audio_url && (
              <div className="mb-4">
                <audio
                  controls
                  className="w-full"
                  src={currentQuestion.audio_url}
                />
              </div>
            )}

            {/* Question Image */}
            {currentQuestion.image_url && (
              <div className="mb-4">
                <img
                  src={currentQuestion.image_url}
                  alt="Question image"
                  className="max-w-full rounded-lg border border-neutral-200"
                />
              </div>
            )}

            <h2 className="text-lg font-medium text-neutral-800 leading-relaxed mb-6">
              {currentQuestion.stem}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {sortedOptions.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                const label = OPTION_LABELS[idx] ?? `${idx + 1}`;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-lg font-semibold shrink-0
                        ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-100 text-neutral-600"
                        }
                      `}
                    >
                      {label}
                    </span>
                    <span
                      className={`flex-1 ${isSelected ? "text-blue-700 font-medium" : "text-neutral-700"}`}
                    >
                      {option.content}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Câu trước</span>
            </button>

            <button
              onClick={() => setShowQuestionNav(!showQuestionNav)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors"
            >
              <span className="text-sm font-medium text-neutral-600">
                {currentIndex + 1} / {totalQuestions}
              </span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalQuestions - 1}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              <span className="hidden sm:inline">Câu sau</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Navigator Panel */}
        {showQuestionNav && (
          <div className="mt-4 bg-white rounded-2xl border border-neutral-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-800">
                Danh sách câu hỏi
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded" /> Đã trả lời
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-400 rounded" /> Đánh dấu
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-neutral-200 rounded" /> Chưa làm
                </span>
              </div>
            </div>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => {
                const status = getQuestionStatus(q.id);
                const isCurrent = index === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleGoToQuestion(index)}
                    className={`
                      relative w-10 h-10 rounded-lg font-medium text-sm transition-all
                      ${isCurrent ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                      ${
                        status === "answered" || status === "flagged-answered"
                          ? "bg-blue-500 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }
                    `}
                  >
                    {q.orderLabel}
                    {(status === "flagged" ||
                      status === "flagged-answered") && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Keyboard Hints */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-neutral-200 rounded">←</kbd>
            <kbd className="px-2 py-1 bg-neutral-200 rounded">→</kbd>
            Di chuyển
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-neutral-200 rounded">A</kbd>
            <kbd className="px-2 py-1 bg-neutral-200 rounded">B</kbd>
            <kbd className="px-2 py-1 bg-neutral-200 rounded">C</kbd>
            <kbd className="px-2 py-1 bg-neutral-200 rounded">D</kbd>
            Chọn đáp án
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-neutral-200 rounded">F</kbd>
            Đánh dấu
          </span>
        </div>
      </main>

      {/* Confirm Submit Modal */}
      {showConfirmModal && (
        <Modal onClose={() => setShowConfirmModal(false)}>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Nộp bài?
            </h3>
            <p className="text-neutral-500 mb-6">
              Bạn đã trả lời{" "}
              <span className="font-semibold text-blue-600">
                {answeredCount}/{totalQuestions}
              </span>{" "}
              câu hỏi.
              {totalQuestions - answeredCount > 0 && (
                <span className="block mt-1 text-amber-600">
                  Còn {totalQuestions - answeredCount} câu chưa trả lời!
                </span>
              )}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-xl transition-colors"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-xl transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Exit Confirm Modal */}
      {showExitModal && (
        <Modal onClose={handleReEnterFullscreen}>
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Bạn đã thoát chế độ toàn màn hình
            </h3>
            <p className="text-neutral-500 mb-6">
              Bạn muốn tiếp tục làm bài hay nộp bài ngay?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReEnterFullscreen}
                className="flex-1 py-3 px-4 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-xl transition-colors"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-xl transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Modal Component ───
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Result Screen Component ───
function ResultScreen({
  submitResult,
  questions,
  answers,
  examTitle,
  slug,
  attemptId,
  onRetry,
  onExit,
}: {
  submitResult: ExamSubmitResult;
  questions: FlatQuestion[];
  answers: Record<string, string | null>;
  examTitle: string;
  slug: string;
  attemptId: string;
  onRetry: () => void;
  onExit: () => void;
}) {
  const router = useRouter();
  const isPassed =
    submitResult.max_score > 0
      ? (submitResult.score / submitResult.max_score) * 100 >= 70
      : false;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div
            className={`p-8 text-center ${
              isPassed
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                : "bg-gradient-to-br from-rose-500 to-rose-600"
            }`}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/20">
              {isPassed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <Target className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isPassed ? "Chúc mừng! 🎉" : "Cố gắng lên! 💪"}
            </h2>
            <p className="text-white/80">
              {isPassed
                ? "Bạn đã hoàn thành xuất sắc bài thi"
                : "Bạn cần ôn tập thêm để đạt điểm đậu"}
            </p>
          </div>

          {/* Score */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-6xl font-bold text-neutral-800 mb-2">
                {submitResult.score}
              </p>
              <p className="text-neutral-500">
                điểm / {submitResult.max_score}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-600">
                  {submitResult.correct_count}
                </p>
                <p className="text-sm text-emerald-600">Đúng</p>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-xl">
                <X className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-rose-600">
                  {submitResult.total_questions - submitResult.correct_count}
                </p>
                <p className="text-sm text-rose-600">Sai</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {submitResult.total_questions}
                </p>
                <p className="text-sm text-blue-600">Tổng câu</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onExit}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
                Trang chủ
              </button>
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-xl transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Làm lại
              </button>
            </div>
          </div>
        </div>

        {/* View Detailed Answers */}
        <button
          onClick={() =>
            router.push(`/exam/${slug}/result?attempt_id=${attemptId}`)
          }
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium rounded-xl transition-colors mb-4"
        >
          <BookOpen className="w-5 h-5" />
          Xem đáp án chi tiết
        </button>
      </div>
    </div>
  );
}
