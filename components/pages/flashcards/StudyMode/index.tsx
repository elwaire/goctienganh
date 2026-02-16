"use client";

import { Indicators, ProgressBar } from "@/components/ui";
import { speakWord } from "@/services/dictionary";
import { CardStatus, Flashcard } from "@/types";
import FlashcardDisplay from "./FlashcardDisplay";
import KeyboardHints from "./KeyboardHints";
import StudyHeader from "./StudyHeader";
import StudyModeActionButtons from "./StudyModeActionButtons";

type StudyModeProps = {
  cards: Flashcard[];
  currentCard: Flashcard;
  currentIndex: number;
  isFlipped: boolean;
  streak: number;
  progress: number;
  cardStatuses: Record<string, CardStatus>;
  onFlip: () => void;
  onKnown: () => void;
  onLearning: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onGoToCard: (index: number) => void;
  onExit: () => void;
};

export function StudyMode({
  cards,
  currentCard,
  currentIndex,
  isFlipped,
  streak,
  progress,
  onFlip,
  onKnown,
  onLearning,
  onNext,
  onPrevious,
  onGoToCard,
  onExit,
}: StudyModeProps) {
  return (
    <div className="min-h-[calc(100vh-2rem)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <StudyHeader
          currentIndex={currentIndex}
          total={cards.length}
          streak={streak}
          onExit={onExit}
        />

        {/* Progress Bar */}
        <ProgressBar progress={progress} className="mb-8" />

        {/* Flashcard */}
        <FlashcardDisplay
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={onFlip}
          onSpeak={speakWord}
        />

        {/* Action Buttons */}
        <StudyModeActionButtons
          isFlipped={isFlipped}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < cards.length - 1}
          onFlip={onFlip}
          onKnown={onKnown}
          onLearning={onLearning}
          onNext={onNext}
          onPrevious={onPrevious}
        />

        {/* Keyboard Hints */}
        <KeyboardHints isFlipped={isFlipped} />

        {/* Card Indicators */}
        <Indicators
          items={cards}
          activeIndex={currentIndex}
          onSelect={onGoToCard}
          variant="dots"
          size="md"
          className="mt-8"
        />
      </div>
    </div>
  );
}
