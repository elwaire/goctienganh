import { readPagedBody, readPageMeta } from "@/lib/apiEnvelope";
import { axiosInstance } from "@/lib/axios";
import type {
  VocabularySet,
  VocabularySetWithWords,
  VocabularyWord,
  SetListPayload,
  SetsByCategoryGroup,
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
  metadata?: unknown;
};

function isGroupedSetsData(raw: unknown): raw is {
  grouped_parents: SetsByCategoryGroup[];
  standalone: VocabularySet[];
} {
  if (typeof raw !== "object" || raw === null) return false;
  const o = raw as Record<string, unknown>;
  return Array.isArray(o.grouped_parents) && Array.isArray(o.standalone);
}

/** `metadata.mine_total` / `metadata.public_total` — xem VOCABULARY_SETS_LIST_FE_INTEGRATION.md §1.1 */
function readVocabularyTabTotals(metadata: unknown): {
  mine_total?: number;
  public_total?: number;
} {
  if (typeof metadata !== "object" || metadata === null) return {};
  const o = metadata as Record<string, unknown>;
  const mine = o.mine_total;
  const pub = o.public_total;
  return {
    mine_total:
      typeof mine === "number" && Number.isFinite(mine) ? mine : undefined,
    public_total:
      typeof pub === "number" && Number.isFinite(pub) ? pub : undefined,
  };
}

function parseSetListPayload(envelope: ApiResponse<unknown>): SetListPayload {
  const meta = readPageMeta(envelope);
  const tabTotals = readVocabularyTabTotals(envelope.metadata);
  const raw = envelope.data;

  if (Array.isArray(raw)) {
    const sets = raw as VocabularySet[];
    return {
      mode: "flat",
      sets,
      total: meta?.total_items ?? sets.length,
      page: meta?.page,
      limit: meta?.limit,
      total_pages: meta?.total_pages,
      ...tabTotals,
    };
  }

  if (isGroupedSetsData(raw)) {
    const grouped_parents = raw.grouped_parents;
    const standalone = raw.standalone;
    const sets = [
      ...grouped_parents.flatMap((g) => g.sets),
      ...standalone,
    ];
    return {
      mode: "grouped",
      grouped_parents,
      standalone,
      sets,
      total: meta?.total_items ?? sets.length,
      page: meta?.page,
      limit: meta?.limit,
      total_pages: meta?.total_pages,
      ...tabTotals,
    };
  }

  return {
    mode: "flat",
    sets: [],
    total: meta?.total_items ?? 0,
    page: meta?.page,
    limit: meta?.limit,
    total_pages: meta?.total_pages,
    ...tabTotals,
  };
}

// ─── Vocabulary API Service ───

export const vocabularyApi = {
  // ════════════════════════════════
  //  Vocabulary Sets — Bộ từ vựng
  // ════════════════════════════════

  /**
   * GET /vocabulary-sets — Danh sách bộ từ vựng.
   * Bắt buộc `vocabulary=me|public` (mặc định `me`). `flat=true` → data mảng; không flat → grouped_parents + standalone.
   */
  getSets: async (params?: VocabularySetQueryParams): Promise<SetListPayload> => {
    const { vocabulary: vocabularyMode, ...rest } = params ?? {};
    const response = await axiosInstance.get<ApiResponse<unknown>>("/vocabulary-sets", {
      params: {
        ...rest,
        vocabulary: vocabularyMode ?? "me",
      },
    });
    return parseSetListPayload(response.data);
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
    const response = await axiosInstance.get<ApiResponse<VocabularyWord[]>>(
      `/vocabulary-sets/${setId}/words`,
      { params },
    );
    const { rows, meta } = readPagedBody<VocabularyWord>(response.data);
    return {
      words: rows,
      total: meta?.total_items ?? rows.length,
      page: meta?.page,
      limit: meta?.limit,
      total_pages: meta?.total_pages,
    };
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
