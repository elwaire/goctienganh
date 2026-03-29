import { useState, useCallback, useRef } from "react";
import type { WritingMode } from "@/types/vocabulary";
import type { VocabularyWord } from "@/types/vocabulary";
import type {
  WritingQuestion,
  WritingResult,
  GameState,
} from "../_types";
import { generateQuestions, normalizeAnswer } from "../_types";

interface UseWritingGameOptions {
  deckId: string;
  cards: VocabularyWord[];
}

export function useWritingGame({ deckId, cards }: UseWritingGameOptions) {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [selectedMode, setSelectedMode] = useState<WritingMode | null>(null);
  const [questions, setQuestions] = useState<WritingQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<WritingResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const correctCount = results.filter((r) => r.correct).length;
  const wrongCount = results.filter((r) => !r.correct).length;

  const handleStart = useCallback(() => {
    if (!selectedMode) return;

    const generated = generateQuestions(cards, selectedMode);
    setQuestions(generated);

    sessionStartRef.current = Date.now();
    questionStartRef.current = Date.now();
    setGameState("playing");
  }, [selectedMode, cards]);

  const checkAnswer = useCallback(() => {
    if (!userAnswer.trim() || !currentQuestion) return;

    const normalized = normalizeAnswer(userAnswer);
    const correct = normalizeAnswer(currentQuestion.correctAnswer);
    const isAnswerCorrect = normalized === correct;
    const timeSpentMs = Date.now() - questionStartRef.current;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const result: WritingResult = {
      cardId: currentQuestion.card.id,
      term: currentQuestion.card.term,
      correct: isAnswerCorrect,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentQuestion.correctAnswer,
      timeSpentMs,
    };

    setResults((prev) => [...prev, result]);
  }, [userAnswer, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
      questionStartRef.current = Date.now();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setGameState("results");
    }
  }, [currentIndex, questions.length]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (showFeedback) {
        handleNext();
      } else {
        checkAnswer();
      }
    },
    [showFeedback, handleNext, checkAnswer],
  );

  const handleRestart = useCallback(() => {
    if (!selectedMode) return;

    const generated = generateQuestions(cards, selectedMode);
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswer("");
    setShowFeedback(false);
    setIsCorrect(false);
    setResults([]);

    sessionStartRef.current = Date.now();
    questionStartRef.current = Date.now();
    setGameState("playing");
  }, [selectedMode, cards]);

  const handleExit = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  const getElapsedTime = useCallback(() => {
    const diff = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  return {
    // State
    gameState,
    selectedMode,
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
    inputRef,

    // Actions
    setSelectedMode,
    setUserAnswer,
    handleStart,
    handleSubmit,
    handleRestart,
    handleExit,
    getElapsedTime,
  };
}
