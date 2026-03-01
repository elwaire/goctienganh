// types/exam.ts

export type ExamSet = {
  id: string;
  code: string;
  title: string;
  description: string;
  subject_id: string;
  total_questions: number;
  duration_minutes: number;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export type ExamsResponse = {
  exam_sets: ExamSet[];
  total: number;
};

export type ExamsQueryParams = {
  page?: number;
  limit?: number;
  subject_id?: string;
  search?: string;
};

// ─── Exam Detail Types ───

export type ExamDetailSubject = {
  id: string;
  name: string;
  slug: string;
};

export type ExamDetailTopic = {
  id: string;
  name: string;
  slug: string;
};

export type ExamDetailCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ExamDetailOption = {
  id: string;
  content: string;
  is_correct: boolean;
  order: number;
};

export type ExamDetailQuestionData = {
  id: string;
  code: string;
  stem: string;
  type: string;
  difficulty: string;
  explanation: string;
  audio_url: string;
  image_url: string;
  order: number;
  source: string;
  status: string;
  options: ExamDetailOption[];
  category: ExamDetailCategory;
  category_id: string;
  subject: ExamDetailSubject;
  subject_id: string;
  topic: ExamDetailTopic;
  topic_id: string;
  group: {
    id: string;
    subject_id: string;
    title: string;
    topic_id: string;
    type: string;
  } | null;
  group_id: string;
  extra: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ExamDetailGroup = {
  id: string;
  title: string;
  text: string;
  audio_url: string;
  image_url: string;
  type: string;
  status: string;
  subject: ExamDetailSubject;
  subject_id: string;
  topic: ExamDetailTopic;
  topic_id: string;
};

export type ExamDetailQuestionItem = {
  id: string;
  question: ExamDetailQuestionData;
  score: number;
};

export type ExamDetailQuestion = {
  id: string;
  type: string;
  score: number;
  question: ExamDetailQuestionData | null;
  group: ExamDetailGroup | null;
  questions: ExamDetailQuestionItem[];
};

export type ExamDetailCategoryInfo = {
  id: string;
  name: string;
  description: string;
  question_count: number;
};

export type ExamDetail = {
  id: string;
  code: string;
  title: string;
  description: string;
  level: string;
  status: string;
  is_public: boolean;
  auto_distribute_score: boolean;
  duration_min: number;
  question_count: number;
  total_score: number;
  subject: ExamDetailSubject;
  subject_id: string;
  topic: ExamDetailTopic;
  topic_id: string;
  tags: string[];
  categories: ExamDetailCategoryInfo[];
  question_ids: string[];
  questions: ExamDetailQuestion[];
  created_at: string;
  updated_at: string;
};

// ─── Exam Attempt Types ───

export type ExamAttemptAnswer = {
  answer_text: string;
  question_id: string;
  selected_options: string[];
};

export type ExamAttemptOption = {
  content: string;
  id: string;
  is_correct: boolean;
  order: number;
};

export type ExamAttemptQuestionData = {
  audio_url: string;
  category: ExamDetailCategory;
  category_id: string;
  code: string;
  created_at: string;
  difficulty: string;
  explanation: string;
  extra: Record<string, unknown>;
  group: {
    id: string;
    subject_id: string;
    title: string;
    topic_id: string;
    type: string;
  } | null;
  group_id: string;
  id: string;
  image_url: string;
  options: ExamAttemptOption[];
  order: number;
  source: string;
  status: string;
  stem: string;
  subject: ExamDetailSubject;
  subject_id: string;
  topic: ExamDetailTopic;
  topic_id: string;
  type: string;
  updated_at: string;
};

export type ExamAttemptSubQuestion = {
  id: string;
  question: ExamAttemptQuestionData;
  score: number;
};

export type ExamAttemptGroup = {
  audio_url: string;
  id: string;
  image_url: string;
  status: string;
  subject: ExamDetailSubject;
  subject_id: string;
  text: string;
  title: string;
  topic: ExamDetailTopic;
  topic_id: string;
  type: string;
};

export type ExamAttemptQuestion = {
  id: string;
  group: ExamAttemptGroup | null;
  question: ExamAttemptQuestionData | null;
  questions: ExamAttemptSubQuestion[];
  score: number;
  type: string;
};

export type ExamAttempt = {
  answers: ExamAttemptAnswer[];
  attempt_id: string;
  code: string;
  duration_min: number;
  exam_set_id: string;
  max_score: number;
  questions: ExamAttemptQuestion[];
  started_at: string;
  status: string;
  title: string;
  total_questions: number;
};
