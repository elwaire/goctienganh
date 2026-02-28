// app/(main)/exam/[id]/start/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

// Types
type Answer = "A" | "B" | "C" | "D";

type Question = {
  id: string;
  question: string;
  options: { key: Answer; text: string }[];
  correctAnswer: Answer;
  explanation?: string;
};

type QuestionStatus =
  | "unanswered"
  | "answered"
  | "flagged"
  | "flagged-answered";

// Mock data - Câu hỏi mẫu
const questions: Question[] = [
  {
    id: "1",
    question: "UX Design viết tắt của từ gì?",
    options: [
      { key: "A", text: "User Experience Design" },
      { key: "B", text: "User Extension Design" },
      { key: "C", text: "Universal Experience Design" },
      { key: "D", text: "User External Design" },
    ],
    correctAnswer: "A",
    explanation: "UX là viết tắt của User Experience - Trải nghiệm người dùng.",
  },
  {
    id: "2",
    question: "Nguyên tắc nào sau đây KHÔNG thuộc về Design Principles cơ bản?",
    options: [
      { key: "A", text: "Contrast (Tương phản)" },
      { key: "B", text: "Alignment (Căn chỉnh)" },
      { key: "C", text: "Animation (Hoạt ảnh)" },
      { key: "D", text: "Proximity (Khoảng cách)" },
    ],
    correctAnswer: "C",
    explanation:
      "4 nguyên tắc cơ bản là: Contrast, Repetition, Alignment, Proximity (CRAP).",
  },
  {
    id: "3",
    question: "Wireframe là gì trong quy trình thiết kế UI/UX?",
    options: [
      { key: "A", text: "Bản thiết kế hoàn chỉnh với màu sắc" },
      { key: "B", text: "Bản phác thảo cấu trúc cơ bản của giao diện" },
      { key: "C", text: "Phiên bản cuối cùng của sản phẩm" },
      { key: "D", text: "Báo cáo nghiên cứu người dùng" },
    ],
    correctAnswer: "B",
    explanation:
      "Wireframe là bản phác thảo low-fidelity thể hiện cấu trúc và layout cơ bản.",
  },
  {
    id: "4",
    question:
      "Phương pháp nghiên cứu nào sau đây thuộc loại Qualitative Research?",
    options: [
      { key: "A", text: "A/B Testing" },
      { key: "B", text: "User Interview" },
      { key: "C", text: "Analytics Data" },
      { key: "D", text: "Survey với câu hỏi đóng" },
    ],
    correctAnswer: "B",
    explanation:
      "User Interview là phương pháp định tính (qualitative), giúp hiểu sâu về người dùng.",
  },
  {
    id: "5",
    question: "Persona trong UX Design dùng để làm gì?",
    options: [
      { key: "A", text: "Đại diện cho đội ngũ thiết kế" },
      { key: "B", text: "Mô tả chi tiết kỹ thuật của sản phẩm" },
      { key: "C", text: "Đại diện cho nhóm người dùng mục tiêu" },
      { key: "D", text: "Liệt kê các tính năng của sản phẩm" },
    ],
    correctAnswer: "C",
    explanation:
      "Persona là nhân vật hư cấu đại diện cho nhóm người dùng mục tiêu.",
  },
  {
    id: "6",
    question: "Affordance trong thiết kế UI có nghĩa là gì?",
    options: [
      { key: "A", text: "Khả năng chi trả của người dùng" },
      { key: "B", text: "Gợi ý trực quan về cách sử dụng một đối tượng" },
      { key: "C", text: "Kích thước của các phần tử UI" },
      { key: "D", text: "Tốc độ tải trang" },
    ],
    correctAnswer: "B",
    explanation:
      "Affordance là thuộc tính gợi ý cách sử dụng, ví dụ nút bấm trông có thể click được.",
  },
  {
    id: "7",
    question: "Heuristic Evaluation là phương pháp đánh giá dựa trên?",
    options: [
      { key: "A", text: "Dữ liệu người dùng thực tế" },
      { key: "B", text: "Các nguyên tắc thiết kế đã được công nhận" },
      { key: "C", text: "Đánh giá của khách hàng" },
      { key: "D", text: "Số liệu doanh thu" },
    ],
    correctAnswer: "B",
    explanation:
      "Heuristic Evaluation dựa trên các nguyên tắc usability đã được công nhận (Nielsen's Heuristics).",
  },
  {
    id: "8",
    question: "Information Architecture (IA) tập trung vào điều gì?",
    options: [
      { key: "A", text: "Màu sắc và typography" },
      { key: "B", text: "Cấu trúc và tổ chức thông tin" },
      { key: "C", text: "Animation và transition" },
      { key: "D", text: "Code và development" },
    ],
    correctAnswer: "B",
    explanation:
      "IA tập trung vào cách tổ chức, cấu trúc và gán nhãn nội dung một cách hiệu quả.",
  },
  {
    id: "9",
    question: "User Flow diagram thể hiện điều gì?",
    options: [
      { key: "A", text: "Doanh thu của sản phẩm" },
      {
        key: "B",
        text: "Các bước người dùng thực hiện để hoàn thành một task",
      },
      { key: "C", text: "Cấu trúc database" },
      { key: "D", text: "Lịch sử phát triển sản phẩm" },
    ],
    correctAnswer: "B",
    explanation:
      "User Flow mô tả các bước và quyết định của người dùng khi sử dụng sản phẩm.",
  },
  {
    id: "10",
    question: "Micro-interaction là gì?",
    options: [
      { key: "A", text: "Tương tác rất nhỏ, chi tiết trong giao diện" },
      { key: "B", text: "Tương tác giữa các microservice" },
      { key: "C", text: "Cuộc họp ngắn của team" },
      { key: "D", text: "Font chữ nhỏ" },
    ],
    correctAnswer: "A",
    explanation:
      "Micro-interaction là những tương tác nhỏ như hover effect, loading animation, toggle switch...",
  },
];

const examInfo = {
  title: "UI/UX Fundamentals",
  totalTime: 30 * 60, // 30 phút tính bằng giây
  passingScore: 70,
};

export default function StartExamPage() {
  const router = useRouter();

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [timeLeft, setTimeLeft] = useState(examInfo.totalTime);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

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
  }, [isSubmitted, timeLeft]);

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

  // Handlers
  const handleSelectAnswer = (answer: Answer) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleToggleFlag = () => {
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

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);
  };

  const handleExit = () => {
    router.push("/exam");
  };

  // Calculate results
  const calculateResults = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const score = Math.round((correct / totalQuestions) * 100);
    const isPassed = score >= examInfo.passingScore;
    return { correct, score, isPassed };
  };

  const results = isSubmitted ? calculateResults() : null;
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // Keyboard shortcuts
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
          handleSelectAnswer("A");
          break;
        case "2":
        case "b":
        case "B":
          handleSelectAnswer("B");
          break;
        case "3":
        case "c":
        case "C":
          handleSelectAnswer("C");
          break;
        case "4":
        case "d":
        case "D":
          handleSelectAnswer("D");
          break;
        case "f":
        case "F":
          handleToggleFlag();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isSubmitted, showConfirmModal, showExitModal]);

  // Result Screen
  if (isSubmitted && results) {
    return (
      <ResultScreen
        results={results}
        questions={questions}
        answers={answers}
        examTitle={examInfo.title}
        onRetry={() => {
          setIsSubmitted(false);
          setAnswers({});
          setFlaggedQuestions(new Set());
          setCurrentIndex(0);
          setTimeLeft(examInfo.totalTime);
        }}
        onExit={handleExit}
      />
    );
  }

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
                  {examInfo.title}
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
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-xl">
                {currentIndex + 1}
              </span>
              <div>
                <p className="text-sm text-neutral-500">Câu hỏi</p>
                <p className="text-xs text-neutral-400">Chọn một đáp án đúng</p>
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
            <h2 className="text-lg font-medium text-neutral-800 leading-relaxed mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.key;

                return (
                  <button
                    key={option.key}
                    onClick={() => handleSelectAnswer(option.key)}
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
                      {option.key}
                    </span>
                    <span
                      className={`flex-1 ${isSelected ? "text-blue-700 font-medium" : "text-neutral-700"}`}
                    >
                      {option.text}
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
                    {index + 1}
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
        <Modal onClose={() => setShowExitModal(false)}>
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">
              Thoát bài thi?
            </h3>
            <p className="text-neutral-500 mb-6">
              Tiến độ làm bài sẽ không được lưu lại. Bạn có chắc chắn muốn
              thoát?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 px-4 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-xl transition-colors"
              >
                Tiếp tục làm
              </button>
              <button
                onClick={handleExit}
                className="flex-1 py-3 px-4 text-white bg-rose-500 hover:bg-rose-600 font-medium rounded-xl transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
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

// Result Screen Component
function ResultScreen({
  results,
  questions,
  answers,
  examTitle,
  onRetry,
  onExit,
}: {
  results: { correct: number; score: number; isPassed: boolean };
  questions: Question[];
  answers: Record<string, Answer | null>;
  examTitle: string;
  onRetry: () => void;
  onExit: () => void;
}) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div
            className={`p-8 text-center ${
              results.isPassed
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                : "bg-gradient-to-br from-rose-500 to-rose-600"
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                results.isPassed ? "bg-white/20" : "bg-white/20"
              }`}
            >
              {results.isPassed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <Target className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {results.isPassed ? "Chúc mừng! 🎉" : "Cố gắng lên! 💪"}
            </h2>
            <p className="text-white/80">
              {results.isPassed
                ? "Bạn đã hoàn thành xuất sắc bài thi"
                : "Bạn cần ôn tập thêm để đạt điểm đậu"}
            </p>
          </div>

          {/* Score */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-6xl font-bold text-neutral-800 mb-2">
                {results.score}
              </p>
              <p className="text-neutral-500">điểm / 100</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-600">
                  {results.correct}
                </p>
                <p className="text-sm text-emerald-600">Đúng</p>
              </div>
              <div className="text-center p-4 bg-rose-50 rounded-xl">
                <X className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-rose-600">
                  {questions.length - results.correct}
                </p>
                <p className="text-sm text-rose-600">Sai</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {questions.length}
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

        {/* Show/Hide Answers Toggle */}
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium rounded-xl transition-colors mb-4"
        >
          <BookOpen className="w-5 h-5" />
          {showAnswers ? "Ẩn đáp án" : "Xem đáp án chi tiết"}
        </button>

        {/* Answers Review */}
        {showAnswers && (
          <div className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl border-2 p-4 ${
                    isCorrect ? "border-emerald-200" : "border-rose-200"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg font-semibold text-sm shrink-0 ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className="font-medium text-neutral-800">{q.question}</p>
                  </div>

                  <div className="pl-11 space-y-2">
                    {q.options.map((opt) => {
                      const isUserAnswer = userAnswer === opt.key;
                      const isCorrectAnswer = q.correctAnswer === opt.key;

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                            isCorrectAnswer
                              ? "bg-emerald-50 text-emerald-700"
                              : isUserAnswer && !isCorrect
                                ? "bg-rose-50 text-rose-700 line-through"
                                : "text-neutral-600"
                          }`}
                        >
                          <span className="font-medium">{opt.key}.</span>
                          <span>{opt.text}</span>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                          )}
                          {isUserAnswer && !isCorrect && (
                            <X className="w-4 h-4 text-rose-500 ml-auto" />
                          )}
                        </div>
                      );
                    })}

                    {q.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <span className="font-semibold">Giải thích:</span>{" "}
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
      </div>
    </div>
  );
}
