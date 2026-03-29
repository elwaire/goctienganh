"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { vocabularyApi } from "@/api/vocabularyApi";
import { queryKeys } from "@/lib/queryKeys";
import type { VocabularyWord, CreateVocabularyWordRequest, CreateVocabularySetRequest } from "@/types/vocabulary";
import {
  DeckHeader,
  WordCard,
  WordFormModal,
  WordListEmptyState,
  StudyHistoryPanel,
  StudyStatsPanel,
  CreateDeckModal,
} from "../_components";
import { useSpeech } from "../_hooks";
import { ButtonPrimary } from "@/components/ui";

export default function VocabularySetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.slug as string;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [showWordModal, setShowWordModal] = useState(false);
  const [showEditDeckModal, setShowEditDeckModal] = useState(false);
  const [editingCard, setEditingCard] = useState<VocabularyWord | null>(null);

  const { speak } = useSpeech();

  // ─── Fetch deck + cards ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vocabularySets", "detail", deckId],
    queryFn: () => vocabularyApi.getSet(deckId),
    enabled: !!deckId,
  });

  // Study stats and history are currently not supported in new API.
  // We keep them as null for now or hide if they are missing.
  const studyStats: any = null;
  const historyData: any = null;

  // ─── Filtered cards ───
  const filteredCards = useMemo(() => {
    const cards = deckData?.words ?? [];
    if (!searchQuery) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(
      (c) =>
        c.term.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q),
    );
  }, [deckData?.words, searchQuery]);

  // ─── Mutations ───
  const createCardMutation = useMutation({
    mutationFn: (data: CreateVocabularyWordRequest) =>
      vocabularyApi.createWord(deckId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "detail", deckId],
      });
      setShowWordModal(false);
    },
  });

  const createBulkCardsMutation = useMutation({
    mutationFn: (data: CreateVocabularyWordRequest[]) =>
      vocabularyApi.createWordsBulk(deckId, { words: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "detail", deckId],
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
      data: Partial<CreateVocabularyWordRequest>;
    }) => vocabularyApi.updateWord(deckId, cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "detail", deckId],
      });
      setShowWordModal(false);
      setEditingCard(null);
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => vocabularyApi.deleteWord(deckId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "detail", deckId],
      });
    },
  });

  const updateDeckMutation = useMutation({
    mutationFn: (data: CreateVocabularySetRequest) => vocabularyApi.updateSet(deckId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "detail", deckId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets"],
      });
      setShowEditDeckModal(false);
    },
  });

  const deleteDeckMutation = useMutation({
    mutationFn: () => vocabularyApi.deleteSet(deckId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets"],
      });
      router.push("/vocabulary-set");
    },
  });

  const copyDeckMutation = useMutation({
    mutationFn: () => vocabularyApi.copySet(deckId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vocabularySets"] });
      router.push(`/vocabulary-set/${data.id}`);
    },
    onError: (err: unknown) => {
      const msg =
        err && typeof err === "object" && "response" in err
          ? String(
              (err as { response?: { data?: { message?: string } } }).response?.data
                ?.message ?? "",
            )
          : "";
      alert(msg || "Không thể sao chép bộ từ. Chỉ áp dụng với bộ công khai của người khác.");
    },
  });

  // ─── Handlers ───
  const handleOpenAddModal = () => {
    setEditingCard(null);
    setShowWordModal(true);
  };

  const handleOpenEditModal = (card: VocabularyWord) => {
    setEditingCard(card);
    setShowWordModal(true);
  };

  const handleSaveWord = (data: CreateVocabularyWordRequest) => {
    if (editingCard) {
      updateCardMutation.mutate({ cardId: editingCard.id, data });
    } else {
      createCardMutation.mutate(data);
    }
  };

  const handleSaveBulkWords = (data: CreateVocabularyWordRequest[]) => {
    createBulkCardsMutation.mutate(data);
  };

  const handleDeleteWord = (cardId: string) => {
    if (confirm("Bạn có chắc muốn xóa từ này?")) {
      deleteCardMutation.mutate(cardId);
    }
  };

  const handleEditDeck = () => {
    setShowEditDeckModal(true);
  };

  const handleSaveDeck = (data: {
    title: string;
    description: string;
    is_public: boolean;
  }) => {
    updateDeckMutation.mutate(data);
  };

  const handleDeleteDeck = () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xoá bộ từ này không? Hành động này không thể hoàn tác.",
      )
    ) {
      deleteDeckMutation.mutate();
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
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Deck Header */}
        <DeckHeader
          deck={deckData}
          stats={studyStats}
          onEditDeck={handleEditDeck}
          onDeleteDeck={handleDeleteDeck}
          onCopyToMyAccount={
            !deckData.is_owner && deckData.is_public
              ? () => copyDeckMutation.mutate()
              : undefined
          }
          copyLoading={copyDeckMutation.isPending}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Word List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toolbar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm từ vựng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-[44px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              {deckData.is_owner && (
                <ButtonPrimary
                  onClick={handleOpenAddModal}
                  variant="outline"
                  rounded="md"
                >
                  <Plus className="w-4 h-4" />
                  Thêm từ
                </ButtonPrimary>
              )}
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
            {historyData && <StudyHistoryPanel sessions={historyData?.sessions ?? []} />}
            {studyStats && <StudyStatsPanel stats={studyStats} />}
          </div>
        </div>
      </div>

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
          onSaveBulk={handleSaveBulkWords}
        />
      )}

      {/* Edit Deck Modal */}
      <CreateDeckModal
        isOpen={showEditDeckModal}
        isCreating={updateDeckMutation.isPending}
        editingDeck={
          deckData
            ? {
                title: deckData.title,
                description: deckData.description,
                is_public: deckData.is_public,
              }
            : undefined
        }
        onClose={() => setShowEditDeckModal(false)}
        onSave={handleSaveDeck}
      />
    </div>
  );
}
