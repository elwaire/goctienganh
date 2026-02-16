"use client";

import { useState, useCallback, useEffect } from "react";
import { Flashcard, CardStatus, StudyStats } from "../types";

type UseStudySessionProps = {
  cards: Flashcard[];
  onComplete: () => void;
};

export function useStudySession({ cards, onComplete }: UseStudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatuses, setCardStatuses] = useState<Record<string, CardStatus>>(
    {},
  );
  const [streak, setStreak] = useState(0);

  const currentCard = cards[currentIndex] || null;

  // Calculate stats
  const stats: StudyStats = {
    known: Object.values(cardStatuses).filter((s) => s === "known").length,
    learning: Object.values(cardStatuses).filter((s) => s === "learning")
      .length,
    total: cards.length,
    progress: (Object.keys(cardStatuses).length / cards.length) * 100,
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang focus vào input hoặc textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "1":
          if (isFlipped) markAsKnown();
          break;
        case "2":
          if (isFlipped) markAsLearning();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, currentIndex]);

  const flip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const moveToNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete();
      }
    }, 200);
  }, [currentIndex, cards.length, onComplete]);

  const markAsKnown = useCallback(() => {
    if (!currentCard) return;
    setCardStatuses((prev) => ({ ...prev, [currentCard.id]: "known" }));
    setStreak((prev) => prev + 1);
    moveToNext();
  }, [currentCard, moveToNext]);

  const markAsLearning = useCallback(() => {
    if (!currentCard) return;
    setCardStatuses((prev) => ({ ...prev, [currentCard.id]: "learning" }));
    setStreak(0);
    moveToNext();
  }, [currentCard, moveToNext]);

  const goToNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  }, [currentIndex, cards.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  }, [currentIndex]);

  const goToCard = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCardStatuses({});
    setStreak(0);
  }, []);

  return {
    currentCard,
    currentIndex,
    isFlipped,
    streak,
    stats,
    cardStatuses,
    flip,
    markAsKnown,
    markAsLearning,
    goToNext,
    goToPrevious,
    goToCard,
    reset,
  };
}
