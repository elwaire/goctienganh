import { X, Volume2, Check, XCircle } from "lucide-react";
import React, { useEffect } from "react";
import type { WritingQuestion } from "../_types";
import { MODE_LABELS } from "../_types";

interface WritingPlayingScreenProps {
  currentIndex: number;
  totalCount: number;
  progress: number;
  correctCount: number;
  wrongCount: number;
  question: WritingQuestion;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAnswerChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onSpeak: (text: string, lang?: "en" | "vi") => void;
  onExit: () => void;
}

export function WritingPlayingScreen({
  currentIndex,
  totalCount,
  progress,
  correctCount,
  wrongCount,
  question,
  userAnswer,
  showFeedback,
  isCorrect,
  inputRef,
  onAnswerChange,
  onSubmit,
  onSpeak,
  onExit,
}: WritingPlayingScreenProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showFeedback) {
        e.preventDefault();
        onSubmit();
      }
    };
    if (showFeedback) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFeedback, onSubmit]);

  const renderTimeRef = React.useRef(Date.now());
  useEffect(() => {
    // Reset timer when moving to a new question
    renderTimeRef.current = Date.now();
  }, [currentIndex]);

  useEffect(() => {
    if (showFeedback) {
      // Prevent sound if user spams answer (completes in < 500ms)
      if (Date.now() - renderTimeRef.current < 500) {
        return;
      }
      const audio = new Audio(isCorrect ? "/sounds/correct.mp3" : "/sounds/error.mp3");
      audio.play().catch(console.error);
    }
  }, [showFeedback, isCorrect]);

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Thoát</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Câu {currentIndex + 1}/{totalCount}
            </p>
          </div>

          <div className="w-20" />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mt-1 font-medium">Tổng</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600">
              {correctCount}
            </div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mt-1 font-medium">Đúng</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-orange-600">{wrongCount}</div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mt-1 font-medium">Sai</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          {/* Question Type Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-semibold uppercase tracking-wider rounded-lg">
              {MODE_LABELS[question.mode]}
            </span>
            {question.mode === "vi_to_en" && (
              <button
                type="button"
                onClick={() => onSpeak(question.card.definition, "vi")}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Nghe câu hỏi (tiếng Việt)"
              >
                <Volume2 className="w-5 h-5 text-blue-600" />
              </button>
            )}
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold text-gray-900 mb-5 leading-tight">
            {question.prompt}
          </h3>

          {/* Input Form */}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!showFeedback) onSubmit();
          }}>
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              readOnly={showFeedback}
              placeholder="Nhập câu trả lời..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 read-only:bg-gray-100 read-only:cursor-not-allowed font-medium text-gray-900 transition-all"
              autoComplete="off"
              autoFocus
            />

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`mt-4 p-4 rounded-xl ${
                  isCorrect
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <Check className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-semibold mb-1 ${isCorrect ? "text-blue-900" : "text-red-900"}`}
                    >
                      {isCorrect ? "Chính xác!" : "Chưa đúng"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-700">
                        Đáp án đúng:{" "}
                        <span className="font-semibold">
                          {question.correctAnswer}
                        </span>
                      </p>
                    )}
                    {question.card.example_sentence && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        &quot;{question.card.example_sentence}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit/Next Button */}
            <button
              type="submit"
              disabled={!userAnswer.trim() && !showFeedback}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {showFeedback ? (
                <>
                  Câu tiếp theo
                  <kbd className="px-2 py-0.5 bg-white/20 rounded text-xs font-mono">
                    Enter
                  </kbd>
                </>
              ) : (
                <>
                  Kiểm tra
                  <kbd className="px-2 py-0.5 bg-white/20 rounded text-xs font-mono">
                    Enter
                  </kbd>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Keyboard hints visible immediately */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
          <span>Nhấn</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">Enter</kbd>
          <span>để {showFeedback ? "tiếp tục" : "gửi câu trả lời & kiểm tra"}</span>
        </div>
      </div>
    </div>
  );
}
