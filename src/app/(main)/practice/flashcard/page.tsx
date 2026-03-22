"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  X,
  ThumbsUp,
  ThumbsDown,
  Home,
  RotateCcw,
  Play,
  BookOpen,
  Clock,
  Check,
  XCircle,
  Keyboard,
  Info,
} from "lucide-react";

interface Word {
  id: string;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  translation: string;
}

interface CardResult {
  wordId: string;
  word: string;
  mastered: boolean;
}

type GameState = "intro" | "playing" | "results";

export default function FlashcardPage() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const vocabularySet = {
    id: "1",
    name: "TOEIC Vocabulary - Part 1",
    wordCount: 5,
  };

  const words: Word[] = [
    {
      id: "1",
      word: "Accomplish",
      phonetic: "əˈkʌmplɪʃ",
      type: "verb",
      meaning: "Hoàn thành, đạt được",
      example: "She accomplished her goal of learning English",
      translation: "Cô ấy đã hoàn thành mục tiêu học tiếng Anh",
    },
    {
      id: "2",
      word: "Efficient",
      phonetic: "ɪˈfɪʃənt",
      type: "adjective",
      meaning: "Hiệu quả, năng suất",
      example: "This method is very efficient",
      translation: "Phương pháp này rất hiệu quả",
    },
    {
      id: "3",
      word: "Perseverance",
      phonetic: "ˌpɜːrsəˈvɪrəns",
      type: "noun",
      meaning: "Sự kiên trì, bền bỉ",
      example: "Success requires perseverance",
      translation: "Thành công đòi hỏi sự kiên trì",
    },
    {
      id: "4",
      word: "Innovation",
      phonetic: "ˌɪnəˈveɪʃən",
      type: "noun",
      meaning: "Sự đổi mới, sáng tạo",
      example: "Innovation drives progress",
      translation: "Đổi mới thúc đẩy tiến bộ",
    },
    {
      id: "5",
      word: "Analyze",
      phonetic: "ˈænəlaɪz",
      type: "verb",
      meaning: "Phân tích",
      example: "We need to analyze the data carefully",
      translation: "Chúng ta cần phân tích dữ liệu cẩn thận",
    },
  ];

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;
  const masteredCount = results.filter((r) => r.mastered).length;
  const difficultCount = results.filter((r) => !r.mastered).length;

  const handleSpeak = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleAnswer = useCallback(
    (mastered: boolean) => {
      if (!isFlipped) return;

      const result: CardResult = {
        wordId: currentWord.id,
        word: currentWord.word,
        mastered,
      };

      setResults((prev) => [...prev, result]);

      if (currentIndex < words.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        }, 300);
      } else {
        setTimeout(() => {
          setGameState("results");
        }, 300);
      }
    },
    [isFlipped, currentIndex, currentWord, words.length],
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setResults((prev) => prev.slice(0, -1));
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1 && !isFlipped) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, words.length, isFlipped]);

  const handleStart = () => {
    setGameState("playing");
    setStartTime(new Date());
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    setGameState("playing");
    setStartTime(new Date());
  };

  const handleExit = () => {
    console.log("Exit to practice page");
  };

  const getElapsedTime = () => {
    if (!startTime) return "0:00";
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default for navigation keys
      if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      // Show visual feedback
      setPressedKey(e.key);
      setTimeout(() => setPressedKey(null), 200);

      switch (e.key.toLowerCase()) {
        case " ":
        case "enter":
          handleFlip();
          break;
        case "arrowleft":
          handlePrevious();
          break;
        case "arrowright":
          handleNext();
          break;
        case "1":
        case "x":
          handleAnswer(false);
          break;
        case "2":
        case "o":
          handleAnswer(true);
          break;
        case "s":
          if (currentWord) {
            handleSpeak(currentWord.word);
          }
          break;
        case "escape":
          handleExit();
          break;
        case "?":
          setShowShortcuts(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState,
    handleFlip,
    handleAnswer,
    handlePrevious,
    handleNext,
    currentWord,
    handleSpeak,
  ]);

  // Auto-focus on mount
  useEffect(() => {
    if (gameState === "playing") {
      document.body.focus();
    }
  }, [gameState]);

  // Intro Screen
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Flashcard
              </h1>
              <p className="text-gray-600">
                Lật thẻ để xem nghĩa và ghi nhớ từ vựng
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">
                {vocabularySet.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span>{words.length} từ</span>
                <span>•</span>
                <span>~5 phút</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Keyboard className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Phím tắt:</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Lật thẻ</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    Space
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cần ôn</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    1
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Đã thuộc</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    2
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phát âm</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    S
                  </kbd>
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Bắt đầu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === "results") {
    const accuracy = Math.round((masteredCount / words.length) * 100);
    const elapsedTime = getElapsedTime();

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hoàn thành!
              </h2>
              <p className="text-gray-600">Bạn đã hoàn thành bộ flashcard</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {masteredCount}
                </div>
                <div className="text-sm text-gray-600">Đã thuộc</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {difficultCount}
                </div>
                <div className="text-sm text-gray-600">Cần ôn</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-block">
                <div className="text-5xl font-bold text-blue-600 mb-1">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600">Độ chính xác</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Thời gian: {elapsedTime}</span>
            </div>

            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Kết quả:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      result.mastered ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-medium text-gray-900">
                      {result.word}
                    </span>
                    {result.mastered ? (
                      <Check className="w-5 h-5 text-blue-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Học lại
              </button>
              <button
                onClick={handleExit}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Thoát
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Thoát</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentIndex + 1} / {words.length}
            </p>
          </div>

          <button
            onClick={() => setShowShortcuts(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Keyboard className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700 hidden sm:inline">
              Phím tắt
            </span>
          </button>
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {words.length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Tổng</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {masteredCount}
            </div>
            <div className="text-xs text-gray-600 mt-1">Đã thuộc</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {difficultCount}
            </div>
            <div className="text-xs text-gray-600 mt-1">Cần ôn</div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8 perspective-1000">
          <div
            onClick={handleFlip}
            className={`relative w-full aspect-[3/2] cursor-pointer transition-all duration-500 ${
              pressedKey === " " || pressedKey === "Enter" ? "scale-95" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-lg mb-4">
                  {currentWord.type}
                </span>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  {currentWord.word}
                </h1>

                {currentWord.phonetic && (
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <p className="text-lg text-white/80">
                      /{currentWord.phonetic}/
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentWord.word);
                      }}
                      className={`p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all ${
                        pressedKey === "s" ? "scale-110 bg-white/40" : ""
                      }`}
                    >
                      <Volume2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <span>Nhấn</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">
                    Space
                  </kbd>
                  <span>để lật</span>
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-center w-full">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg mb-4">
                  {currentWord.type}
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {currentWord.meaning}
                </h2>

                {currentWord.example && (
                  <div className="bg-gray-50 rounded-xl p-5 max-w-2xl mx-auto border border-gray-200">
                    <p className="text-gray-700 mb-2">
                      "{currentWord.example}"
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentWord.translation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              pressedKey === "ArrowLeft" ? "scale-95 bg-gray-100" : ""
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
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
              onClick={() => handleAnswer(true)}
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
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className={`p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              pressedKey === "ArrowRight" ? "scale-95 bg-gray-100" : ""
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Keyboard hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sử dụng phím tắt để học nhanh hơn • Nhấn{" "}
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
              ?
            </kbd>{" "}
            để xem hướng dẫn
          </p>
        </div>
      </div>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Phím tắt</h3>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <ShortcutItem keys={["Space", "Enter"]} description="Lật thẻ" />
              <ShortcutItem keys={["1", "X"]} description="Đánh dấu cần ôn" />
              <ShortcutItem keys={["2", "O"]} description="Đánh dấu đã thuộc" />
              <ShortcutItem keys={["←"]} description="Thẻ trước" />
              <ShortcutItem keys={["→"]} description="Thẻ sau" />
              <ShortcutItem keys={["S"]} description="Phát âm" />
              <ShortcutItem keys={["Esc"]} description="Thoát" />
            </div>

            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Sử dụng phím tắt giúp bạn học nhanh hơn và không cần dùng
                  chuột!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

function ShortcutItem({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{description}</span>
      <div className="flex items-center gap-2">
        {keys.map((key, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-400 text-sm">hoặc</span>}
            <kbd className="px-2.5 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-mono text-gray-700 min-w-[2.5rem] text-center">
              {key}
            </kbd>
          </span>
        ))}
      </div>
    </div>
  );
}
