"use client";

import { vocabularyApi } from "@/api/vocabularyApi";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  ListeningPlayingScreen,
  ListeningResultsScreen,
} from "./_components";
import { useListeningGame } from "./_hooks";

export default function ListeningPage() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");

  // ─── Fetch deck data ───
  const {
    data: deckData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["vocabularySets", "detail", deckId ?? ""],
    queryFn: () => vocabularyApi.getSet(deckId!),
    enabled: !!deckId,
  });

  const game = useListeningGame({
    deckId: deckId ?? "",
    cards: deckData?.words ?? [],
  });

  // Auto-focus input on game state changes
  useEffect(() => {
    if (game.gameState === "playing" && !game.showFeedback) {
      game.inputRef.current?.focus();
    }
  }, [game.gameState, game.currentIndex, game.showFeedback]);

  // Auto-play audio for new questions
  useEffect(() => {
    if (
      game.gameState === "playing" &&
      !game.showFeedback &&
      !game.hasPlayed &&
      game.currentQuestion
    ) {
      const timer = setTimeout(() => {
        game.playCurrentAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [game.currentIndex, game.gameState, game.showFeedback, game.hasPlayed]);

  // Keyboard shortcut: S to replay audio
  useEffect(() => {
    if (game.gameState !== "playing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "s" &&
        !game.showFeedback &&
        document.activeElement !== game.inputRef.current
      ) {
        e.preventDefault();
        game.playCurrentAudio();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [game.gameState, game.showFeedback]);

  // ─── Loading / Error ───
  if (!deckId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">
          Thiếu deckId. Hãy chọn bộ từ từ trang Luyện tập.
        </p>
        <a
          href="/vocabulary-set"
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
          href="/vocabulary-set"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang luyện tập
        </a>
      </div>
    );
  }

  // ─── Screens ───
  if (game.gameState === "results") {
    return (
      <ListeningResultsScreen
        correctCount={game.correctCount}
        wrongCount={game.wrongCount}
        totalCount={game.questions.length}
        elapsedTime={game.getElapsedTime()}
        results={game.results}
        onRestart={game.handleRestart}
        onExit={game.handleExit}
      />
    );
  }

  if (!game.currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <ListeningPlayingScreen
      currentIndex={game.currentIndex}
      totalCount={game.questions.length}
      progress={game.progress}
      correctCount={game.correctCount}
      wrongCount={game.wrongCount}
      question={game.currentQuestion}
      userAnswer={game.userAnswer}
      showFeedback={game.showFeedback}
      isCorrect={game.isCorrect}
      isPlaying={game.isPlaying}
      inputRef={game.inputRef}
      onAnswerChange={game.setUserAnswer}
      onSubmit={game.handleSubmit}
      onPlayAudio={game.playCurrentAudio}
      onExit={game.handleExit}
    />
  );
}
