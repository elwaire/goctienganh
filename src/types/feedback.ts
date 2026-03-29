/** Theo `docs/FEEDBACK_USER_FE.md` — API `/api/v1/feedbacks/*` */

export type FeedbackType = "bug" | "feature" | "other";

export type AuthorInfo = {
  id: string;
  username: string;
  fullname: string;
  avatar: string;
};

export type FeedbackSummary = {
  id: string;
  user_id: string;
  author: AuthorInfo;
  type: FeedbackType;
  type_label: string;
  title: string;
  body: string;
  status: string;
  status_label: string;
  message_count: number;
  created_at: string;
  updated_at: string;
};

export type MessageResponse = {
  id: string;
  user_id: string;
  author: AuthorInfo;
  body: string;
  is_staff: boolean;
  created_at: string;
};

export type FeedbackDetail = FeedbackSummary & {
  messages: MessageResponse[];
};

export type FeedbackListPayload = {
  items: FeedbackSummary[];
  total: number;
};

/** GET /feedbacks/{id}/messages */
export type MessageListPayload = {
  messages: MessageResponse[];
  total: number;
};

export type FeedbackMetaPayload = {
  types: { value: string; label: string }[];
  statuses: { value: string; label: string }[];
};

export type CreateFeedbackBody = {
  type: FeedbackType;
  title?: string;
  body: string;
};
