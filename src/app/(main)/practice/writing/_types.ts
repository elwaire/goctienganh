import type { WritingMode } from "@/types/vocabulary";
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

const WRITING_MODE_IDS = [
  "en_to_vi",
  "vi_to_en",
  "fill_blank",
  "random",
] as const satisfies readonly WritingMode[];

/** Parse `mode` query param for `/practice/writing` deep links */
export function parseWritingModeParam(
  value: string | null,
): WritingMode | null {
  if (!value) return null;
  return WRITING_MODE_IDS.includes(value as WritingMode)
    ? (value as WritingMode)
    : null;
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
  {
    id: "random",
    name: "Trộn lẫn",
    description: "Câu hỏi được chọn ngẫu nhiên từ 3 kiểu học",
    example: "Học đa chiều",
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

    const actualMode =
      mode === "random"
        ? (["en_to_vi", "vi_to_en", "fill_blank"][
            Math.floor(Math.random() * 3)
          ] as WritingMode)
        : mode;

    switch (actualMode) {
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
      default:
        prompt = `"${card.definition}" trong tiếng Anh là gì?`;
        correctAnswer = card.term;
        break;
    }

    return {
      id: `${card.id}-${mode}-${actualMode}`,
      mode: actualMode,
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
  random: "Trộn ngẫu nhiên",
};
