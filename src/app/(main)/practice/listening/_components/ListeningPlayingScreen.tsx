import { X, Volume2, Check, XCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";
import type { ListeningQuestion } from "../_types";
import { QUESTION_TYPE_LABELS } from "../_types";

interface ListeningPlayingScreenProps {
  currentIndex: number;
  totalCount: number;
  progress: number;
  correctCount: number;
  wrongCount: number;
  question: ListeningQuestion;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean;
  isPlaying: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAnswerChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onPlayAudio: () => void;
  onExit: () => void;
}

export function ListeningPlayingScreen({
  currentIndex,
  totalCount,
  progress,
  correctCount,
  wrongCount,
  question,
  userAnswer,
  showFeedback,
  isCorrect,
  isPlaying,
  inputRef,
  onAnswerChange,
  onSubmit,
  onPlayAudio,
  onExit,
}: ListeningPlayingScreenProps) {
  const renderTimeRef = useRef(Date.now());

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showFeedback) {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFeedback, onSubmit]);

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
            <p className="text-sm text-gray-500">
              Câu {currentIndex + 1}/{totalCount}
            </p>
          </div>

          <div className="w-16" />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
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
            <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5 font-bold">Tổng</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600">{correctCount}</div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5 font-bold">Đúng</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-orange-600">{wrongCount}</div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5 font-bold">Sai</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          {/* Question Type Badge */}
          <div className="flex items-center mb-4">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-100">
              {QUESTION_TYPE_LABELS[question.type]}
            </span>
          </div>

          {/* Audio Player Button (Minimalized) */}
          <div className="mb-6 flex flex-col items-center">
            <button
              onClick={onPlayAudio}
              disabled={isPlaying}
              className={`group relative flex items-center justify-center w-24 h-24 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-full transition-all active:scale-95 ${
                isPlaying ? "ring-4 ring-blue-500/20" : ""
              }`}
            >
              <Volume2
                className={`w-10 h-10 text-blue-600 ${isPlaying ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`}
              />
            </button>
            <p className="mt-4 font-bold text-gray-900 text-lg">
              {isPlaying ? "Đang phát..." : "Nhấn để nghe"}
            </p>
            <p className="text-gray-500 text-sm mt-1">{question.prompt}</p>
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={showFeedback}
                placeholder="Nhập những gì bạn nghe được..."
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-gray-900 transition-all placeholder:text-gray-400"
                autoComplete="off"
                autoFocus
              />
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`p-4 rounded-xl border ${
                  isCorrect
                    ? "bg-blue-50 border-blue-200"
                    : "bg-red-50 border-red-200"
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
                      className={`font-bold mb-1 ${isCorrect ? "text-blue-900" : "text-red-900"}`}
                    >
                      {isCorrect ? "Rất tốt!" : "Chưa chính xác"}
                    </p>
                    {!isCorrect && (
                      <div className="text-sm">
                        <span className="text-gray-500">Đáp án đúng:</span>{" "}
                        <span className="font-bold text-gray-900">
                          {question.correctAnswer}
                        </span>
                      </div>
                    )}
                    {question.card.example_sentence && (
                      <p className="text-sm text-gray-600 mt-2 italic line-clamp-2">
                        &quot;{question.card.example_sentence}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={!userAnswer.trim() && !showFeedback}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-blue-200/50"
            >
              {showFeedback ? (
                <>
                  Câu tiếp theo
                  <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-mono border border-white/30">
                    Enter
                  </kbd>
                </>
              ) : (
                <>
                  Kiểm tra
                  <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] font-mono border border-white/30">
                    Enter
                  </kbd>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Shortcut Info */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded font-mono text-gray-500 shadow-sm">Enter</kbd>
            <span>{showFeedback ? "Tiếp tục" : "Kiểm tra"}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded font-mono text-gray-500 shadow-sm">S</kbd>
            <span>Nghe lại</span>
          </div>
        </div>
      </div>
    </div>
  );
}

