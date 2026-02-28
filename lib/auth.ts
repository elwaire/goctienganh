// lib/auth.ts

import Cookies from "js-cookie";
import { apiClient, ApiError } from "./api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "auth_user";

// ── API calls ───────────────────────────────────────────

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function getMe(): Promise<User> {
  return apiClient<User>("/auth/me");
}

// ── Session helpers ─────────────────────────────────────

export function saveSession(auth: AuthResponse): void {
  Cookies.set(TOKEN_KEY, auth.access_token, {
    expires: 7,
    secure: true,
    sameSite: "lax",
  });
  Cookies.set(REFRESH_KEY, auth.refresh_token, {
    expires: 30,
    secure: true,
    sameSite: "lax",
  });

  // Persist user so we don't depend on /auth/me on every page load
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  } catch {
    // localStorage may be unavailable
  }
}

export function getSavedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function clearSession(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_KEY);
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Try to refresh user from API. Falls back to saved user.
 * Only clears session on 401 (token expired/invalid).
 */
export async function loadUser(): Promise<User | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const user = await getMe();
    // Update cached user
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearSession();
      return null;
    }
    // For any other error (network, 404, 500...), use saved user
    return getSavedUser();
  }
}
