// ─── Enums & Constants ───

export type StudyMode = "flashcard" | "writing" | "listening";
export type WritingMode = "vi_to_en" | "en_to_vi" | "fill_blank";
export type StudySessionStatus = "in_progress" | "completed";

// ─── Response Models (from API) ───

export interface DeckResponse {
  id: string;
  user_id: string;
  subject_id?: string;
  title: string;
  description: string;
  is_public: boolean;
  card_count: number;
  is_owner: boolean;
  accuracy?: number;
  created_at: string;
  updated_at: string;
}

export interface CardResponse {
  id: string;
  deck_id: string;
  term: string;
  phonetic?: string;
  word_type?: string;
  definition: string;
  example_sentence?: string;
  example_translation?: string;
  order: number;
  masked_term?: string;
  created_at: string;
  updated_at: string;
}

export interface DeckWithCardsResponse extends DeckResponse {
  cards: CardResponse[];
}

export interface StudySessionResponse {
  id: string;
  user_id: string;
  deck_id: string;
  mode: StudyMode;
  writing_mode?: WritingMode;
  total_cards: number;
  correct_count: number;
  status: StudySessionStatus;
  started_at: string;
  completed_at?: string;
  cards?: CardResponse[];
}

export interface RecordStudyResponse {
  record_id: string;
  card_id: string;
  is_correct: boolean;
  is_memorized?: boolean;
}

export interface CompleteStudySessionResponse {
  session_id: string;
  deck_id: string;
  mode: StudyMode;
  total_cards: number;
  correct_count: number;
  accuracy: number;
  status: StudySessionStatus;
  started_at: string;
  completed_at?: string;
}

export interface DeckStudyStatsResponse {
  deck_id: string;
  total_cards: number;
  studied_cards: number;
  mastered_cards: number;
  total_sessions: number;
  accuracy: number;
  progress: number;
  total_time_ms: number;
  last_studied_at?: string;
}

export interface StudyHistorySession {
  session_id: string;
  mode: StudyMode;
  writing_mode?: WritingMode;
  total_cards: number;
  correct_count: number;
  accuracy: number;
  total_time_ms: number;
  started_at: string;
  completed_at?: string;
}

// ─── Request Models ───

export interface StartStudySessionRequest {
  mode?: StudyMode;
  writing_mode?: WritingMode;
}

export interface RecordStudyRequest {
  card_id: string;
  is_correct: boolean;
  is_memorized?: boolean;
  time_spent_ms?: number;
}

export interface CreateDeckRequest {
  title: string;
  description?: string;
  is_public?: boolean;
  subject_id?: string;
}

export interface UpdateDeckRequest {
  title?: string;
  description?: string;
  is_public?: boolean;
  subject_id?: string;
}

export interface CreateCardRequest {
  term: string;
  definition: string;
  phonetic?: string;
  word_type?: string;
  example_sentence?: string;
  example_translation?: string;
  order?: number;
}

export interface BulkCreateCardsRequest {
  cards: CreateCardRequest[];
}

// ─── List Response Wrappers ───

export interface DeckListResponse {
  decks: DeckResponse[];
  total: number;
}

export interface CardListResponse {
  cards: CardResponse[];
  total: number;
}

export interface StudyHistoryResponse {
  sessions: StudyHistorySession[];
  total: number;
}

// ─── Query Params ───

export interface DeckQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject_id?: string;
}

export interface CardQueryParams {
  page?: number;
  limit?: number;
}

export interface StudyHistoryParams {
  page?: number;
  limit?: number;
}
