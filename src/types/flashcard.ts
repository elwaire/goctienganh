export type DeckStatus = 'draft' | 'published' | 'archived'
export type StudyMode = 'flashcard' | 'quiz' | 'typing' | 'matching'
export type StudySessionStatus = 'in_progress' | 'completed'

export interface FlashcardCard {
  id: string
  deck_id: string
  term: string
  reading?: string
  phonetic?: string
  definition: string
  example_sentence?: string
  example_translation?: string
  image_url?: string
  audio_url?: string
  extra?: Record<string, unknown>
  order: number
  created_at: string
  updated_at: string
}

export interface FlashcardDeck {
  id: string
  user_id: string
  subject_id?: string
  title: string
  description: string
  target_language: string
  native_language: string
  thumbnail_url?: string
  tags: string[]
  is_public: boolean
  status: DeckStatus
  card_count: number
  is_owner: boolean
  created_at: string
  updated_at: string
}

export interface FlashcardDeckWithCards extends FlashcardDeck {
  cards: FlashcardCard[]
}

export interface StudySession {
  id: string
  user_id: string
  deck_id: string
  mode: StudyMode
  total_cards: number
  correct_count: number
  status: StudySessionStatus
  started_at: string
  completed_at?: string
  cards?: FlashcardCard[]
}

export interface RecordStudyRequest {
  card_id: string
  is_correct: boolean
  confidence_level: 1 | 2 | 3 | 4 | 5
  time_spent_ms: number
}

export interface RecordStudyResponse {
  record_id: string
  card_id: string
  is_correct: boolean
  next_review_at?: string
}

export interface CompleteStudySessionResponse {
  session_id: string
  deck_id: string
  mode: StudyMode
  total_cards: number
  correct_count: number
  accuracy: number
  status: StudySessionStatus
  started_at: string
  completed_at?: string
}

export interface DeckStudyStats {
  deck_id: string
  total_cards: number
  studied_cards: number
  mastered_cards: number
  total_sessions: number
  last_studied_at?: string
  due_for_review: number
}

export interface CreateDeckRequest {
  title: string
  description?: string
  target_language: string
  native_language: string
  thumbnail_url?: string
  tags?: string[]
  is_public?: boolean
  status?: DeckStatus
  subject_id?: string
}

export interface CreateCardRequest {
  term: string
  reading?: string
  phonetic?: string
  definition: string
  example_sentence?: string
  example_translation?: string
  image_url?: string
  audio_url?: string
  extra?: Record<string, unknown>
  order?: number
}

export interface BulkCreateCardsRequest {
  cards: CreateCardRequest[]
}
