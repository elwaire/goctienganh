// components/pages/flashcards/CollectionDetailPage.tsx

"use client";

import { BookOpen, Play, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Loading, TitleScreen } from "@/components/common";
import {
  AddCardForm,
  CardItem,
  CompletionScreen,
  StudyMode,
} from "@/components/pages/flashcards";
import { Back, Badge, ButtonPrimary, EmptyState } from "@/components/ui";
import { COLLECTION_COLORS } from "@/constants";
import { useTranslation } from "@/context";
import { useCollections, useStudySession } from "@/hooks";
import { Collection, FlashcardFormData, ViewMode } from "@/types";

type CollectionDetailPageProps = {
  collectionId: string;
};

export function CollectionDetailPage({
  collectionId,
}: CollectionDetailPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    collections,
    isLoading,
    getCollection,
    addCard,
    deleteCard,
    updateLastStudied,
  } = useCollections();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Track nếu đã xử lý study mode từ URL
  const hasHandledStudyMode = useRef(false);

  // Lấy collection data
  useEffect(() => {
    if (!isLoading) {
      const col = getCollection(collectionId);
      if (col) {
        setCollection(col);
      } else {
        router.push("/flashcards");
      }
    }
  }, [isLoading, collectionId, getCollection, collections, router]);

  // Study session - dùng collection.cards thực tế
  const studySession = useStudySession({
    cards: collection?.cards || [],
    onComplete: () => {
      setViewMode("complete");
      updateLastStudied(collectionId);
    },
  });

  // Check nếu vào thẳng study mode - chỉ chạy 1 lần khi collection đã load
  useEffect(() => {
    if (
      !hasHandledStudyMode.current &&
      collection &&
      collection.cards.length > 0 &&
      searchParams.get("mode") === "study"
    ) {
      hasHandledStudyMode.current = true;
      studySession.reset();
      setViewMode("study");

      // Xóa query param để tránh trigger lại
      router.replace(`/flashcards/${collectionId}`, { scroll: false });
    }
  }, [collection, searchParams, collectionId, router, studySession]);

  // Handlers
  const handleBack = () => {
    router.push("/flashcards");
  };

  const handleStartStudy = () => {
    if (!collection || collection.cards.length === 0) return;
    studySession.reset();
    setViewMode("study");
  };

  const handleStudyAgain = () => {
    studySession.reset();
    setViewMode("study");
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  const handleAddCard = (data: FlashcardFormData) => {
    const success = addCard(collectionId, data);
    if (success) {
      setIsAddingCard(false);
    }
    return success;
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(collectionId, cardId);
  };

  // Loading
  if (isLoading || !collection) {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const colors = COLLECTION_COLORS[collection.color];

  // Completion Screen
  if (viewMode === "complete") {
    return (
      <CompletionScreen
        stats={studySession.stats}
        onStudyAgain={handleStudyAgain}
        onBackToList={handleBackToList}
      />
    );
  }

  // Study Mode
  if (viewMode === "study" && studySession.currentCard) {
    return (
      <StudyMode
        cards={collection.cards}
        currentCard={studySession.currentCard}
        currentIndex={studySession.currentIndex}
        isFlipped={studySession.isFlipped}
        streak={studySession.streak}
        progress={studySession.stats.progress}
        cardStatuses={studySession.cardStatuses}
        onFlip={studySession.flip}
        onKnown={studySession.markAsKnown}
        onLearning={studySession.markAsLearning}
        onNext={studySession.goToNext}
        onPrevious={studySession.goToPrevious}
        onGoToCard={studySession.goToCard}
        onExit={handleBackToList}
      />
    );
  }

  // List Mode
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* Back button */}
        <Back onExit={handleBack} className="mb-6" />

        {/* Collection info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bgLight}`}
            >
              <BookOpen className={`w-7 h-7 ${colors.text}`} />
            </div>
            <div className="flex flex-col gap-1 justify-start items-start">
              <TitleScreen title={collection.name} />
              <Badge rounded>
                {collection.cards.length}{" "}
                {t("flashcards.detailCollection.head.badge")}
              </Badge>
            </div>
          </div>

          {collection.cards.length > 0 && (
            <ButtonPrimary
              onClick={handleStartStudy}
              leftIcon={<Play className="w-4 h-4" />}
            >
              {t("flashcards.detailCollection.head.studyNow")}
            </ButtonPrimary>
          )}
        </div>

        {collection.description && (
          <p className="text-neutral-600 mt-4">{collection.description}</p>
        )}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => setIsAddingCard(true)}
        className="w-full mb-8 p-4 border-2 cursor-pointer border-dashed border-neutral-300 hover:border-primary-400 rounded-2xl flex items-center justify-center gap-2 text-neutral-500 hover:text-primary-500 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">
          {t("flashcards.detailCollection.head.addCard")}
        </span>
      </button>

      {/* Add Card Form */}
      {isAddingCard && (
        <AddCardForm
          onAdd={handleAddCard}
          onCancel={() => setIsAddingCard(false)}
        />
      )}

      {/* Empty State */}
      {collection.cards.length === 0 && !isAddingCard && (
        <EmptyState
          onClick={() => setIsAddingCard(true)}
          icon={<BookOpen className="w-10 h-10 text-blue-500" />}
          title={t("flashcards.detailCollection.emptyState.title")}
          description={t("flashcards.detailCollection.emptyState.description")}
          buttonText={t("flashcards.detailCollection.emptyState.button")}
        />
      )}

      {/* Cards List */}
      {collection.cards.length > 0 && (
        <div className="space-y-4 ">
          {collection.cards.map((card) => (
            <CardItem key={card.id} card={card} onDelete={handleDeleteCard} />
          ))}
        </div>
      )}
    </div>
  );
}
