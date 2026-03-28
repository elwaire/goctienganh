"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { flashcardApi } from "@/api/flashcardApi";
import { queryKeys } from "@/lib/queryKeys";
import {
  DeckCard,
  CreateDeckModal,
  DeckListEmptyState,
} from "./_components";

export default function VocabularySetPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"my-sets" | "public">("my-sets");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ─── Fetch deck list ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.flashcardDecks.list({ search: searchQuery || undefined }),
    queryFn: () => flashcardApi.getDecks({ search: searchQuery || undefined }),
  });

  const allDecks = deckData?.decks ?? [];

  // Filter by tab
  const filteredDecks =
    activeTab === "my-sets"
      ? allDecks.filter((d) => d.is_owner)
      : allDecks.filter((d) => d.is_public && !d.is_owner);

  const myCount = allDecks.filter((d) => d.is_owner).length;
  const publicCount = allDecks.filter((d) => d.is_public && !d.is_owner).length;

  // ─── Create deck mutation ───
  const createMutation = useMutation({
    mutationFn: flashcardApi.createDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.flashcardDecks.all });
      setShowCreateModal(false);
    },
  });

  // ─── Delete deck mutation ───
  const deleteMutation = useMutation({
    mutationFn: flashcardApi.deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.flashcardDecks.all });
    },
  });

  const handleDeleteDeck = (deckId: string) => {
    if (confirm("Bạn có chắc muốn xóa bộ từ này?")) {
      deleteMutation.mutate(deckId);
    }
  };

  // ─── Loading / Error states ───
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">Đang tải bộ từ...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">Không thể tải danh sách bộ từ.</p>
      </div>
    );
  }

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

          {/* Search & Filter */}
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
            Của tôi ({myCount})
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "public"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Công khai ({publicCount})
          </button>
        </div>

        {/* Deck Grid */}
        {filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onDelete={handleDeleteDeck}
              />
            ))}
          </div>
        ) : (
          <DeckListEmptyState
            searchQuery={searchQuery}
            activeTab={activeTab}
            onCreateNew={() => setShowCreateModal(true)}
          />
        )}
      </div>

      {/* Create Modal */}
      <CreateDeckModal
        isOpen={showCreateModal}
        isCreating={createMutation.isPending}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
