import {
  X,
  Keyboard,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  ArrowRightLeft,
  Settings2,
} from "lucide-react";
import type { FlashcardWord } from "../_types";
import { Flashcard } from "./Flashcard";
import { useState } from "react";

interface PlayingScreenProps {
  words: FlashcardWord[];
  currentIndex: number;
  currentWord: FlashcardWord;
  isFlipped: boolean;
  progress: number;
  masteredCount: number;
  difficultCount: number;
  pressedKey: string | null;
  showShortcuts: boolean;
  onFlip: () => void;
  onAnswer: (mastered: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSpeak: (text: string) => void;
  onExit: () => void;
  onToggleShortcuts: (show: boolean) => void;
}

export function PlayingScreen({
  words,
  currentIndex,
  currentWord,
  isFlipped,
  progress,
  masteredCount,
  difficultCount,
  pressedKey,
  showShortcuts,
  onFlip,
  onAnswer,
  onPrevious,
  onNext,
  onSpeak,
  onExit,
  onToggleShortcuts,
}: PlayingScreenProps) {
  const [direction, setDirection] = useState<"en-vi" | "vi-en">("en-vi");

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Header
          currentIndex={currentIndex}
          totalCount={words.length}
          direction={direction}
          onToggleDirection={() => setDirection(d => d === "en-vi" ? "vi-en" : "en-vi")}
          onExit={onExit}
        />

        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Stats */}
        <StatsRow
          totalCount={words.length}
          masteredCount={masteredCount}
          difficultCount={difficultCount}
        />

        {/* Flashcard */}
        <Flashcard
          word={currentWord}
          isFlipped={isFlipped}
          pressedKey={pressedKey}
          direction={direction}
          onFlip={onFlip}
          onSpeak={onSpeak}
        />

        {/* Actions */}
        <ActionBar
          currentIndex={currentIndex}
          totalCount={words.length}
          isFlipped={isFlipped}
          pressedKey={pressedKey}
          onPrevious={onPrevious}
          onNext={onNext}
          onAnswer={onAnswer}
        />

        {/* Keyboard hints visible immediately */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">Space</kbd> <span>Lật thẻ</span></div>
          <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">←</kbd> <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">→</kbd> <span>Chuyển thẻ</span></div>
          <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">1</kbd> <span>Cần ôn</span></div>
          <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">2</kbd> <span>Đã thuộc</span></div>
          <div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono font-medium">S</kbd> <span>Phát âm</span></div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function Header({
  currentIndex,
  totalCount,
  direction,
  onToggleDirection,
  onExit,
}: {
  currentIndex: number;
  totalCount: number;
  direction: "en-vi" | "vi-en";
  onToggleDirection: () => void;
  onExit: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onExit}
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-500 transition-colors"
        title="Thoát"
      >
        <X className="w-5 h-5 text-gray-600 hover:text-red-500" />
      </button>

      <div className="text-center flex-1">
        <p className="text-sm font-semibold text-gray-600 bg-white border border-gray-100 rounded-full px-4 py-1.5 inline-block shadow-sm">
          {currentIndex + 1} <span className="text-gray-400 mx-1">/</span> {totalCount}
        </p>
      </div>

      <button
        onClick={onToggleDirection}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm"
        title="Đổi chiều học"
      >
        <ArrowRightLeft className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
        <span className="font-medium text-xs sm:text-sm text-gray-700 hidden sm:inline">
          {direction === "en-vi" ? "EN → VN" : "VN → EN"}
        </span>
      </button>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="mb-6">
      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function StatsRow({
  totalCount,
  masteredCount,
  difficultCount,
}: {
  totalCount: number;
  masteredCount: number;
  difficultCount: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCard label="Tổng" value={totalCount} color="text-gray-900" />
      <StatCard label="Đã thuộc" value={masteredCount} color="text-blue-600" />
      <StatCard label="Cần ôn" value={difficultCount} color="text-orange-600" />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

function ActionBar({
  currentIndex,
  totalCount,
  isFlipped,
  pressedKey,
  onPrevious,
  onNext,
  onAnswer,
}: {
  currentIndex: number;
  totalCount: number;
  isFlipped: boolean;
  pressedKey: string | null;
  onPrevious: () => void;
  onNext: () => void;
  onAnswer: (mastered: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className={`p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          pressedKey === "ArrowLeft" ? "scale-95 bg-gray-100" : ""
        }`}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <button
          onClick={() => onAnswer(false)}
          disabled={!isFlipped}
          className={`group flex flex-col items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            (pressedKey === "1" || pressedKey === "x") && isFlipped
              ? "scale-95 bg-gray-100"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <ThumbsDown className="w-5 h-5" />
            <span>Cần ôn</span>
          </div>
          <kbd className="px-2 py-0.5 bg-gray-100 group-disabled:bg-gray-50 border border-gray-300 rounded text-xs font-mono text-gray-600">
            1
          </kbd>
        </button>
        <button
          onClick={() => onAnswer(true)}
          disabled={!isFlipped}
          className={`group flex flex-col items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            (pressedKey === "2" || pressedKey === "o") && isFlipped
              ? "scale-95 bg-blue-700"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            <span>Đã thuộc</span>
          </div>
          <kbd className="px-2 py-0.5 bg-white/20 group-disabled:bg-white/10 rounded text-xs font-mono">
            2
          </kbd>
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={currentIndex === totalCount - 1}
        className={`p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          pressedKey === "ArrowRight" ? "scale-95 bg-gray-100" : ""
        }`}
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}
