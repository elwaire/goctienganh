import { axiosInstance } from "@/lib/axios";
import type { User, UpdateProfileRequest } from "@/types/auth";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

/**
 * Một avatar preset từ GET /avatars
 * (published, show_on_user, sắp xếp theo `order` phía BE)
 */
export type PublishedAvatar = {
  id: string;
  /** URL ảnh — field chính từ API */
  link: string;
  status: string;
  order: number;
  show_on_user: boolean;
  created_at: string;
  /** Tương thích nếu môi trường khác dùng tên khác */
  url?: string;
  image_url?: string;
};

export type AvatarListQuery = {
  page?: number;
  limit?: number;
  category_id?: string;
};

export type AvatarListPayload = {
  avatars: PublishedAvatar[];
  total: number;
};

/** Lấy URL hiển thị từ item avatar (ưu tiên `link` từ BE) */
export function avatarUrl(a: PublishedAvatar): string {
  return a.link ?? a.url ?? a.image_url ?? "";
}

export const userApi = {
  /** GET /users/me — UserResponse phẳng */
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>("/users/me");
    return response.data.data;
  },

  /** PUT /users/profile — merge / partial */
  updateProfile: async (body: UpdateProfileRequest): Promise<User> => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      "/users/profile",
      body,
    );
    return response.data.data;
  },

  /**
   * GET /avatars — danh sách avatar (published, show_on_user)
   * Query: page, limit, category_id
   */
  getAvatars: async (
    params?: AvatarListQuery,
  ): Promise<AvatarListPayload> => {
    const response = await axiosInstance.get<
      ApiResponse<AvatarListPayload | PublishedAvatar[]>
    >("/avatars", { params });
    const raw = response.data.data;
    if (raw && typeof raw === "object" && !Array.isArray(raw) && "avatars" in raw) {
      const payload = raw as AvatarListPayload;
      return {
        avatars: Array.isArray(payload.avatars) ? payload.avatars : [],
        total: typeof payload.total === "number" ? payload.total : payload.avatars?.length ?? 0,
      };
    }
    if (Array.isArray(raw)) {
      const list = raw as PublishedAvatar[];
      return { avatars: list, total: list.length };
    }
    return { avatars: [], total: 0 };
  },
};
