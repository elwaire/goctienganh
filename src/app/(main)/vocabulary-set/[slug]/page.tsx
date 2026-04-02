"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  PenTool,
  Headphones,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { vocabularyApi } from "@/api/vocabularyApi";
import type {
  VocabularyWord,
  CreateVocabularyWordRequest,
  CreateVocabularySetRequest,
  UpdateVocabularySetRequest,
} from "@/types/vocabulary";
import {
  DeckHeader,
  ChildSetGrid,
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
  const t = useTranslations("vocabulary.detail");
  const tVocab = useTranslations("vocabulary");
  const router = useRouter();
  const params = useParams();
  const deckId = params.slug as string;
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [showWordModal, setShowWordModal] = useState(false);
  const [showEditDeckModal, setShowEditDeckModal] = useState(false);
  const [showCreateChildModal, setShowCreateChildModal] = useState(false);
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

  const { data: childListPayload, isPending: childListPending } = useQuery({
    queryKey: ["vocabularySets", "list", { parent_id: deckId }],
    queryFn: () =>
      vocabularyApi.getSets({ parent_id: deckId, page: 1, limit: 100 }),
    enabled: !!deckId,
  });

  const childSets = childListPayload?.sets ?? [];
  const useFolderLayout =
    childSets.length > 0 ||
    ((deckData?.child_count ?? 0) > 0 && childListPending);
  const folderLessonsLoading =
    (deckData?.child_count ?? 0) > 0 &&
    childListPending &&
    childSets.length === 0;

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
    mutationFn: (data: UpdateVocabularySetRequest) =>
      vocabularyApi.updateSet(deckId, data),
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

  const createChildMutation = useMutation({
    mutationFn: (data: CreateVocabularySetRequest) =>
      vocabularyApi.createSet({ ...data, parent_id: deckId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularySets"] });
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "list", { parent_id: deckId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["vocabularySets", "detail", deckId],
      });
      setShowCreateChildModal(false);
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

  /** Sao chép bộ đang mở (trang phần / lá — không dùng trên bộ cha có lưới phần). */
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
              (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message ?? "",
            )
          : "";
      alert(msg || t("copyError"));
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
    if (confirm(t("confirmDeleteWord"))) {
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
    if (confirm(t("confirmDeleteDeck"))) {
      deleteDeckMutation.mutate();
    }
  };

  // ─── Loading / Error ───
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">{t("loading")}</p>
      </div>
    );
  }

  if (isError || !deckData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">{t("notFound")}</p>
        <button
          onClick={() => router.push("/vocabulary-set")}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToList")}
        </button>
      </div>
    );
  }

  const wordListSection = (
    <>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 h-[44px] bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-sm"
          />
        </div>
        {deckData.is_owner && (
          <ButtonPrimary
            onClick={handleOpenAddModal}
            variant="outline"
            rounded="md"
          >
            <Plus className="w-4 h-4" />
            {t("addWord")}
          </ButtonPrimary>
        )}
      </div>
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
    </>
  );

  const folderSubtitle = useFolderLayout
    ? folderLessonsLoading && childSets.length === 0
      ? t("loadingLessons")
      : t("lessonCountSubtitle", {
          count: Math.max(childSets.length, deckData.child_count ?? 0),
        })
    : undefined;

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <button
          type="button"
          onClick={() => {
            const pid = deckData.parent_id;
            const href =
              pid != null && pid !== ""
                ? `/vocabulary-set/${encodeURIComponent(pid)}`
                : "/vocabulary-set";
            router.push(href);
          }}
          className="flex items-center cursor-pointer gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-6 text-sm font-semibold group"
        >
          <ArrowLeft className="w-4 h-4" />
          {tVocab("back")}
        </button>

        {useFolderLayout ? (
          <div className="flex flex-col lg:flex-row items-start gap-8 px-4 lg:px-0">
            {/* Child Sets - Left Column */}
            <div className="flex-1 min-w-0 w-full order-2 lg:order-1">
              <ChildSetGrid sets={childSets} isLoading={folderLessonsLoading} />

              {deckData.words.length > 0 && (
                <section className="mt-8 rounded-3xl border border-neutral-100 bg-white shadow-sm p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                    <h2 className="text-xl font-bold text-neutral-800">
                      {t("wordsInThisSet")}
                    </h2>
                  </div>
                  <div className="space-y-6">{wordListSection}</div>
                </section>
              )}
            </div>

            {/* Header / Sidebar - Right Column */}
            <aside className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2 space-y-6">
              <DeckHeader
                deck={deckData}
                stats={studyStats}
                subtitle={folderSubtitle}
                layout="sidebar"
                onEditDeck={handleEditDeck}
                onDeleteDeck={handleDeleteDeck}
                onCreateChild={
                  deckData.is_owner
                    ? () => setShowCreateChildModal(true)
                    : undefined
                }
              />
            </aside>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-8 px-4 lg:px-0">
            {/* Word List - Left Column */}
            <div className="flex-1 min-w-0 w-full order-2 lg:order-1 space-y-6">
              {wordListSection}
            </div>

            {/* Header & Stats - Right Column */}
            <aside className="w-full lg:w-[380px] shrink-0 order-1 lg:order-2 space-y-6">
              <DeckHeader
                deck={deckData}
                stats={studyStats}
                onEditDeck={handleEditDeck}
                onDeleteDeck={handleDeleteDeck}
                layout="sidebar"
                onCopyToMyAccount={
                  !deckData.is_owner && deckData.is_public
                    ? () => copyDeckMutation.mutate()
                    : undefined
                }
                copyLoading={copyDeckMutation.isPending}
              />

              {deckData.word_count > 0 && (
                <div className="bg-white rounded-2xl border-4 border-neutral-100 shadow-sm p-6 space-y-4 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-primary-500 rounded-full" />
                    <h3 className="text-lg font-semibold text-neutral-800  ">
                      {tVocab("activeLearning.title")}
                    </h3>
                  </div>

                  <div className="grid gap-2.5 mt-4">
                    {[
                      {
                        id: "writing",
                        name: "Writing & Memorization",
                        icon: <PenTool className="w-5 h-5" />,
                        path: "/practice/writing",
                        color: "text-emerald-600",
                        bgColor: "bg-emerald-50",
                        hoverBorder: "hover:border-emerald-400",
                        query: "?mode=random",
                      },
                      {
                        id: "listening",
                        name: "Listening and write words",
                        icon: <Headphones className="w-5 h-5" />,
                        path: "/practice/listening",
                        color: "text-amber-600",
                        bgColor: "bg-amber-50",
                        hoverBorder: "hover:border-amber-400",
                      },
                      {
                        id: "flashcard",
                        name: "Flashcard",
                        icon: <CreditCard className="w-5 h-5" />,
                        path: "/practice/flashcard",
                        color: "text-blue-600",
                        bgColor: "bg-blue-50",
                        hoverBorder: "hover:border-blue-400",
                      },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() =>
                          router.push(
                            `${mode.path}${mode.query || ""}${mode.query ? "&" : "?"}deckId=${deckData.id}`,
                          )
                        }
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-100 bg-white cursor-pointer  transition-all group ${mode.hoverBorder}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg ${mode.bgColor} ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          {mode.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-neutral-800 text-sm">
                            {mode.name}
                          </h4>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6 lg:sticky lg:top-4">
                {historyData && (
                  <StudyHistoryPanel sessions={historyData?.sessions ?? []} />
                )}
                {studyStats && <StudyStatsPanel stats={studyStats} />}
              </div>
            </aside>
          </div>
        )}
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

      <CreateDeckModal
        isOpen={showCreateChildModal}
        isCreating={createChildMutation.isPending}
        onClose={() => setShowCreateChildModal(false)}
        onSave={(data) => createChildMutation.mutate(data)}
      />
    </div>
  );
}
