import { useState, useEffect, useCallback } from "react";
import type { FlashcardWord } from "../_types";
import { KEY_FEEDBACK_DELAY_MS } from "../_constants";

interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  onFlip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onAnswer: (mastered: boolean) => void;
  onSpeak: (text: string) => void;
  onExit: () => void;
  onShowShortcuts: () => void;
  currentWord: FlashcardWord | undefined;
}

export function useKeyboardShortcuts({
  enabled,
  onFlip,
  onPrevious,
  onNext,
  onAnswer,
  onSpeak,
  onExit,
  onShowShortcuts,
  currentWord,
}: UseKeyboardShortcutsOptions) {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }

      setPressedKey(e.key);
      setTimeout(() => setPressedKey(null), KEY_FEEDBACK_DELAY_MS);

      switch (e.key.toLowerCase()) {
        case " ":
        case "enter":
          onFlip();
          break;
        case "arrowleft":
          onPrevious();
          break;
        case "arrowright":
          onNext();
          break;
        case "1":
        case "x":
          onAnswer(false);
          break;
        case "2":
        case "o":
          onAnswer(true);
          break;
        case "s":
          if (currentWord) onSpeak(currentWord.word);
          break;
        case "escape":
          onExit();
          break;
        case "?":
          onShowShortcuts();
          break;
      }
    },
    [onFlip, onPrevious, onNext, onAnswer, onSpeak, onExit, onShowShortcuts, currentWord],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [enabled, handleKeyPress]);

  // Auto-focus when enabled
  useEffect(() => {
    if (enabled) {
      document.body.focus();
    }
  }, [enabled]);

  return { pressedKey };
}
