"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  CreditCard,
  PenTool,
  Headphones,
  Filter,
  Lock,
  Globe,
  Star,
  Flame,
  ChevronDown,
  Check,
  Play,
} from "lucide-react";

interface VocabularySet {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  isPublic: boolean;
  progress: number;
  accuracy: number;
  lastStudied?: string;
  author?: string;
  difficulty: "easy" | "medium" | "hard";
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  difficulty: string;
  estimatedTime: string;
  path: string;
}

export default function PracticePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"my-sets" | "public">("my-sets");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSet, setSelectedSet] = useState<VocabularySet | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<string | null>(null);
  const [showSetDropdown, setShowSetDropdown] = useState(false);

  // Mock data - Tất cả bộ từ
  const allSets: VocabularySet[] = [
    {
      id: "1",
      name: "TOEIC Vocabulary - Part 1",
      description: "Từ vựng cơ bản cho TOEIC Reading",
      wordCount: 150,
      isPublic: true,
      progress: 87,
      accuracy: 92,
      lastStudied: "2024-03-20",
      difficulty: "medium",
    },
    {
      id: "2",
      name: "Business English",
      description: "Từ vựng thương mại quan trọng",
      wordCount: 200,
      isPublic: false,
      progress: 45,
      accuracy: 78,
      lastStudied: "2024-03-18",
      difficulty: "hard",
    },
    {
      id: "3",
      name: "Daily Conversation",
      description: "Giao tiếp hàng ngày",
      wordCount: 80,
      isPublic: true,
      progress: 100,
      accuracy: 95,
      lastStudied: "2024-03-22",
      difficulty: "easy",
    },
    {
      id: "4",
      name: "Academic Writing",
      description: "Từ vựng viết luận học thuật",
      wordCount: 180,
      isPublic: false,
      progress: 62,
      accuracy: 85,
      lastStudied: "2024-03-19",
      difficulty: "hard",
    },
    {
      id: "5",
      name: "IELTS Academic Words",
      description: "Essential vocabulary for IELTS",
      wordCount: 500,
      isPublic: true,
      progress: 0,
      accuracy: 0,
      author: "John Smith",
      difficulty: "hard",
    },
    {
      id: "6",
      name: "Travel English",
      description: "Useful phrases for travelers",
      wordCount: 120,
      isPublic: true,
      progress: 0,
      accuracy: 0,
      author: "Travel Pro",
      difficulty: "easy",
    },
  ];

  // Game modes với đường dẫn
  const gameModes: GameMode[] = [
    {
      id: "flashcard",
      name: "Flashcard",
      description: "Lật thẻ để xem nghĩa và ghi nhớ từ vựng",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      difficulty: "Dễ",
      estimatedTime: "5 phút",
      path: "/practice/flashcard",
    },
    {
      id: "writing",
      name: "Luyện viết từ",
      description: "Nghe và viết lại từ vựng chính xác",
      icon: <PenTool className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      difficulty: "Trung bình",
      estimatedTime: "8 phút",
      path: "/practice/writing",
    },
    {
      id: "listening",
      name: "Nghe từ",
      description: "Nghe phát âm và viết lại từ vựng",
      icon: <Headphones className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      difficulty: "Trung bình",
      estimatedTime: "7 phút",
      path: "/practice/listening",
    },
  ];

  const currentSets =
    activeTab === "my-sets"
      ? allSets.filter((s) => s.progress > 0 || !s.author)
      : allSets.filter((s) => s.author);

  const filteredSets = currentSets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      default:
        return difficulty;
    }
  };

  const handleStartPractice = () => {
    if (!selectedSet || !selectedGameMode) return;

    const gameMode = gameModes.find((g) => g.id === selectedGameMode);
    if (gameMode) {
      // Navigate với query params
      router.push(`${gameMode.path}?setId=${selectedSet.id}`);
    }
  };

  const canStart = selectedSet && selectedGameMode;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Luyện tập</h1>
              <p className="text-gray-600 mt-1 text-sm">
                Chọn bộ từ và phương thức luyện tập để bắt đầu
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-600">Chuỗi ngày</p>
                    <p className="text-lg font-bold text-gray-900">15</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-600">Hôm nay</p>
                    <p className="text-lg font-bold text-gray-900">42</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Select Set */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Chọn bộ từ vựng
                  </h2>
                  <p className="text-xs text-gray-600">
                    Bước 1: Chọn bộ từ bạn muốn luyện
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("my-sets")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "my-sets"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Của tôi
                </button>
                <button
                  onClick={() => setActiveTab("public")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "public"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Khám phá
                </button>
              </div>

              {/* Dropdown Select */}
              <div className="relative">
                <button
                  onClick={() => setShowSetDropdown(!showSetDropdown)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-500 transition-colors text-sm"
                >
                  {selectedSet ? (
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">
                        {selectedSet.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {selectedSet.wordCount} từ
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-500">Chọn bộ từ vựng...</span>
                  )}
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${showSetDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showSetDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-10">
                    {filteredSets.map((set) => (
                      <button
                        key={set.id}
                        onClick={() => {
                          setSelectedSet(set);
                          setShowSetDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          selectedSet?.id === set.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              {set.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {set.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-600">
                                {set.wordCount} từ
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-md ${getDifficultyColor(set.difficulty)}`}
                              >
                                {getDifficultyText(set.difficulty)}
                              </span>
                            </div>
                          </div>
                          {selectedSet?.id === set.id && (
                            <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Set Info */}
              {selectedSet && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Bộ từ đã chọn:
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {selectedSet.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="w-3 h-3 text-blue-600" />
                      <span className="font-medium">
                        {selectedSet.wordCount} từ
                      </span>
                    </div>
                    {selectedSet.progress > 0 && (
                      <>
                        <div className="flex items-center gap-2 text-gray-700">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="font-medium">
                            {selectedSet.progress}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Select Game Mode */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Chọn phương thức
                  </h2>
                  <p className="text-xs text-gray-600">
                    Bước 2: Chọn cách luyện tập
                  </p>
                </div>
              </div>

              {/* Game Modes */}
              <div className="space-y-3">
                {gameModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedGameMode(mode.id)}
                    disabled={!selectedSet}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedGameMode === mode.id
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    } ${!selectedSet ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedGameMode === mode.id
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        } ${mode.color}`}
                      >
                        {mode.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 text-sm">
                            {mode.name}
                          </h3>
                          {selectedGameMode === mode.id && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {mode.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="font-medium text-blue-600">
                            {mode.difficulty}
                          </span>
                          <span>•</span>
                          <span>~{mode.estimatedTime}</span>
                          {selectedSet && (
                            <>
                              <span>•</span>
                              <span>{selectedSet.wordCount} từ</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-6">
          <button
            onClick={handleStartPractice}
            disabled={!canStart}
            className={`w-full px-8 py-4 rounded-xl font-bold transition-all ${
              canStart
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {!selectedSet &&
              !selectedGameMode &&
              "Chọn bộ từ và phương thức để bắt đầu"}
            {selectedSet && !selectedGameMode && "Chọn phương thức luyện tập"}
            {!selectedSet && selectedGameMode && "Chọn bộ từ vựng"}
            {canStart && (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Bắt đầu luyện tập ngay
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
