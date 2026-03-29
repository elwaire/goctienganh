import { readPagedBody } from "@/lib/apiEnvelope";
import { axiosInstance } from "@/lib/axios";
import type { PageMeta } from "@/types/api";
import type {
  ExamSet,
  ExamsResponse,
  ExamsQueryParams,
  ExamDetail,
  ExamAttempt,
  ExamAttemptAnswer,
  ExamAttemptQuestionData,
} from "@/types/exam";
import { AxiosError } from "axios";

type ExamsApiResponse = {
  success: boolean;
  message: string;
  data: ExamSet[];
  metadata?: PageMeta;
};

type ExamDetailApiResponse = {
  success: boolean;
  message: string;
  data: ExamDetail;
};

type ExamAttemptApiResponse = {
  success: boolean;
  message: string;
  data: ExamAttempt;
};

type SubmitAnswerApiResponse = {
  success: boolean;
  message: string;
  data: ExamAttemptAnswer;
};

export type SubmitAnswerPayload = {
  question_id: string;
  selected_options: string[];
  answer_text?: string;
};

export type ExamSubmitResult = {
  attempt_id: string;
  completed_at: string;
  correct_count: number;
  max_score: number;
  score: number;
  status: string;
  total_questions: number;
};

type SubmitExamApiResponse = {
  success: boolean;
  message: string;
  data: ExamSubmitResult;
};

export type AttemptHistoryItem = {
  completed_at: string;
  correct_count: number;
  exam_code: string;
  exam_set_id: string;
  exam_title: string;
  id: string;
  max_score: number;
  score: number;
  started_at: string;
  status: string;
  total_questions: number;
};

export type AttemptHistoryResponse = {
  attempts: AttemptHistoryItem[];
  total: number;
};

export type AttemptHistoryParams = {
  exam_code?: string;
  exam_id?: string;
  page?: number;
  limit?: number;
};

type AttemptHistoryApiResponse = {
  success: boolean;
  message: string;
  data: AttemptHistoryItem[];
  metadata?: PageMeta;
};

export type AttemptResultAnswer = {
  answer_text: string;
  is_correct: boolean;
  question_id: string;
  score: number;
  selected_options: string[];
  question: ExamAttemptQuestionData;
};

export type AttemptResultResponse = {
  answers: AttemptResultAnswer[];
  attempt_id: string;
  completed_at: string;
  correct_count: number;
  max_score: number;
  score: number;
  status: string;
  total_questions: number;
};

type AttemptResultApiResponse = {
  success: boolean;
  message: string;
  data: AttemptResultResponse;
};

export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  fullname: string;
  avatar: string;
  best_score: number;
  max_score: number;
  attempt_count: number;
  completed_at: string;
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  total: number;
  user_entry?: LeaderboardEntry | null;
};

export type LeaderboardParams = {
  sort?: "score" | "attempts";
  page?: number;
  limit?: number;
};

type LeaderboardMeta = PageMeta & {
  user_entry?: LeaderboardEntry | null;
};

type LeaderboardApiResponse = {
  success: boolean;
  message: string;
  data: LeaderboardEntry[];
  metadata?: LeaderboardMeta;
};

const EMPTY_EXAMS_RESPONSE: ExamsResponse = {
  exam_sets: [],
  total: 0,
  total_pages: 0,
};

export const examsApi = {
  /** GET /exams - Fetch paginated exam sets */
  getAll: async (params?: ExamsQueryParams): Promise<ExamsResponse> => {
    try {
      const response = await axiosInstance.get<ExamsApiResponse>("/exams", {
        params,
      });
      const { rows, meta } = readPagedBody<ExamSet>(response.data);
      return {
        exam_sets: rows,
        total: meta?.total_items ?? rows.length,
        page: meta?.page,
        limit: meta?.limit,
        total_pages: meta?.total_pages,
      };
    } catch (error) {
      // If searching and server returns 500, treat as empty results
      if (
        params?.search &&
        error instanceof AxiosError &&
        error.response?.status === 500
      ) {
        return EMPTY_EXAMS_RESPONSE;
      }
      throw error;
    }
  },

  /** GET /exams/:code - Fetch exam detail by code */
  getByCode: async (code: string): Promise<ExamDetail> => {
    const response = await axiosInstance.get<ExamDetailApiResponse>(
      `/exams/${code}`,
    );
    return response.data.data;
  },

  /** POST /exams/:code/attempts - Start a new exam attempt */
  startAttempt: async (code: string): Promise<ExamAttempt> => {
    const response = await axiosInstance.post<ExamAttemptApiResponse>(
      `/exams/${code}/attempts`,
    );
    return response.data.data;
  },

  /** POST /exams/attempts/:attemptId/answers - Submit an answer */
  submitAnswer: async (
    attemptId: string,
    payload: SubmitAnswerPayload,
  ): Promise<ExamAttemptAnswer> => {
    const response = await axiosInstance.post<SubmitAnswerApiResponse>(
      `/exams/attempts/${attemptId}/answers`,
      payload,
    );
    return response.data.data;
  },

  /** POST /exams/attempts/:attemptId/submit - Submit and finish exam */
  submitExam: async (attemptId: string): Promise<ExamSubmitResult> => {
    const response = await axiosInstance.post<SubmitExamApiResponse>(
      `/exams/attempts/${attemptId}/submit`,
    );
    return response.data.data;
  },

  /** GET /exams/attempts - Fetch attempt history */
  getAttemptHistory: async (
    params?: AttemptHistoryParams,
  ): Promise<AttemptHistoryResponse> => {
    const response = await axiosInstance.get<AttemptHistoryApiResponse>(
      "/exams/attempts",
      { params },
    );
    const { rows, meta } = readPagedBody<AttemptHistoryItem>(response.data);
    return {
      attempts: rows,
      total: meta?.total_items ?? rows.length,
    };
  },

  /** GET /exams/attempts/:attemptId/result - Get attempt result details */
  getAttemptResult: async (
    attemptId: string,
  ): Promise<AttemptResultResponse> => {
    const response = await axiosInstance.get<AttemptResultApiResponse>(
      `/exams/attempts/${attemptId}/result`,
    );
    return response.data.data;
  },

  /** GET /exams/:code/leaderboard - Get leaderboard for an exam */
  getLeaderboard: async (
    code: string,
    params?: LeaderboardParams,
  ): Promise<LeaderboardResponse> => {
    const response = await axiosInstance.get<LeaderboardApiResponse>(
      `/exams/${code}/leaderboard`,
      { params },
    );
    const { rows, meta } = readPagedBody<LeaderboardEntry>(response.data);
    const user_entry =
      meta && "user_entry" in meta
        ? (meta as LeaderboardMeta).user_entry
        : undefined;
    return {
      entries: rows,
      total: meta?.total_items ?? rows.length,
      user_entry,
    };
  },
};
