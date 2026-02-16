import { CollectionColor } from "@/types";

export const STORAGE_KEY = "learneng_flashcards";

export const PART_OF_SPEECH_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adjective", label: "Adjective" },
  { value: "adverb", label: "Adverb" },
  { value: "pronoun", label: "Pronoun" },
  { value: "preposition", label: "Preposition" },
  { value: "conjunction", label: "Conjunction" },
  { value: "interjection", label: "Interjection" },
] as const;

export const DICTIONARY_API_URL =
  "https://api.dictionaryapi.dev/api/v2/entries/en";

export const COLLECTION_COLORS: Record<
  CollectionColor,
  {
    bg: string;
    bgLight: string;
    text: string;
    border: string;
    gradient: string;
  }
> = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-600",
  },
  emerald: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-emerald-600",
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    gradient: "from-purple-500 to-purple-600",
  },
  rose: {
    bg: "bg-rose-500",
    bgLight: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    gradient: "from-rose-500 to-rose-600",
  },
  amber: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    gradient: "from-amber-500 to-amber-600",
  },
  cyan: {
    bg: "bg-cyan-500",
    bgLight: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-200",
    gradient: "from-cyan-500 to-cyan-600",
  },
};

// Danh sách màu để hiển thị trong form
export const COLOR_OPTIONS: CollectionColor[] = [
  "blue",
  "emerald",
  "purple",
  "rose",
  "amber",
  "cyan",
];
