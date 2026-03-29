import { axiosInstance } from "@/lib/axios";
import type { AuthLoginUser } from "@/types/auth";

type AuthApiResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: AuthLoginUser;
  };
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: AuthLoginUser;
};

export const authApi = {
  /** POST /auth/login - Authenticate user with email and password */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<AuthApiResponse>("/auth/login", {
      email,
      password,
    });
    return {
      access_token: response.data.data.access_token,
      refresh_token: response.data.data.refresh_token,
      user: response.data.data.user,
    };
  },

  /** POST /auth/google - Verify Google ID token and authenticate user */
  loginWithGoogle: async (credential: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post<AuthApiResponse>("/auth/google", {
      credential,
    });
    return {
      access_token: response.data.data.access_token,
      refresh_token: response.data.data.refresh_token,
      user: response.data.data.user,
    };
  },

  /** POST /auth/refresh - Refresh tokens using refresh_token */
  refresh: async (refresh_token: string): Promise<{ access_token: string; refresh_token: string }> => {
    const response = await axiosInstance.post<{
      success: boolean;
      data: { access_token: string; refresh_token: string };
    }>("/auth/refresh", {
      refresh_token,
    });
    return response.data.data;
  },
};