import { axiosInstance } from "@/lib/axios";
import type {
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
  data: ExamsResponse;
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
  data: AttemptHistoryResponse;
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

const EMPTY_EXAMS_RESPONSE: ExamsResponse = { exam_sets: [], total: 0 };

export const examsApi = {
  /** GET /exams - Fetch paginated exam sets */
  getAll: async (params?: ExamsQueryParams): Promise<ExamsResponse> => {
    try {
      const response = await axiosInstance.get<ExamsApiResponse>("/exams", {
        params,
      });
      return response.data.data;
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
    return response.data.data;
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
};
