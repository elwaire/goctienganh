export type UUID = string;

export interface SetOwner {
  id: UUID;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
}

export interface SetParentBrief {
  id: UUID;
  title: string;
}

/** Category gắn với bộ (populate từ BE khi có category_id hợp lệ). */
export interface SetCategoryBrief {
  id: UUID;
  subject_id: UUID;
  name: string;
  description: string;
  thumbnail: string;
  order: number;
}

export interface VocabularySet {
  id: UUID;
  user_id: UUID;
  subject_id?: UUID | null;
  category_id?: UUID | null;
  category?: SetCategoryBrief | null;
  parent_id?: UUID | null;
  parent?: SetParentBrief | null;
  /** Số bộ con trực tiếp viewer được xem (theo BE; optional nếu chưa có field). */
  child_count?: number;
  owner?: SetOwner; // thường có ở API admin list/detail
  title: string;
  description: string;
  is_public: boolean;
  word_count: number;
  is_owner: boolean;
  created_at: string; // ISO 8601
  updated_at: string;
}

export interface VocabularySetWithWords extends VocabularySet {
  words: VocabularyWord[];
}

export interface VocabularyWord {
  id: UUID;
  vocabulary_set_id: UUID;
  term: string;
  phonetic?: string;
  word_type?: string;
  definition: string;
  example_sentence?: string;
  example_translation?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

/** Một nhóm danh mục + các bộ cha có con (response mặc định không flat). */
export interface SetsByCategoryGroup {
  category: SetCategoryBrief | null;
  sets: VocabularySet[];
}

export type VocabularySetsListMode = "grouped" | "flat";

export interface SetListPayload {
  mode: VocabularySetsListMode;
  /** Luôn có: toàn bộ bộ trên trang hiện tại (để tương thích & đếm tab). */
  sets: VocabularySet[];
  grouped_parents?: SetsByCategoryGroup[];
  standalone?: VocabularySet[];
  total: number;
  page?: number;
  limit?: number;
  total_pages?: number;
  /** `metadata.mine_total` — tổng bộ của user (badge tab, không phụ thuộc search). */
  mine_total?: number;
  /** `metadata.public_total` — tổng bộ công khai (badge tab). */
  public_total?: number;
}

export interface WordListPayload {
  words: VocabularyWord[];
  total: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

// Params
export interface VocabularySetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject_id?: string;
  category_id?: string;
  /** Lọc danh sách con một cấp của bộ cha. */
  parent_id?: string;
  /** Mọi cấp trong một list (không dùng chung với parent_id). */
  flat?: boolean;
  /**
   * Bắt buộc trên BE: `me` | `public`. Client mặc định `me` nếu bỏ qua.
   * @see docs/VOCABULARY_SETS_LIST_FE_INTEGRATION.md
   */
  vocabulary?: "me" | "public";
}

export interface VocabularyWordQueryParams {
  page?: number;
  limit?: number;
}

export interface CreateVocabularySetRequest {
  title: string;
  description?: string;
  is_public?: boolean;
  subject_id?: string | null;
  category_id?: string | null;
  parent_id?: string | null;
}

export interface UpdateVocabularySetRequest {
  title?: string;
  description?: string;
  is_public?: boolean;
  subject_id?: string | null;
  category_id?: string | null;
  /** Bỏ qua key → giữ cha; `null` → đưa lên gốc. */
  parent_id?: string | null;
}

export interface CreateVocabularyWordRequest {
  term: string;
  phonetic?: string;
  word_type?: string;
  definition: string;
  example_sentence?: string;
  example_translation?: string;
  order?: number;
}

export interface BulkCreateVocabularyWordsRequest {
  words: CreateVocabularyWordRequest[];
}

/** Body tùy chọn cho POST /vocabulary-sets/{setId}/copy */
export interface CopyVocabularySetRequest {
  title?: string;
  description?: string;
  is_public?: boolean;
  subject_id?: string | null;
  category_id?: string | null;
}

export type StudyMode = "flashcard" | "writing" | "listening";
export type WritingMode = "en_to_vi" | "vi_to_en" | "fill_blank" | "random";
