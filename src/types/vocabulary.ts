export type UUID = string;

export interface SetOwner {
  id: UUID;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
}

export interface VocabularySet {
  id: UUID;
  user_id: UUID;
  subject_id?: UUID | null;
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
}

export interface WordListPayload {
  words: VocabularyWord[];
  total: number;
}

// Params
export interface VocabularySetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  subject_id?: string;
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
}

export interface UpdateVocabularySetRequest {
  title?: string;
  description?: string;
  is_public?: boolean;
  subject_id?: string | null;
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

export type StudyMode = "flashcard" | "writing" | "listening";
export type WritingMode = "en_to_vi" | "vi_to_en" | "fill_blank";
