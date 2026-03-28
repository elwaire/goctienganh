"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { flashcardApi } from "@/api/flashcardApi";
import { queryKeys } from "@/lib/queryKeys";
import type { CardResponse, CreateCardRequest } from "@/types/flashcard";
import {
  DeckHeader,
  WordCard,
  WordFormModal,
  WordListEmptyState,
  GameModeModal,
  StudyHistoryPanel,
  StudyStatsPanel,
} from "../_components";
import { useSpeech } from "../_hooks";

export default function VocabularySetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.slug as string;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [showWordModal, setShowWordModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CardResponse | null>(null);

  const { speak } = useSpeech();

  // ─── Fetch deck + cards ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.flashcardDecks.detail(deckId),
    queryFn: () => flashcardApi.getDeck(deckId),
    enabled: !!deckId,
  });

  // ─── Fetch study stats ───
  const { data: studyStats } = useQuery({
    queryKey: queryKeys.flashcardDecks.studyStats(deckId),
    queryFn: () => flashcardApi.getStudyStats(deckId),
    enabled: !!deckId,
  });

  // ─── Fetch study history ───
  const { data: historyData } = useQuery({
    queryKey: queryKeys.flashcardDecks.studyHistory(deckId),
    queryFn: () => flashcardApi.getStudyHistory(deckId),
    enabled: !!deckId,
  });

  // ─── Filtered cards ───
  const filteredCards = useMemo(() => {
    const cards = deckData?.cards ?? [];
    if (!searchQuery) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(
      (c) =>
        c.term.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q),
    );
  }, [deckData?.cards, searchQuery]);

  // ─── Mutations ───
  const createCardMutation = useMutation({
    mutationFn: (data: CreateCardRequest) =>
      flashcardApi.createCard(deckId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.flashcardDecks.detail(deckId),
      });
      setShowWordModal(false);
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
      data: Partial<CreateCardRequest>;
    }) => flashcardApi.updateCard(deckId, cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.flashcardDecks.detail(deckId),
      });
      setShowWordModal(false);
      setEditingCard(null);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => flashcardApi.deleteCard(deckId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.flashcardDecks.detail(deckId),
      });
    },
  });

  // ─── Handlers ───
  const handleOpenAddModal = () => {
    setEditingCard(null);
    setShowWordModal(true);
  };

  const handleOpenEditModal = (card: CardResponse) => {
    setEditingCard(card);
    setShowWordModal(true);
  };

  const handleSaveWord = (data: CreateCardRequest) => {
    if (editingCard) {
      updateCardMutation.mutate({ cardId: editingCard.id, data });
    } else {
      createCardMutation.mutate(data);
    }
  };

  const handleDeleteWord = (cardId: string) => {
    if (confirm("Bạn có chắc muốn xóa từ này?")) {
      deleteCardMutation.mutate(cardId);
    }
  };

  // ─── Loading / Error ───
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">Đang tải bộ từ...</p>
      </div>
    );
  }

  if (isError || !deckData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">Không tìm thấy bộ từ.</p>
        <button
          onClick={() => router.push("/vocabulary-set")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Deck Header */}
        <DeckHeader
          deck={deckData}
          stats={studyStats}
          onStartGame={() => setShowGameModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Word List */}
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
                {deckData.is_owner && (
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm từ
                  </button>
                )}
              </div>
            </div>

            {/* Words */}
            <div className="space-y-3">
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <WordCard
                    key={card.id}
                    card={card}
                    isOwner={deckData.is_owner}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteWord}
                    onSpeak={speak}
                  />
                ))
              ) : (
                <WordListEmptyState
                  searchQuery={searchQuery}
                  onAddWord={handleOpenAddModal}
                />
              )}
            </div>
          </div>

          {/* Right — Stats & History */}
          <div className="space-y-6">
            <StudyHistoryPanel sessions={historyData?.sessions ?? []} />
            <StudyStatsPanel stats={studyStats} />
          </div>
        </div>
      </div>

      {/* Game Mode Modal */}
      <GameModeModal
        isOpen={showGameModal}
        deckId={deckId}
        deckTitle={deckData.title}
        cardCount={deckData.cards.length}
        onClose={() => setShowGameModal(false)}
      />

      {/* Word Add/Edit Modal */}
      {showWordModal && (
        <WordFormModal
          isOpen={showWordModal}
          editingCard={editingCard}
          onClose={() => {
            setShowWordModal(false);
            setEditingCard(null);
          }}
          onSave={handleSaveWord}
        />
      )}
    </div>
  );
}
