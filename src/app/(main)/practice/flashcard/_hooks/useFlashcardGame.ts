import { useState, useCallback, useRef } from "react";
import type { FlashcardWord, CardResult, GameState } from "../_types";
import type {
  CompleteStudySessionResponse,
  RecordStudyRequest,
} from "@/types/flashcard";
import { flashcardApi } from "@/api/flashcardApi";
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
  sessionId: string | null;
  completionData: CompleteStudySessionResponse | null;
  isSubmitting: boolean;

  // Actions
  handleFlip: () => void;
  handleAnswer: (mastered: boolean) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleStart: () => Promise<void>;
  handleRestart: () => Promise<void>;
  handleExit: () => void;
  getElapsedTime: () => string;
}

export function useFlashcardGame({
  deckId,
  words,
}: UseFlashcardGameOptions): UseFlashcardGameReturn {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completionData, setCompletionData] =
    useState<CompleteStudySessionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track time spent per card
  const cardStartTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;
  const masteredCount = results.filter((r) => r.mastered).length;
  const difficultCount = results.filter((r) => !r.mastered).length;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleAnswer = useCallback(
    (mastered: boolean) => {
      if (!isFlipped || isSubmitting) return;

      const timeSpentMs = Date.now() - cardStartTimeRef.current;

      const result: CardResult = {
        cardId: currentWord.id,
        term: currentWord.word,
        mastered,
        timeSpentMs,
      };

      setResults((prev) => [...prev, result]);

      // Send record to API (fire-and-forget, don't block UI)
      if (sessionId) {
        const recordData: RecordStudyRequest = {
          card_id: currentWord.id,
          is_correct: mastered,
          is_memorized: mastered,
          time_spent_ms: timeSpentMs,
        };
        flashcardApi
          .recordStudy(deckId, sessionId, recordData)
          .catch((err) => console.error("Failed to record study:", err));
      }

      const isLastCard = currentIndex >= words.length - 1;

      if (!isLastCard) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
          cardStartTimeRef.current = Date.now();
        }, CARD_FLIP_DELAY_MS);
      } else {
        // Complete session
        setTimeout(async () => {
          if (sessionId) {
            setIsSubmitting(true);
            try {
              const data = await flashcardApi.completeStudySession(
                deckId,
                sessionId,
              );
              setCompletionData(data);
            } catch (err) {
              console.error("Failed to complete session:", err);
            } finally {
              setIsSubmitting(false);
            }
          }
          setGameState("results");
        }, CARD_FLIP_DELAY_MS);
      }
    },
    [isFlipped, isSubmitting, currentIndex, currentWord, words.length, sessionId, deckId],
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

  const startSession = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const session = await flashcardApi.startStudySession(deckId, {
        mode: "flashcard",
      });
      setSessionId(session.id);
      sessionStartTimeRef.current = Date.now();
      cardStartTimeRef.current = Date.now();
      setGameState("playing");
    } catch (err) {
      console.error("Failed to start study session:", err);
      // Fallback: start anyway without session tracking
      sessionStartTimeRef.current = Date.now();
      cardStartTimeRef.current = Date.now();
      setGameState("playing");
    } finally {
      setIsSubmitting(false);
    }
  }, [deckId]);

  const handleStart = useCallback(async () => {
    await startSession();
  }, [startSession]);

  const handleRestart = useCallback(async () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    setCompletionData(null);
    await startSession();
  }, [startSession]);

  const handleExit = useCallback(() => {
    // Navigate back to practice page
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  const getElapsedTime = useCallback(() => {
    const diff = Math.floor(
      (Date.now() - sessionStartTimeRef.current) / 1000,
    );
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
    sessionId,
    completionData,
    isSubmitting,
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
