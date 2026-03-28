import { useState, useCallback, useRef } from "react";
import type { CardResponse } from "@/types/flashcard";
import { flashcardApi } from "@/api/flashcardApi";
import type {
  ListeningQuestion,
  ListeningResult,
  GameState,
} from "../_types";
import { generateListeningQuestions, normalizeAnswer } from "../_types";

interface UseListeningGameOptions {
  deckId: string;
  cards: CardResponse[];
}

export function useListeningGame({ deckId, cards }: UseListeningGameOptions) {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<ListeningResult[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const correctCount = results.filter((r) => r.correct).length;
  const wrongCount = results.filter((r) => !r.correct).length;

  // ─── Audio ───
  const playAudio = useCallback(
    (text: string, lang: "en" | "vi" = "en") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window))
        return;
      speechSynthesis.cancel();
      setIsPlaying(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : "vi-VN";
      utterance.rate = 0.7;
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayed(true);
      };
      utterance.onerror = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    },
    [],
  );

  const playCurrentAudio = useCallback(() => {
    if (currentQuestion) {
      playAudio(currentQuestion.audioText, currentQuestion.audioLang);
    }
  }, [currentQuestion, playAudio]);

  // ─── Start ───
  const handleStart = useCallback(async () => {
    const generated = generateListeningQuestions(cards);
    setQuestions(generated);

    try {
      setIsSubmitting(true);
      const session = await flashcardApi.startStudySession(deckId, {
        mode: "listening",
      });
      setSessionId(session.id);
    } catch (err) {
      console.error("Failed to start session:", err);
    } finally {
      setIsSubmitting(false);
    }

    sessionStartRef.current = Date.now();
    questionStartRef.current = Date.now();
    setGameState("playing");
  }, [cards, deckId]);

  // ─── Check answer ───
  const checkAnswer = useCallback(() => {
    if (!userAnswer.trim() || !currentQuestion) return;

    const normalized = normalizeAnswer(userAnswer);
    const correct = normalizeAnswer(currentQuestion.correctAnswer);
    const isAnswerCorrect = normalized === correct;
    const timeSpentMs = Date.now() - questionStartRef.current;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const result: ListeningResult = {
      cardId: currentQuestion.card.id,
      term: currentQuestion.card.term,
      correct: isAnswerCorrect,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentQuestion.correctAnswer,
      timeSpentMs,
    };
    setResults((prev) => [...prev, result]);

    // Record to API (fire-and-forget)
    if (sessionId) {
      flashcardApi
        .recordStudy(deckId, sessionId, {
          card_id: currentQuestion.card.id,
          is_correct: isAnswerCorrect,
          time_spent_ms: timeSpentMs,
        })
        .catch((err) => console.error("Failed to record:", err));
    }
  }, [userAnswer, currentQuestion, sessionId, deckId]);

  // ─── Next / Complete ───
  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
      setHasPlayed(false);
      questionStartRef.current = Date.now();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      if (sessionId) {
        flashcardApi
          .completeStudySession(deckId, sessionId)
          .catch((err) => console.error("Failed to complete:", err));
      }
      setGameState("results");
    }
  }, [currentIndex, questions.length, sessionId, deckId]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (showFeedback) handleNext();
      else checkAnswer();
    },
    [showFeedback, handleNext, checkAnswer],
  );

  // ─── Restart ───
  const handleRestart = useCallback(async () => {
    const generated = generateListeningQuestions(cards);
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswer("");
    setShowFeedback(false);
    setIsCorrect(false);
    setResults([]);
    setHasPlayed(false);

    try {
      setIsSubmitting(true);
      const session = await flashcardApi.startStudySession(deckId, {
        mode: "listening",
      });
      setSessionId(session.id);
    } catch (err) {
      console.error("Failed to start session:", err);
    } finally {
      setIsSubmitting(false);
    }

    sessionStartRef.current = Date.now();
    questionStartRef.current = Date.now();
    setGameState("playing");
  }, [cards, deckId]);

  const handleExit = useCallback(() => {
    if (typeof window !== "undefined") window.history.back();
  }, []);

  const getElapsedTime = useCallback(() => {
    const diff = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    gameState,
    questions,
    currentIndex,
    currentQuestion,
    userAnswer,
    showFeedback,
    isCorrect,
    results,
    progress,
    correctCount,
    wrongCount,
    isSubmitting,
    isPlaying,
    hasPlayed,
    inputRef,

    setUserAnswer,
    handleStart,
    handleSubmit,
    handleRestart,
    handleExit,
    playCurrentAudio,
    playAudio,
    getElapsedTime,
  };
}
