"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { vocabularyApi } from "@/api/vocabularyApi";
import { queryKeys } from "@/lib/queryKeys";
import { toFlashcardWord } from "./_types";
import { useFlashcardGame, useKeyboardShortcuts, useSpeech } from "./_hooks";
import { IntroScreen, ResultsScreen, PlayingScreen } from "./_components";

export default function FlashcardPage() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId") ?? "";

  // ─── Fetch deck data ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vocabularySets", "detail", deckId],
    queryFn: () => vocabularyApi.getSet(deckId),
    enabled: !!deckId,
  });

  // Convert API cards → view-model
  const words = useMemo(
    () => (deckData?.words ?? []).map(toFlashcardWord),
    [deckData?.words],
  );

  // ─── Hooks ───
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { speak } = useSpeech();

  const game = useFlashcardGame({ deckId, words });

  const { pressedKey } = useKeyboardShortcuts({
    enabled: game.gameState === "playing",
    onFlip: game.handleFlip,
    onPrevious: game.handlePrevious,
    onNext: game.handleNext,
    onAnswer: game.handleAnswer,
    onSpeak: speak,
    onExit: game.handleExit,
    onShowShortcuts: () => setShowShortcuts(true),
    currentWord: game.currentWord,
  });

  // ─── Loading State ───
  if (!deckId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          Thiếu thông tin bộ thẻ. Vui lòng chọn bộ thẻ để bắt đầu.
        </p>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">Đang tải bộ thẻ...</p>
      </div>
    );
  }

  if (isError || !deckData || words.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          {!deckData
            ? "Không tìm thấy bộ thẻ."
            : "Bộ thẻ chưa có thẻ nào."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
      </div>
    );
  }

  // ─── Screens ───
  if (game.gameState === "intro") {
    return (
      <IntroScreen
        deck={deckData}
        cardCount={words.length}
        isStarting={false}
        onStart={game.handleStart}
      />
    );
  }

  if (game.gameState === "results") {
    return (
      <ResultsScreen
        masteredCount={game.masteredCount}
        difficultCount={game.difficultCount}
        totalCount={words.length}
        elapsedTime={game.getElapsedTime()}
        results={game.results}
        onRestart={game.handleRestart}
        onExit={game.handleExit}
      />
    );
  }

  return (
    <PlayingScreen
      words={words}
      currentIndex={game.currentIndex}
      currentWord={game.currentWord}
      isFlipped={game.isFlipped}
      progress={game.progress}
      masteredCount={game.masteredCount}
      difficultCount={game.difficultCount}
      pressedKey={pressedKey}
      showShortcuts={showShortcuts}
      onFlip={game.handleFlip}
      onAnswer={game.handleAnswer}
      onPrevious={game.handlePrevious}
      onNext={game.handleNext}
      onSpeak={speak}
      onExit={game.handleExit}
      onToggleShortcuts={setShowShortcuts}
    />
  );
}
