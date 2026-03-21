import { api } from './api'
import type {
  FlashcardCard,
  FlashcardDeck,
  FlashcardDeckWithCards,
  StudySession,
  RecordStudyRequest,
  RecordStudyResponse,
  CompleteStudySessionResponse,
  DeckStudyStats,
  CreateDeckRequest,
  CreateCardRequest,
  BulkCreateCardsRequest,
} from '@/types/flashcard'

export const flashcardApi = {
  // ── Decks ──────────────────────────────────────────────────────────────────

  getDecks: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<{ data: { decks: FlashcardDeck[]; total: number } }>('/flashcard-decks', { params }),

  getDeck: (deckId: string) =>
    api.get<{ data: FlashcardDeckWithCards }>(`/flashcard-decks/${deckId}`),

  createDeck: (data: CreateDeckRequest) =>
    api.post<{ data: FlashcardDeck }>('/flashcard-decks', data),

  updateDeck: (deckId: string, data: Partial<CreateDeckRequest & { status: string; is_public: boolean }>) =>
    api.put<{ data: FlashcardDeck }>(`/flashcard-decks/${deckId}`, data),

  deleteDeck: (deckId: string) =>
    api.delete(`/flashcard-decks/${deckId}`),

  // ── Cards ──────────────────────────────────────────────────────────────────

  addCard: (deckId: string, data: CreateCardRequest) =>
    api.post<{ data: FlashcardCard }>(`/flashcard-decks/${deckId}/cards`, data),

  updateCard: (deckId: string, cardId: string, data: Partial<CreateCardRequest>) =>
    api.put<{ data: FlashcardCard }>(`/flashcard-decks/${deckId}/cards/${cardId}`, data),

  deleteCard: (deckId: string, cardId: string) =>
    api.delete(`/flashcard-decks/${deckId}/cards/${cardId}`),

  bulkAddCards: (deckId: string, data: BulkCreateCardsRequest) =>
    api.post<{ data: FlashcardCard[] }>(`/flashcard-decks/${deckId}/cards/bulk`, data),

  // ── Study sessions ─────────────────────────────────────────────────────────

  startSession: (deckId: string, mode: string = 'flashcard') =>
    api.post<{ data: StudySession }>(`/flashcard-decks/${deckId}/study-sessions`, { mode }),

  getSession: (deckId: string, sessionId: string) =>
    api.get<{ data: StudySession }>(`/flashcard-decks/${deckId}/study-sessions/${sessionId}`),

  recordCard: (deckId: string, sessionId: string, data: RecordStudyRequest) =>
    api.post<{ data: RecordStudyResponse }>(
      `/flashcard-decks/${deckId}/study-sessions/${sessionId}/records`,
      data,
    ),

  completeSession: (deckId: string, sessionId: string) =>
    api.post<{ data: CompleteStudySessionResponse }>(
      `/flashcard-decks/${deckId}/study-sessions/${sessionId}/complete`,
    ),

  // ── Stats ──────────────────────────────────────────────────────────────────

  getStats: (deckId: string) =>
    api.get<{ data: DeckStudyStats }>(`/flashcard-decks/${deckId}/study-stats`),
}
