import type { VocabularyWord } from "@/types/vocabulary";

export interface CardResult {
  cardId: string;
  term: string;
  mastered: boolean;
  timeSpentMs: number;
}

export type GameState = "intro" | "playing" | "results";

export interface ShortcutConfig {
  keys: string[];
  description: string;
}

/**
 * Adapter: Maps VocabularyWord (API shape) to a simpler view-model
 * used by the Flashcard UI component.
 */
export interface FlashcardWord {
  id: string;
  word: string;
  phonetic?: string;
  type?: string;
  meaning: string;
  example?: string;
  translation?: string;
}

/** Convert API VocabularyWord → FlashcardWord for rendering */
export function toFlashcardWord(card: VocabularyWord): FlashcardWord {
  return {
    id: card.id,
    word: card.term,
    phonetic: card.phonetic,
    type: card.word_type,
    meaning: card.definition,
    example: card.example_sentence,
    translation: card.example_translation,
  };
}
