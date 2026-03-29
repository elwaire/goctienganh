import { axiosInstance } from "@/lib/axios";
import type {
  VocabularySet,
  VocabularySetWithWords,
  VocabularyWord,
  SetListPayload,
  WordListPayload,
  VocabularySetQueryParams,
  VocabularyWordQueryParams,
  CreateVocabularySetRequest,
  UpdateVocabularySetRequest,
  CreateVocabularyWordRequest,
  BulkCreateVocabularyWordsRequest,
  CopyVocabularySetRequest,
} from "@/types/vocabulary";

// ─── API Response Wrappers ───

type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

// ─── Vocabulary API Service ───

export const vocabularyApi = {
  // ════════════════════════════════
  //  Vocabulary Sets — Bộ từ vựng
  // ════════════════════════════════

  /** GET /vocabulary-sets — Danh sách bộ từ vựng */
  getSets: async (params?: VocabularySetQueryParams): Promise<SetListPayload> => {
    const response = await axiosInstance.get<ApiResponse<SetListPayload>>(
      "/vocabulary-sets",
      { params },
    );
    return response.data.data;
  },

  /** POST /vocabulary-sets — Tạo bộ từ vựng */
  createSet: async (data: CreateVocabularySetRequest): Promise<VocabularySet> => {
    const response = await axiosInstance.post<ApiResponse<VocabularySet>>(
      "/vocabulary-sets",
      data,
    );
    return response.data.data;
  },

  /** GET /vocabulary-sets/:setId — Chi tiết bộ từ vựng + toàn bộ từ */
  getSet: async (setId: string): Promise<VocabularySetWithWords> => {
    const response = await axiosInstance.get<ApiResponse<VocabularySetWithWords>>(
      `/vocabulary-sets/${setId}`
    );
    return response.data.data;
  },

  /** PUT /vocabulary-sets/:setId — Cập nhật bộ từ vựng */
  updateSet: async (
    setId: string,
    data: UpdateVocabularySetRequest,
  ): Promise<VocabularySet> => {
    const response = await axiosInstance.put<ApiResponse<VocabularySet>>(
      `/vocabulary-sets/${setId}`,
      data,
    );
    return response.data.data;
  },

  /** DELETE /vocabulary-sets/:setId — Xoá bộ từ vựng */
  deleteSet: async (setId: string): Promise<void> => {
    await axiosInstance.delete(`/vocabulary-sets/${setId}`);
  },

  /**
   * POST /vocabulary-sets/:setId/copy — Sao chép bộ public của người khác về tài khoản mình (201)
   * Body có thể bỏ trống.
   */
  copySet: async (
    setId: string,
    body?: CopyVocabularySetRequest,
  ): Promise<VocabularySetWithWords> => {
    const response = await axiosInstance.post<ApiResponse<VocabularySetWithWords>>(
      `/vocabulary-sets/${setId}/copy`,
      body ?? {},
    );
    return response.data.data;
  },

  // ════════════════════════════════
  //  Vocabulary Words — Từ vựng
  // ════════════════════════════════

  /** GET /vocabulary-sets/:setId/words — Danh sách từ (phân trang) */
  getWords: async (
    setId: string,
    params?: VocabularyWordQueryParams,
  ): Promise<WordListPayload> => {
    const response = await axiosInstance.get<ApiResponse<WordListPayload>>(
      `/vocabulary-sets/${setId}/words`,
      { params },
    );
    return response.data.data;
  },

  /** POST /vocabulary-sets/:setId/words — Thêm 1 từ */
  createWord: async (
    setId: string,
    data: CreateVocabularyWordRequest,
  ): Promise<VocabularyWord> => {
    const response = await axiosInstance.post<ApiResponse<VocabularyWord>>(
      `/vocabulary-sets/${setId}/words`,
      data,
    );
    return response.data.data;
  },

  /** POST /vocabulary-sets/:setId/words/bulk — Thêm nhiều từ */
  createWordsBulk: async (
    setId: string,
    data: BulkCreateVocabularyWordsRequest,
  ): Promise<VocabularyWord[]> => {
    const response = await axiosInstance.post<ApiResponse<VocabularyWord[]>>(
      `/vocabulary-sets/${setId}/words/bulk`,
      data,
    );
    return response.data.data;
  },

  /** PUT /vocabulary-sets/:setId/words/:wordId — Cập nhật từ */
  updateWord: async (
    setId: string,
    wordId: string,
    data: Partial<CreateVocabularyWordRequest>,
  ): Promise<VocabularyWord> => {
    const response = await axiosInstance.put<ApiResponse<VocabularyWord>>(
      `/vocabulary-sets/${setId}/words/${wordId}`,
      data,
    );
    return response.data.data;
  },

  /** DELETE /vocabulary-sets/:setId/words/:wordId — Xoá từ */
  deleteWord: async (setId: string, wordId: string): Promise<void> => {
    await axiosInstance.delete(`/vocabulary-sets/${setId}/words/${wordId}`);
  },
};
