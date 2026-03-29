import { useState, useCallback, useRef, useEffect } from "react";
import type { FlashcardWord, CardResult, GameState } from "../_types";
import { CARD_FLIP_DELAY_MS } from "../_constants";

interface UseFlashcardGameOptions {
  deckId: string;
  words: FlashcardWord[];
}

interface UseFlashcardGameReturn {
  // State
  gameState: GameState;
  currentIndex: number;
  isFlipped: boolean;
  results: CardResult[];
  currentWord: FlashcardWord;
  progress: number;
  masteredCount: number;
  difficultCount: number;

  // Actions
  handleFlip: () => void;
  handleAnswer: (mastered: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleStart: () => void;
  handleRestart: () => void;
  handleExit: () => void;
  getElapsedTime: () => string;
}

export function useFlashcardGame({
  deckId,
  words,
}: UseFlashcardGameOptions): UseFlashcardGameReturn {
  const [gameState, setGameState] = useState<GameState>("playing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);

  // Track time spent per card
  const cardStartTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());

  const currentWord = words[currentIndex] || null;
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;
  const masteredCount = results.filter((r) => r.mastered).length;
  const difficultCount = results.filter((r) => !r.mastered).length;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleAnswer = useCallback(
    (mastered: boolean) => {
      if (!isFlipped) return;

      const timeSpentMs = Date.now() - cardStartTimeRef.current;

      const result: CardResult = {
        cardId: currentWord.id,
        term: currentWord.word,
        mastered,
        timeSpentMs,
      };

      setResults((prev) => [...prev, result]);

      const isLastCard = currentIndex >= words.length - 1;

      if (!isLastCard) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
          cardStartTimeRef.current = Date.now();
        }, CARD_FLIP_DELAY_MS);
      } else {
        // Complete session
        setTimeout(() => {
          setGameState("results");
        }, CARD_FLIP_DELAY_MS);
      }
    },
    [isFlipped, currentIndex, currentWord, words.length],
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setResults((prev) => prev.slice(0, -1));
      cardStartTimeRef.current = Date.now();
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1 && !isFlipped) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      cardStartTimeRef.current = Date.now();
    }
  }, [currentIndex, words.length, isFlipped]);

  const handleStart = useCallback(() => {
    sessionStartTimeRef.current = Date.now();
    cardStartTimeRef.current = Date.now();
    setGameState("playing");
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    sessionStartTimeRef.current = Date.now();
    cardStartTimeRef.current = Date.now();
    setGameState("playing");
  }, []);

  const handleExit = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  const getElapsedTime = useCallback(() => {
    const diff = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    gameState,
    currentIndex,
    isFlipped,
    results,
    currentWord,
    progress,
    masteredCount,
    difficultCount,
    handleFlip,
    handleAnswer,
    handlePrevious,
    handleNext,
    handleStart,
    handleRestart,
    handleExit,
    getElapsedTime,
  };
}
