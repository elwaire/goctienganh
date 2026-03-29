import Cookies from "js-cookie";
import { store, persistor } from "@/store";
import { clearUser } from "@/store/authSlice";
import type { LoginPayload, RegisterPayload, AuthResponse, User } from "@/types/auth";
import { normalizeAuthLoginUser } from "@/types/auth";
import { userApi } from "@/api/userApi";
import { axiosInstance } from "./axios";

const COOKIE_OPTIONS = { expires: 7, secure: true, sameSite: "strict" } as const;

/**
 * Auth API object grouping all authentication-related calls
 */
export const authApi = {
  /**
   * Login user via API
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<{ success: boolean; data: AuthResponse }>(
      "/auth/login",
      payload,
    );
    return response.data.data;
  },

  /**
   * Register user via API
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<{ success: boolean; data: AuthResponse }>(
      "/auth/register",
      payload,
    );
    return response.data.data;
  },

  /**
   * Login user via Google credential
   */
  loginWithGoogle: async (credential: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<{ success: boolean; data: AuthResponse }>(
      "/auth/google", // Changed from /google-login to /google based on docs
      { credential },
    );
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
    const response = await axiosInstance.post<{ success: boolean; data: { access_token: string; refresh_token: string } }>(
      "/auth/refresh",
      { refresh_token: refreshToken },
    );
    return response.data.data;
  },

  /**
   * Get current user profile (UserResponse phẳng — đồng bộ với Redux)
   */
  getMe: () => userApi.getMe(),

  /**
   * PUT /auth/password — đổi mật khẩu (JWT bắt buộc)
   */
  changePassword: async (body: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ status: string }> => {
    const response = await axiosInstance.put<{
      success: boolean;
      message?: string;
      data: { status: string };
    }>("/auth/password", body);
    if (!response.data.success) {
      throw new Error(response.data.message || "Đổi mật khẩu thất bại");
    }
    return response.data.data;
  },
};

// Aliases for compatibility if needed (or we can update the callers)
export const loginUser = authApi.login;
export const registerUser = authApi.register;
export const loginWithGoogle = authApi.loginWithGoogle;

/**
 * Save auth tokens + user to cookies/localStorage after login
 */
export const saveSession = (data: AuthResponse) => {
  Cookies.set("access_token", data.access_token, { ...COOKIE_OPTIONS });
  Cookies.set("refresh_token", data.refresh_token, { ...COOKIE_OPTIONS, expires: 30 });
  if (typeof window !== "undefined") {
    const normalized = normalizeAuthLoginUser(data.user);
    localStorage.setItem("user", JSON.stringify(normalized));
  }
};

/**
 * Get current access token from cookie
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get("access_token");
};

/**
 * Logout user: clear cookie, Redux state, and persisted state
 */
export const logout = async () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");

  // Clear Redux state
  store.dispatch(clearUser());

  // Clear persisted state (localStorage)
  await persistor.purge();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!Cookies.get("access_token");
};
