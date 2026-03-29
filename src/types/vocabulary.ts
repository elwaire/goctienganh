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

export interface VocabularySet {
  id: UUID;
  user_id: UUID;
  subject_id?: UUID | null;
  category_id?: UUID | null;
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

export interface SetListPayload {
  sets: VocabularySet[];
  total: number;
  page?: number;
  limit?: number;
  total_pages?: number;
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
