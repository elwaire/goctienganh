"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Volume2,
  ArrowLeft,
  Play,
  MoreVertical,
  BookOpen,
  TrendingUp,
  Clock,
  Check,
  CreditCard,
  PenTool,
  Headphones,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";

interface Word {
  id: string;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  translation: string;
  mastered: boolean;
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

interface GameHistory {
  id: string;
  gameType: "flashcard" | "writing" | "listening";
  gameName: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  timeSpent: string;
  date: string;
}

export default function VocabularySetDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showWordModal, setShowWordModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [wordForm, setWordForm] = useState<Partial<Word>>({
    word: "",
    phonetic: "",
    type: "noun",
    meaning: "",
    example: "",
    translation: "",
  });

  // Mock data - Bộ từ vựng
  const setInfo = {
    id: "1",
    name: "TOEIC Vocabulary - Part 1",
    description: "Từ vựng cơ bản cho TOEIC Reading",
    wordCount: 5,
    createdAt: "2024-03-15",
    lastStudied: "2024-03-20",
    progress: 62,
    overallAccuracy: 85,
    totalAttempts: 12,
    totalTimeSpent: "1h 24m",
  };

  // Mock data - Danh sách từ
  const [words, setWords] = useState<Word[]>([
    {
      id: "1",
      word: "Accomplish",
      phonetic: "əˈkʌmplɪʃ",
      type: "verb",
      meaning: "Hoàn thành, đạt được",
      example: "She accomplished her goal of learning English",
      translation: "Cô ấy đã hoàn thành mục tiêu học tiếng Anh",
      mastered: true,
    },
    {
      id: "2",
      word: "Efficient",
      phonetic: "ɪˈfɪʃənt",
      type: "adjective",
      meaning: "Hiệu quả, năng suất",
      example: "This method is very efficient",
      translation: "Phương pháp này rất hiệu quả",
      mastered: false,
    },
    {
      id: "3",
      word: "Perseverance",
      phonetic: "ˌpɜːrsəˈvɪrəns",
      type: "noun",
      meaning: "Sự kiên trì, bền bỉ",
      example: "Success requires perseverance",
      translation: "Thành công đòi hỏi sự kiên trì",
      mastered: true,
    },
    {
      id: "4",
      word: "Innovation",
      phonetic: "ˌɪnəˈveɪʃən",
      type: "noun",
      meaning: "Sự đổi mới, sáng tạo",
      example: "Innovation drives progress",
      translation: "Đổi mới thúc đẩy tiến bộ",
      mastered: false,
    },
    {
      id: "5",
      word: "Analyze",
      phonetic: "ˈænəlaɪz",
      type: "verb",
      meaning: "Phân tích",
      example: "We need to analyze the data carefully",
      translation: "Chúng ta cần phân tích dữ liệu cẩn thận",
      mastered: true,
    },
  ]);

  // Mock data - Game history
  const gameHistory: GameHistory[] = [
    {
      id: "1",
      gameType: "flashcard",
      gameName: "Flashcard",
      score: 4,
      accuracy: 80,
      totalQuestions: 5,
      timeSpent: "2:30",
      date: "2024-03-20",
    },
    {
      id: "2",
      gameType: "writing",
      gameName: "Luyện viết từ",
      score: 4,
      accuracy: 80,
      totalQuestions: 5,
      timeSpent: "3:45",
      date: "2024-03-19",
    },
    {
      id: "3",
      gameType: "listening",
      gameName: "Nghe từ",
      score: 5,
      accuracy: 100,
      totalQuestions: 5,
      timeSpent: "2:15",
      date: "2024-03-18",
    },
    {
      id: "4",
      gameType: "flashcard",
      gameName: "Flashcard",
      score: 3,
      accuracy: 60,
      totalQuestions: 5,
      timeSpent: "2:50",
      date: "2024-03-17",
    },
  ];

  // Game modes
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

  const filteredWords = words.filter(
    (word) =>
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenAddModal = () => {
    setEditingWord(null);
    setWordForm({
      word: "",
      phonetic: "",
      type: "noun",
      meaning: "",
      example: "",
      translation: "",
    });
    setShowWordModal(true);
  };

  const handleOpenEditModal = (word: Word) => {
    setEditingWord(word);
    setWordForm(word);
    setShowWordModal(true);
  };

  const handleSaveWord = () => {
    if (editingWord) {
      setWords(
        words.map((w) => (w.id === editingWord.id ? { ...w, ...wordForm } : w)),
      );
    } else {
      const newWord: Word = {
        id: Date.now().toString(),
        word: wordForm.word || "",
        phonetic: wordForm.phonetic || "",
        type: wordForm.type || "noun",
        meaning: wordForm.meaning || "",
        example: wordForm.example || "",
        translation: wordForm.translation || "",
        mastered: false,
      };
      setWords([...words, newWord]);
    }
    setShowWordModal(false);
  };

  const handleDeleteWord = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa từ này?")) {
      setWords(words.filter((w) => w.id !== id));
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleStartGame = (gameId: string) => {
    console.log("Starting game:", gameId);
    setShowGameModal(false);
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case "flashcard":
        return <CreditCard className="w-4 h-4" />;
      case "writing":
        return <PenTool className="w-4 h-4" />;
      case "listening":
        return <Headphones className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Quay lại</span>
          </button>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {setInfo.name}
                </h1>
                <p className="text-gray-600 text-sm mb-4">
                  {setInfo.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {words.length}
                      </p>
                      <p className="text-xs text-gray-600">Từ vựng</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {setInfo.progress}%
                      </p>
                      <p className="text-xs text-gray-600">Hoàn thành</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {setInfo.overallAccuracy}%
                      </p>
                      <p className="text-xs text-gray-600">Chính xác</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {setInfo.totalAttempts}
                      </p>
                      <p className="text-xs text-gray-600">Lần học</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setShowGameModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  <Play className="w-4 h-4" />
                  Học ngay
                </button>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Words List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm từ vựng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Thêm từ
                </button>
              </div>
            </div>

            {/* Words List */}
            <div className="space-y-3">
              {filteredWords.length > 0 ? (
                filteredWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteWord}
                    onSpeak={handleSpeak}
                  />
                ))
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  onAddWord={handleOpenAddModal}
                />
              )}
            </div>
          </div>

          {/* Right Column - History */}
          <div className="space-y-6">
            {/* Game History */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Lịch sử luyện tập</h3>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {gameHistory.map((history) => (
                  <div
                    key={history.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {getGameIcon(history.gameType)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {history.gameName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(history.date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          history.accuracy >= 80
                            ? "bg-green-100 text-green-700"
                            : history.accuracy >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {history.accuracy}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>
                        {history.score}/{history.totalQuestions} đúng
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{history.timeSpent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Thống kê</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Độ chính xác</span>
                    <span className="text-sm font-bold text-gray-900">
                      {setInfo.overallAccuracy}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${setInfo.overallAccuracy}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Tiến độ</span>
                    <span className="text-sm font-bold text-gray-900">
                      {setInfo.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${setInfo.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng lần học</span>
                    <span className="font-bold text-gray-900">
                      {setInfo.totalAttempts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Thời gian</span>
                    <span className="font-bold text-gray-900">
                      {setInfo.totalTimeSpent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lần cuối</span>
                    <span className="font-bold text-gray-900">
                      {new Date(setInfo.lastStudied).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Selection Modal */}
      {showGameModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowGameModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Chọn phương thức luyện tập
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {setInfo.name} • {words.length} từ
                  </p>
                </div>
                <button
                  onClick={() => setShowGameModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {gameModes.map((mode) => (
                  <GameModeCard
                    key={mode.id}
                    mode={mode}
                    wordCount={words.length}
                    onStart={() => handleStartGame(mode.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Word Modal */}
      {showWordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowWordModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingWord ? "Chỉnh sửa từ" : "Thêm từ mới"}
              </h3>
              <button
                onClick={() => setShowWordModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ vựng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Accomplish"
                  value={wordForm.word}
                  onChange={(e) =>
                    setWordForm({ ...wordForm, word: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phiên âm
                  </label>
                  <input
                    type="text"
                    placeholder="VD: əˈkʌmplɪʃ"
                    value={wordForm.phonetic}
                    onChange={(e) =>
                      setWordForm({ ...wordForm, phonetic: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại từ
                  </label>
                  <select
                    value={wordForm.type}
                    onChange={(e) =>
                      setWordForm({ ...wordForm, type: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="noun">Danh từ</option>
                    <option value="verb">Động từ</option>
                    <option value="adjective">Tính từ</option>
                    <option value="adverb">Trạng từ</option>
                    <option value="preposition">Giới từ</option>
                    <option value="conjunction">Liên từ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nghĩa tiếng Việt <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Hoàn thành, đạt được"
                  value={wordForm.meaning}
                  onChange={(e) =>
                    setWordForm({ ...wordForm, meaning: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ví dụ
                </label>
                <input
                  type="text"
                  placeholder="VD: She accomplished her goal"
                  value={wordForm.example}
                  onChange={(e) =>
                    setWordForm({ ...wordForm, example: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dịch ví dụ
                </label>
                <input
                  type="text"
                  placeholder="VD: Cô ấy đã hoàn thành mục tiêu"
                  value={wordForm.translation}
                  onChange={(e) =>
                    setWordForm({ ...wordForm, translation: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-5 flex gap-3">
              <button
                onClick={() => setShowWordModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveWord}
                disabled={!wordForm.word || !wordForm.meaning}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingWord ? "Lưu thay đổi" : "Thêm từ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Word Card Component
function WordCard({
  word,
  onEdit,
  onDelete,
  onSpeak,
}: {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
  onSpeak: (text: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{word.word}</h3>
            {word.phonetic && (
              <span className="text-gray-500 italic text-sm">
                /{word.phonetic}/
              </span>
            )}
            <button
              onClick={() => onSpeak(word.word)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
            </button>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
              {word.type}
            </span>
            {word.mastered && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                <Check className="w-3 h-3" />
                Đã thuộc
              </span>
            )}
          </div>

          <p className="text-gray-900 font-medium mb-2 text-sm">
            {word.meaning}
          </p>

          {word.example && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-gray-700 text-sm mb-1">"{word.example}"</p>
              {word.translation && (
                <p className="text-xs text-gray-600">{word.translation}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(word)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(word.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Game Mode Card Component
function GameModeCard({
  mode,
  wordCount,
  onStart,
}: {
  mode: GameMode;
  wordCount: number;
  onStart: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-sm group cursor-pointer">
      <div className="flex flex-col h-full">
        <div
          className={`w-12 h-12 ${mode.bgColor} rounded-xl flex items-center justify-center mb-3 ${mode.color}`}
        >
          {mode.icon}
        </div>

        <h4 className="text-base font-bold text-gray-900 mb-1">{mode.name}</h4>
        <p className="text-xs text-gray-600 mb-3 flex-1">{mode.description}</p>

        <div className="space-y-1 mb-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Độ khó:</span>
            <span className={`font-semibold ${mode.color}`}>
              {mode.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-semibold text-gray-900">
              ~{mode.estimatedTime}
            </span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm"
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({
  searchQuery,
  onAddWord,
}: {
  searchQuery: string;
  onAddWord: () => void;
}) {
  if (searchQuery) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy từ nào
        </h3>
        <p className="text-gray-600 text-sm">Thử tìm kiếm với từ khóa khác</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Chưa có từ vựng nào
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        Thêm từ vựng đầu tiên để bắt đầu học!
      </p>
      <button
        onClick={onAddWord}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
      >
        <Plus className="w-5 h-5" />
        Thêm từ mới
      </button>
    </div>
  );
}
