"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { vocabularyApi } from "@/api/vocabularyApi";
import { queryKeys } from "@/lib/queryKeys";
import { DeckCard, CreateDeckModal, DeckListEmptyState } from "./_components";
import { ButtonPrimary } from "@/components/ui";
import { useDebounce } from "./_hooks";

export default function VocabularySetPage() {
  const tl = useTranslations("vocabulary.list");
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"my-sets" | "public">("my-sets");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  // ─── Fetch deck list ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "vocabularySets",
      "list",
      { search: debouncedSearch || undefined },
    ],
    queryFn: () =>
      vocabularyApi.getSets({ search: debouncedSearch || undefined }),
  });

  const allDecks = deckData?.sets ?? [];

  // Filter by tab
  const filteredDecks =
    activeTab === "my-sets"
      ? allDecks.filter((d) => d.is_owner)
      : allDecks.filter((d) => d.is_public && !d.is_owner);

  const myCount = allDecks.filter((d) => d.is_owner).length;
  const publicCount = allDecks.filter((d) => d.is_public && !d.is_owner).length;

  const createMutation = useMutation({
    mutationFn: vocabularyApi.createSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularySets"] });
      setShowCreateModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vocabularyApi.deleteSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularySets"] });
    },
  });

  const handleDeleteDeck = (deckId: string) => {
    if (confirm(tl("confirmDelete"))) {
      deleteMutation.mutate(deckId);
    }
  };

  // ─── Error state ───

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">{tl("loadError")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                {tl("title")}
              </h1>
              <p className="text-neutral-500">{tl("subtitle")}</p>
            </div>
            <ButtonPrimary
              onClick={() => setShowCreateModal(true)}
              variant="outline"
              rounded="md"
            >
              <Plus className="w-5 h-5" />
              {tl("createNew")}
            </ButtonPrimary>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 max-w-[560px] relative">
            <Search className=" w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={tl("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            {tl("tabMy")} ({myCount})
          </button>
          <button
            onClick={() => setActiveTab("public")}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === "public"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tl("tabPublic")} ({publicCount})
          </button>
        </div>

        {/* Deck Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-neutral-400">{tl("loading")}</p>
          </div>
        ) : filteredDecks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} onDelete={handleDeleteDeck} />
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
        onSave={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
