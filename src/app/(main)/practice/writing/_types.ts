import type { WritingMode } from "@/types/flashcard";
import type { VocabularyWord } from "@/types/vocabulary";

export type GameState = "intro" | "playing" | "results";

export interface WritingQuestion {
  id: string;
  mode: WritingMode;
  card: VocabularyWord;
  prompt: string;
  correctAnswer: string;
  blankedWord?: string;
}

export interface WritingResult {
  cardId: string;
  term: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  timeSpentMs: number;
}

export interface WritingModeOption {
  id: WritingMode;
  name: string;
  description: string;
  example: string;
}

export const WRITING_MODES: WritingModeOption[] = [
  {
    id: "en_to_vi",
    name: "Viết nghĩa",
    description: "Cho từ tiếng Anh, viết nghĩa tiếng Việt",
    example: 'VD: "Accomplish" → "Hoàn thành"',
  },
  {
    id: "vi_to_en",
    name: "Viết từ Anh",
    description: "Cho nghĩa tiếng Việt, viết từ tiếng Anh",
    example: 'VD: "Hiệu quả" → "Efficient"',
  },
  {
    id: "fill_blank",
    name: "Điền chữ thiếu",
    description: "Cho từ bị thiếu chữ cái, điền đầy đủ",
    example: 'VD: "P_rs_v_rance" → "Perseverance"',
  },
];

/** Generate questions from cards for the given writing mode */
export function generateQuestions(
  cards: VocabularyWord[],
  mode: WritingMode,
): WritingQuestion[] {
  return cards.map((card) => {
    let prompt = "";
    let correctAnswer = "";
    let blankedWord = "";

    switch (mode) {
      case "en_to_vi":
        prompt = `Nghĩa của từ "${card.term}" là gì?`;
        correctAnswer = card.definition;
        break;
      case "vi_to_en":
        prompt = `"${card.definition}" trong tiếng Anh là gì?`;
        correctAnswer = card.term;
        break;
      case "fill_blank":
        blankedWord = card.term
            .split("")
            .map((char, i) => {
              if (i > 0 && i < card.term.length - 1 && Math.random() < 0.4) {
                return "_";
              }
              return char;
            })
            .join("");
        prompt = `Điền đầy đủ từ: ${blankedWord}`;
        correctAnswer = card.term;
        break;
    }

    return {
      id: `${card.id}-${mode}`,
      mode,
      card,
      prompt,
      correctAnswer,
      blankedWord,
    };
  });
}

export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim().replace(/\s+/g, " ");
}

export const MODE_LABELS: Record<WritingMode, string> = {
  en_to_vi: "Viết nghĩa tiếng Việt",
  vi_to_en: "Viết từ tiếng Anh",
  fill_blank: "Điền chữ còn thiếu",
};
