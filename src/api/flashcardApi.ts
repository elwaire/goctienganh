import { axiosInstance } from "@/lib/axios";
import type {
  DeckResponse,
  DeckWithCardsResponse,
  DeckListResponse,
  DeckQueryParams,
  CreateDeckRequest,
  UpdateDeckRequest,
  CardResponse,
  CardListResponse,
  CardQueryParams,
  CreateCardRequest,
  BulkCreateCardsRequest,
  StudySessionResponse,
  StartStudySessionRequest,
  RecordStudyRequest,
  RecordStudyResponse,
  CompleteStudySessionResponse,
  DeckStudyStatsResponse,
  StudyHistoryResponse,
  StudyHistoryParams,
} from "@/types/flashcard";

// ─── API Response Wrappers ───

type ApiResponse<T> = {
  data: T;
  message?: string;
};

// ─── Flashcard API Service ───

export const flashcardApi = {
  // ════════════════════════════════
  //  Deck — Bộ thẻ học
  // ════════════════════════════════

  /** GET /flashcard-decks — Danh sách bộ thẻ */
  getDecks: async (params?: DeckQueryParams): Promise<DeckListResponse> => {
    const response = await axiosInstance.get<ApiResponse<DeckListResponse>>(
      "/flashcard-decks",
      { params },
    );
    return response.data.data;
  },

  /** POST /flashcard-decks — Tạo bộ thẻ */
  createDeck: async (data: CreateDeckRequest): Promise<DeckResponse> => {
    const response = await axiosInstance.post<ApiResponse<DeckResponse>>(
      "/flashcard-decks",
      data,
    );
    return response.data.data;
  },

  /** GET /flashcard-decks/:deckId — Chi tiết bộ thẻ + thẻ */
  getDeck: async (deckId: string): Promise<DeckWithCardsResponse> => {
    const response = await axiosInstance.get<
      ApiResponse<DeckWithCardsResponse>
    >(`/flashcard-decks/${deckId}`);
    return response.data.data;
  },

  /** PUT /flashcard-decks/:deckId — Cập nhật bộ thẻ */
  updateDeck: async (
    deckId: string,
    data: UpdateDeckRequest,
  ): Promise<DeckResponse> => {
    const response = await axiosInstance.put<ApiResponse<DeckResponse>>(
      `/flashcard-decks/${deckId}`,
      data,
    );
    return response.data.data;
  },

  /** DELETE /flashcard-decks/:deckId — Xoá bộ thẻ */
  deleteDeck: async (deckId: string): Promise<void> => {
    await axiosInstance.delete(`/flashcard-decks/${deckId}`);
  },

  // ════════════════════════════════
  //  Card — Thẻ học
  // ════════════════════════════════

  /** GET /flashcard-decks/:deckId/cards — Danh sách thẻ (phân trang) */
  getCards: async (
    deckId: string,
    params?: CardQueryParams,
  ): Promise<CardListResponse> => {
    const response = await axiosInstance.get<ApiResponse<CardListResponse>>(
      `/flashcard-decks/${deckId}/cards`,
      { params },
    );
    return response.data.data;
  },

  /** POST /flashcard-decks/:deckId/cards — Thêm 1 thẻ */
  createCard: async (
    deckId: string,
    data: CreateCardRequest,
  ): Promise<CardResponse> => {
    const response = await axiosInstance.post<ApiResponse<CardResponse>>(
      `/flashcard-decks/${deckId}/cards`,
      data,
    );
    return response.data.data;
  },

  /** POST /flashcard-decks/:deckId/cards/bulk — Thêm nhiều thẻ */
  createCardsBulk: async (
    deckId: string,
    data: BulkCreateCardsRequest,
  ): Promise<CardResponse[]> => {
    const response = await axiosInstance.post<ApiResponse<CardResponse[]>>(
      `/flashcard-decks/${deckId}/cards/bulk`,
      data,
    );
    return response.data.data;
  },

  /** PUT /flashcard-decks/:deckId/cards/:cardId — Cập nhật thẻ */
  updateCard: async (
    deckId: string,
    cardId: string,
    data: Partial<CreateCardRequest>,
  ): Promise<CardResponse> => {
    const response = await axiosInstance.put<ApiResponse<CardResponse>>(
      `/flashcard-decks/${deckId}/cards/${cardId}`,
      data,
    );
    return response.data.data;
  },

  /** DELETE /flashcard-decks/:deckId/cards/:cardId — Xoá thẻ */
  deleteCard: async (deckId: string, cardId: string): Promise<void> => {
    await axiosInstance.delete(`/flashcard-decks/${deckId}/cards/${cardId}`);
  },

  // ════════════════════════════════
  //  Study Session — Phiên luyện tập
  // ════════════════════════════════

  /** POST /flashcard-decks/:deckId/study-sessions — Bắt đầu phiên học */
  startStudySession: async (
    deckId: string,
    data?: StartStudySessionRequest,
  ): Promise<StudySessionResponse> => {
    const response = await axiosInstance.post<
      ApiResponse<StudySessionResponse>
    >(`/flashcard-decks/${deckId}/study-sessions`, data);
    return response.data.data;
  },

  /** GET /flashcard-decks/:deckId/study-sessions/:sessionId — Lấy thông tin phiên học */
  getStudySession: async (
    deckId: string,
    sessionId: string,
  ): Promise<StudySessionResponse> => {
    const response = await axiosInstance.get<
      ApiResponse<StudySessionResponse>
    >(`/flashcard-decks/${deckId}/study-sessions/${sessionId}`);
    return response.data.data;
  },

  /** POST /flashcard-decks/:deckId/study-sessions/:sessionId/records — Ghi kết quả 1 thẻ */
  recordStudy: async (
    deckId: string,
    sessionId: string,
    data: RecordStudyRequest,
  ): Promise<RecordStudyResponse> => {
    const response = await axiosInstance.post<
      ApiResponse<RecordStudyResponse>
    >(
      `/flashcard-decks/${deckId}/study-sessions/${sessionId}/records`,
      data,
    );
    return response.data.data;
  },

  /** POST /flashcard-decks/:deckId/study-sessions/:sessionId/complete — Hoàn thành phiên học */
  completeStudySession: async (
    deckId: string,
    sessionId: string,
  ): Promise<CompleteStudySessionResponse> => {
    const response = await axiosInstance.post<
      ApiResponse<CompleteStudySessionResponse>
    >(`/flashcard-decks/${deckId}/study-sessions/${sessionId}/complete`);
    return response.data.data;
  },

  // ════════════════════════════════
  //  Study History & Stats
  // ════════════════════════════════

  /** GET /flashcard-decks/:deckId/study-history — Lịch sử phiên học */
  getStudyHistory: async (
    deckId: string,
    params?: StudyHistoryParams,
  ): Promise<StudyHistoryResponse> => {
    const response = await axiosInstance.get<
      ApiResponse<StudyHistoryResponse>
    >(`/flashcard-decks/${deckId}/study-history`, { params });
    return response.data.data;
  },

  /** GET /flashcard-decks/:deckId/study-stats — Thống kê học tập */
  getStudyStats: async (
    deckId: string,
  ): Promise<DeckStudyStatsResponse> => {
    const response = await axiosInstance.get<
      ApiResponse<DeckStudyStatsResponse>
    >(`/flashcard-decks/${deckId}/study-stats`);
    return response.data.data;
  },
};
