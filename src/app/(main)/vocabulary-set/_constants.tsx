// Re-export game modes from shared constants
export { GAME_MODES } from "@/constants/gameModes";
export type { GameModeConfig } from "@/constants/gameModes";

export const WORD_TYPES = [
  { value: "noun", label: "Danh từ" },
  { value: "verb", label: "Động từ" },
  { value: "adjective", label: "Tính từ" },
  { value: "adverb", label: "Trạng từ" },
  { value: "preposition", label: "Giới từ" },
  { value: "conjunction", label: "Liên từ" },
] as const;

export const EMPTY_WORD_FORM = {
  term: "",
  phonetic: "",
  word_type: "noun",
  definition: "",
  example_sentence: "",
  example_translation: "",
};
