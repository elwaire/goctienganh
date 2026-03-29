import type { VocabularyWord } from "@/types/vocabulary";

export type GameState = "intro" | "playing" | "results";

export type ListeningQuestionType =
  | "LISTEN_EN_WRITE_EN"
  | "LISTEN_EN_WRITE_VN"
  | "LISTEN_VN_WRITE_EN";

export interface ListeningQuestion {
  id: string;
  type: ListeningQuestionType;
  card: VocabularyWord;
  prompt: string;
  audioText: string;
  audioLang: "en" | "vi";
  correctAnswer: string;
}

export interface ListeningResult {
  cardId: string;
  term: string;
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
  timeSpentMs: number;
}

export const QUESTION_TYPE_LABELS: Record<ListeningQuestionType, string> = {
  LISTEN_EN_WRITE_EN: "Nghe và viết từ",
  LISTEN_EN_WRITE_VN: "Nghe và viết nghĩa",
  LISTEN_VN_WRITE_EN: "Nghe nghĩa viết từ",
};

export function listeningInputPlaceholder(
  type: ListeningQuestionType,
): string {
  switch (type) {
    case "LISTEN_EN_WRITE_EN":
      return "Nhập từ tiếng Anh...";
    case "LISTEN_EN_WRITE_VN":
      return "Nhập nghĩa tiếng Việt...";
    case "LISTEN_VN_WRITE_EN":
      return "Nhập từ tiếng Anh...";
    default:
      return "Nhập câu trả lời...";
  }
}

const QUESTION_TYPES: ListeningQuestionType[] = [
  "LISTEN_EN_WRITE_EN",
  "LISTEN_EN_WRITE_VN",
  "LISTEN_VN_WRITE_EN",
];

/** Generate listening questions from cards (random question type per card) */
export function generateListeningQuestions(
  cards: VocabularyWord[],
): ListeningQuestion[] {
  return cards.map((card) => {
    const type =
      QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];

    let prompt = "";
    let audioText = "";
    let audioLang: "en" | "vi" = "en";
    let correctAnswer = "";

    switch (type) {
      case "LISTEN_EN_WRITE_EN":
        prompt = "Nghe và viết lại từ tiếng Anh";
        audioText = card.term;
        audioLang = "en";
        correctAnswer = card.term;
        break;
      case "LISTEN_EN_WRITE_VN":
        prompt = "Nghe từ tiếng Anh và viết nghĩa tiếng Việt";
        audioText = card.term;
        audioLang = "en";
        correctAnswer = card.definition;
        break;
      case "LISTEN_VN_WRITE_EN":
        prompt = "Nghe nghĩa tiếng Việt và viết từ tiếng Anh";
        audioText = card.definition;
        audioLang = "vi";
        correctAnswer = card.term;
        break;
    }

    return {
      id: `${card.id}-${type}`,
      type,
      card,
      prompt,
      audioText,
      audioLang,
      correctAnswer,
    };
  });
}

export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim().replace(/\s+/g, " ");
}
