import { X, Volume2, Check, XCircle } from "lucide-react";
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
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-xs text-gray-600 mt-0.5">Tổng</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-600">
              {correctCount}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">Đúng</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-red-600">{wrongCount}</div>
            <div className="text-xs text-gray-600 mt-0.5">Sai</div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          {/* Question Type Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-lg">
              {QUESTION_TYPE_LABELS[question.type]}
            </span>
          </div>

          {/* Audio Player */}
          <div className="mb-6">
            <button
              onClick={onPlayAudio}
              disabled={isPlaying}
              className={`w-full flex items-center justify-center gap-3 px-6 py-8 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 rounded-2xl transition-all ${
                isPlaying ? "scale-95" : "hover:scale-[1.02]"
              } disabled:cursor-not-allowed`}
            >
              <Volume2
                className={`w-8 h-8 text-blue-600 ${isPlaying ? "animate-pulse" : ""}`}
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  {isPlaying ? "Đang phát..." : "Nhấn để nghe"}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {question.prompt}
                </p>
              </div>
            </button>
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Hoặc nhấn{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  S
                </kbd>{" "}
                để nghe lại
              </p>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={onSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu trả lời của bạn:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              disabled={showFeedback}
              placeholder="Nhập câu trả lời..."
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
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
                      <>
                        <p className="text-sm text-gray-700 mb-2">
                          Đáp án đúng:{" "}
                          <span className="font-semibold">
                            {question.correctAnswer}
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={onPlayAudio}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Volume2 className="w-4 h-4" />
                          Nghe lại
                        </button>
                      </>
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

        {/* Hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {showFeedback ? (
              <>
                Nhấn{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  Enter
                </kbd>{" "}
                để tiếp tục
              </>
            ) : (
              <>
                Nhấn{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  S
                </kbd>{" "}
                để nghe lại •{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  Enter
                </kbd>{" "}
                để gửi
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
