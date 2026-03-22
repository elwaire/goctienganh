"use client";

import { useState } from "react";
import {
  Plus,
  BookOpen,
  Lock,
  Globe,
  Calendar,
  Edit,
  Trash2,
  Play,
  Search,
  Filter,
  X,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface VocabularySet {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  isPublic: boolean;
  createdAt: string;
  studyCount: number;
  accuracy: number;
  author?: string;
}

export default function VocabularySetPage() {
  const [activeTab, setActiveTab] = useState<"my-sets" | "public">("my-sets");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSet, setNewSet] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  // Mock data - Bộ từ của tôi
  const mySets: VocabularySet[] = [
    {
      id: "1",
      name: "TOEIC Vocabulary - Part 1",
      description: "Từ vựng cơ bản cho TOEIC Reading",
      wordCount: 150,
      isPublic: true,
      createdAt: "2024-03-15",
      studyCount: 23,
      accuracy: 87,
    },
    {
      id: "2",
      name: "Business English",
      description: "Từ vựng thương mại quan trọng",
      wordCount: 200,
      isPublic: false,
      createdAt: "2024-03-10",
      studyCount: 15,
      accuracy: 92,
    },
    {
      id: "3",
      name: "Daily Conversation",
      description: "Giao tiếp hàng ngày",
      wordCount: 80,
      isPublic: true,
      createdAt: "2024-03-05",
      studyCount: 45,
      accuracy: 78,
    },
  ];

  // Mock data - Bộ từ công khai
  const publicSets: VocabularySet[] = [
    {
      id: "4",
      name: "IELTS Academic Words",
      description: "Essential vocabulary for IELTS",
      wordCount: 500,
      isPublic: true,
      createdAt: "2024-03-01",
      studyCount: 1250,
      accuracy: 0,
      author: "John Smith",
    },
    {
      id: "5",
      name: "1000 Most Common Words",
      description: "Top 1000 words in English",
      wordCount: 1000,
      isPublic: true,
      createdAt: "2024-02-20",
      studyCount: 3420,
      accuracy: 0,
      author: "English Master",
    },
    {
      id: "6",
      name: "Travel English",
      description: "Useful phrases for travelers",
      wordCount: 120,
      isPublic: true,
      createdAt: "2024-02-15",
      studyCount: 890,
      accuracy: 0,
      author: "Travel Pro",
    },
  ];

  const currentSets = activeTab === "my-sets" ? mySets : publicSets;

  const filteredSets = currentSets.filter(
    (set) =>
      set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateSet = () => {
    console.log("Create set:", newSet);
    setShowCreateModal(false);
    setNewSet({ name: "", description: "", isPublic: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bộ từ vựng</h1>
              <p className="text-gray-600 mt-1">
                Quản lý và luyện tập từ vựng của bạn
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-5 h-5" />
              Tạo bộ từ mới
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bộ từ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Lọc</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 inline-flex">
          <button
            onClick={() => setActiveTab("my-sets")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "my-sets"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Của tôi ({mySets.length})
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "public"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Công khai ({publicSets.length})
          </button>
        </div>

        {/* Sets Grid */}
        {filteredSets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set) => (
              <VocabularySetCard
                key={set.id}
                set={set}
                isMySet={activeTab === "my-sets"}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            activeTab={activeTab}
            onCreateNew={() => setShowCreateModal(true)}
          />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Tạo bộ từ mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên bộ từ
                </label>
                <input
                  type="text"
                  placeholder="VD: TOEIC Vocabulary"
                  value={newSet.name}
                  onChange={(e) =>
                    setNewSet({ ...newSet, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  placeholder="Mô tả ngắn về bộ từ này..."
                  value={newSet.description}
                  onChange={(e) =>
                    setNewSet({ ...newSet, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Công khai</p>
                    <p className="text-sm text-gray-500">
                      Cho phép người khác xem bộ từ này
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setNewSet({ ...newSet, isPublic: !newSet.isPublic })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    newSet.isPublic ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      newSet.isPublic ? "translate-x-7" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateSet}
                  disabled={!newSet.name.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo bộ từ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Vocabulary Set Card Component
function VocabularySetCard({
  set,
  isMySet,
}: {
  set: VocabularySet;
  isMySet: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all p-6 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {set.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {set.description}
          </p>
        </div>
        <div className="ml-3">
          {set.isPublic ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
              <Globe className="w-3 h-3" />
              Public
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              <Lock className="w-3 h-3" />
              Private
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            {set.wordCount} từ
          </span>
        </div>
        {isMySet && set.accuracy > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              {set.accuracy}%
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-500">
          <GraduationCap className="w-4 h-4" />
          <span className="text-sm">{set.studyCount}</span>
        </div>
      </div>

      {/* Author (for public sets) */}
      {!isMySet && set.author && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Tác giả:</span> {set.author}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/vocabulary-set/${set.id}`}>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            <Play className="w-4 h-4" />
            Học ngay
          </button>
        </Link>

        {isMySet ? (
          <>
            <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        Tạo ngày {new Date(set.createdAt).toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({
  searchQuery,
  activeTab,
  onCreateNew,
}: {
  searchQuery: string;
  activeTab: string;
  onCreateNew: () => void;
}) {
  if (searchQuery) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy bộ từ nào
        </h3>
        <p className="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
      </div>
    );
  }

  if (activeTab === "my-sets") {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chưa có bộ từ nào
        </h3>
        <p className="text-gray-600 mb-6">
          Tạo bộ từ đầu tiên để bắt đầu học ngay!
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Tạo bộ từ mới
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Globe className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Chưa có bộ từ công khai
      </h3>
      <p className="text-gray-600">Hãy quay lại sau nhé!</p>
    </div>
  );
}
