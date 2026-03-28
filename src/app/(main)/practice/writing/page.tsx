"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { flashcardApi } from "@/api/flashcardApi";
import { queryKeys } from "@/lib/queryKeys";
import { useWritingGame } from "./_hooks";
import {
  WritingIntroScreen,
  WritingPlayingScreen,
  WritingResultsScreen,
} from "./_components";

export default function WritingPage() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");

  // ─── Fetch deck data ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.flashcardDecks.detail(deckId ?? ""),
    queryFn: () => flashcardApi.getDeck(deckId!),
    enabled: !!deckId,
  });

  const game = useWritingGame({
    deckId: deckId ?? "",
    cards: deckData?.cards ?? [],
  });

  // Auto-focus input on game state changes
  useEffect(() => {
    if (game.gameState === "playing" && !game.showFeedback) {
      game.inputRef.current?.focus();
    }
  }, [game.gameState, game.currentIndex, game.showFeedback]);

  // ─── Loading / Error ───
  if (!deckId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          Thiếu deckId. Hãy chọn bộ từ từ trang Luyện tập.
        </p>
        <a
          href="/practice"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang luyện tập
        </a>
      </div>
    );
  }

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
        <a
          href="/practice"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang luyện tập
        </a>
      </div>
    );
  }

  // Speech helper
  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // ─── Intro Screen ───
  if (game.gameState === "intro") {
    return (
      <WritingIntroScreen
        deck={deckData}
        cardCount={deckData.cards.length}
        selectedMode={game.selectedMode}
        isStarting={game.isSubmitting}
        onSelectMode={game.setSelectedMode}
        onStart={game.handleStart}
      />
    );
  }

  // ─── Results Screen ───
  if (game.gameState === "results") {
    return (
      <WritingResultsScreen
        mode={game.selectedMode}
        correctCount={game.correctCount}
        wrongCount={game.wrongCount}
        totalCount={game.questions.length}
        elapsedTime={game.getElapsedTime()}
        results={game.results}
        isRestarting={game.isSubmitting}
        onRestart={game.handleRestart}
        onExit={game.handleExit}
      />
    );
  }

  // ─── Playing Screen ───
  if (!game.currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <WritingPlayingScreen
      currentIndex={game.currentIndex}
      totalCount={game.questions.length}
      progress={game.progress}
      correctCount={game.correctCount}
      wrongCount={game.wrongCount}
      question={game.currentQuestion}
      userAnswer={game.userAnswer}
      showFeedback={game.showFeedback}
      isCorrect={game.isCorrect}
      inputRef={game.inputRef}
      onAnswerChange={game.setUserAnswer}
      onSubmit={game.handleSubmit}
      onSpeak={handleSpeak}
      onExit={game.handleExit}
    />
  );
}
