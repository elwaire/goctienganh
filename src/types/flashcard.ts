import { VocabularyWord, StudyMode } from "./vocabulary";

export interface StudyHistorySession {
  session_id: string;
  mode: StudyMode;
  accuracy: number;
  correct_count: number;
  total_cards: number;
  total_time_ms: number;
  started_at: string;
}

export interface FlashcardResult {
  word_id: string;
  is_correct: boolean;
  time_spent_ms: number;
}

export interface WritingResult {
  word_id: string;
  is_correct: boolean;
  user_answer: string;
  time_spent_ms: number;
}

export interface DeckStudyStatsResponse {
  total_cards: number;
  mastered_cards: number;
  total_sessions: number;
  total_time_ms: number;
  accuracy: number;
  progress: number;
  last_studied_at?: string;
}

