import { axiosInstance } from "@/lib/axios";
import type {
  CreateFeedbackBody,
  FeedbackDetail,
  FeedbackListPayload,
  FeedbackListPayloadRaw,
  FeedbackMetaPayload,
  FeedbackSummary,
  MessageListPayload,
  MessageResponse,
} from "@/types/feedback";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/** BE có thể trả `items: null` khi chưa có dữ liệu */
function normalizeFeedbackList(
  raw: FeedbackListPayload | FeedbackListPayloadRaw,
): FeedbackListPayload {
  return {
    items: Array.isArray(raw.items) ? raw.items : [],
    total: typeof raw.total === "number" && !Number.isNaN(raw.total) ? raw.total : 0,
  };
}

type MessageListRaw = Omit<MessageListPayload, "messages"> & {
  messages: MessageResponse[] | null;
};

function normalizeMessageList(raw: MessageListPayload | MessageListRaw): MessageListPayload {
  return {
    messages: Array.isArray(raw.messages) ? raw.messages : [],
    total: typeof raw.total === "number" && !Number.isNaN(raw.total) ? raw.total : 0,
  };
}

type FeedbackDetailRaw = Omit<FeedbackDetail, "messages"> & {
  messages: MessageResponse[] | null;
};

function normalizeFeedbackDetail(raw: FeedbackDetail | FeedbackDetailRaw): FeedbackDetail {
  return {
    ...raw,
    messages: Array.isArray(raw.messages) ? raw.messages : [],
  };
}

export type FeedbackListQuery = {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
};

export type FeedbackMessagesQuery = {
  page?: number;
  limit?: number;
  /** true / 1 / yes — chỉ tin admin */
  staff_only?: boolean | string;
};

export const feedbackApi = {
  /** GET /feedbacks/meta */
  getMeta: async (): Promise<FeedbackMetaPayload> => {
    const res = await axiosInstance.get<ApiResponse<FeedbackMetaPayload>>(
      "/feedbacks/meta",
    );
    return res.data.data;
  },

  /** POST /feedbacks */
  create: async (body: CreateFeedbackBody): Promise<FeedbackSummary> => {
    const res = await axiosInstance.post<ApiResponse<FeedbackSummary>>(
      "/feedbacks",
      body,
    );
    return res.data.data;
  },

  /** GET /feedbacks/mine */
  listMine: async (
    params?: FeedbackListQuery,
  ): Promise<FeedbackListPayload> => {
    const res = await axiosInstance.get<ApiResponse<FeedbackListPayloadRaw>>(
      "/feedbacks/mine",
      { params },
    );
    return normalizeFeedbackList(res.data.data);
  },

  /** GET /feedbacks/community */
  listCommunity: async (
    params?: FeedbackListQuery,
  ): Promise<FeedbackListPayload> => {
    const res = await axiosInstance.get<ApiResponse<FeedbackListPayloadRaw>>(
      "/feedbacks/community",
      { params },
    );
    return normalizeFeedbackList(res.data.data);
  },

  /** GET /feedbacks/{id} */
  getById: async (id: string): Promise<FeedbackDetail> => {
    const res = await axiosInstance.get<ApiResponse<FeedbackDetailRaw>>(
      `/feedbacks/${id}`,
    );
    return normalizeFeedbackDetail(res.data.data);
  },

  /** GET /feedbacks/{id}/messages — phân trang tin nhắn, poll tùy chọn */
  listMessages: async (
    id: string,
    params?: FeedbackMessagesQuery,
  ): Promise<MessageListPayload> => {
    const res = await axiosInstance.get<ApiResponse<MessageListRaw>>(
      `/feedbacks/${id}/messages`,
      { params },
    );
    return normalizeMessageList(res.data.data);
  },

  /** POST /feedbacks/{id}/replies — chỉ chủ thread */
  postReply: async (
    id: string,
    body: { body: string },
  ): Promise<MessageResponse> => {
    const res = await axiosInstance.post<ApiResponse<MessageResponse>>(
      `/feedbacks/${id}/replies`,
      body,
    );
    return res.data.data;
  },
};
