"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Play,
  RotateCcw,
  Home,
  Check,
  XCircle,
  PenTool,
  Clock,
  Keyboard,
  Info,
  Volume2,
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

type QuestionType = "EN_TO_VN" | "VN_TO_EN" | "FILL_BLANK";

interface Question {
  id: string;
  type: QuestionType;
  word: Word;
  prompt: string;
  correctAnswer: string;
  blankedWord?: string; // For FILL_BLANK type
}

interface Result {
  questionId: string;
  word: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
}

type GameState = "intro" | "playing" | "results";

export default function WritingPage() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const vocabularySet = {
    id: "1",
    name: "TOEIC Vocabulary - Part 1",
  };

  const words: Word[] = [
    {
      id: "1",
      word: "Accomplish",
      phonetic: "əˈkʌmplɪʃ",
      type: "verb",
      meaning: "Hoàn thành, đạt được",
      example: "She accomplished her goal",
      translation: "Cô ấy đã hoàn thành mục tiêu",
    },
    {
      id: "2",
      word: "Efficient",
      phonetic: "ɪˈfɪʃənt",
      type: "adjective",
      meaning: "Hiệu quả",
      example: "This method is very efficient",
      translation: "Phương pháp này rất hiệu quả",
    },
    {
      id: "3",
      word: "Perseverance",
      phonetic: "ˌpɜːrsəˈvɪrəns",
      type: "noun",
      meaning: "Sự kiên trì",
      example: "Success requires perseverance",
      translation: "Thành công đòi hỏi sự kiên trì",
    },
    {
      id: "4",
      word: "Innovation",
      phonetic: "ˌɪnəˈveɪʃən",
      type: "noun",
      meaning: "Sự đổi mới",
      example: "Innovation drives progress",
      translation: "Đổi mới thúc đẩy tiến bộ",
    },
    {
      id: "5",
      word: "Analyze",
      phonetic: "ˈænəlaɪz",
      type: "verb",
      meaning: "Phân tích",
      example: "Analyze the data carefully",
      translation: "Phân tích dữ liệu cẩn thận",
    },
  ];

  // Generate questions
  const generateQuestions = (): Question[] => {
    const questions: Question[] = [];
    const questionTypes: QuestionType[] = [
      "EN_TO_VN",
      "VN_TO_EN",
      "FILL_BLANK",
    ];

    words.forEach((word) => {
      // Random question type
      const type =
        questionTypes[Math.floor(Math.random() * questionTypes.length)];

      let prompt = "";
      let correctAnswer = "";
      let blankedWord = "";

      switch (type) {
        case "EN_TO_VN":
          prompt = `Nghĩa của từ "${word.word}" là gì?`;
          correctAnswer = word.meaning;
          break;
        case "VN_TO_EN":
          prompt = `"${word.meaning}" trong tiếng Anh là gì?`;
          correctAnswer = word.word;
          break;
        case "FILL_BLANK":
          const blankCount = Math.floor(word.word.length / 3) + 1;
          blankedWord = word.word
            .split("")
            .map((char, i) => {
              if (i > 0 && i < word.word.length - 1 && Math.random() < 0.4) {
                return "_";
              }
              return char;
            })
            .join("");
          prompt = `Điền đầy đủ từ: ${blankedWord}`;
          correctAnswer = word.word;
          break;
      }

      questions.push({
        id: `${word.id}-${type}`,
        type,
        word,
        prompt,
        correctAnswer,
        blankedWord,
      });
    });

    return questions;
  };

  const [questions] = useState<Question[]>(generateQuestions());
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const correctCount = results.filter((r) => r.correct).length;
  const wrongCount = results.filter((r) => !r.correct).length;

  const normalizeAnswer = (answer: string): string => {
    return answer.toLowerCase().trim().replace(/\s+/g, " ");
  };

  const checkAnswer = useCallback(() => {
    if (!userAnswer.trim()) return;

    const normalized = normalizeAnswer(userAnswer);
    const correct = normalizeAnswer(currentQuestion.correctAnswer);
    const isAnswerCorrect = normalized === correct;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const result: Result = {
      questionId: currentQuestion.id,
      word: currentQuestion.word.word,
      correct: isAnswerCorrect,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentQuestion.correctAnswer,
    };

    setResults((prev) => [...prev, result]);
  }, [userAnswer, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setGameState("results");
    }
  }, [currentIndex, questions.length]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      if (showFeedback) {
        handleNext();
      } else {
        checkAnswer();
      }
    },
    [showFeedback, handleNext, checkAnswer],
  );

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Exit");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Auto-focus input
  useEffect(() => {
    if (gameState === "playing" && !showFeedback) {
      inputRef.current?.focus();
    }
  }, [gameState, currentIndex, showFeedback]);

  const handleStart = () => {
    setGameState("playing");
    setStartTime(new Date());
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setShowFeedback(false);
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

  // Intro Screen
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Luyện viết từ
              </h1>
              <p className="text-gray-600 text-sm">
                Trả lời câu hỏi bằng cách gõ từ vựng
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                {vocabularySet.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <span>{questions.length} câu hỏi</span>
                <span>•</span>
                <span>~8 phút</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900 text-sm">
                  Loại câu hỏi:
                </h4>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>• Viết nghĩa tiếng Việt</p>
                <p>• Viết từ tiếng Anh</p>
                <p>• Điền chữ cái còn thiếu</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Keyboard className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900 text-sm">
                  Phím tắt:
                </h4>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Gửi câu trả lời</span>
                  <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                    Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Câu tiếp theo</span>
                  <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                    Enter
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
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const elapsedTime = getElapsedTime();

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hoàn thành!
              </h2>
              <p className="text-gray-600 text-sm">
                Bạn đã hoàn thành bài luyện viết
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {correctCount}
                </div>
                <div className="text-xs text-gray-600">Đúng</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {wrongCount}
                </div>
                <div className="text-xs text-gray-600">Sai</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-1">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-600 mb-6 text-sm">
              <Clock className="w-4 h-4" />
              <span>Thời gian: {elapsedTime}</span>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                Kết quả chi tiết:
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      result.correct ? "bg-blue-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {result.word}
                        </p>
                        {!result.correct && (
                          <div className="text-xs space-y-0.5">
                            <p className="text-red-600">
                              Bạn trả lời: {result.userAnswer}
                            </p>
                            <p className="text-gray-600">
                              Đáp án đúng: {result.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                      {result.correct ? (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <X className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Thoát</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Câu {currentIndex + 1}/{questions.length}
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
            <div className="text-xl font-bold text-gray-900">
              {questions.length}
            </div>
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
              {currentQuestion.type === "EN_TO_VN" && "Dịch sang tiếng Việt"}
              {currentQuestion.type === "VN_TO_EN" && "Dịch sang tiếng Anh"}
              {currentQuestion.type === "FILL_BLANK" && "Điền chữ còn thiếu"}
            </span>
            {currentQuestion.type === "VN_TO_EN" && (
              <button
                onClick={() => handleSpeak(currentQuestion.correctAnswer)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
              </button>
            )}
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {currentQuestion.prompt}
          </h3>

          {/* Input Form */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
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
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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
                          {currentQuestion.correctAnswer}
                        </span>
                      </p>
                    )}
                    {/* Show example */}
                    {currentQuestion.word.example && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        "{currentQuestion.word.example}"
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
            Nhấn{" "}
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
              Enter
            </kbd>{" "}
            để {showFeedback ? "tiếp tục" : "gửi câu trả lời"}
          </p>
        </div>
      </div>
    </div>
  );
}
