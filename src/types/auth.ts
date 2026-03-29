// types/auth.ts — Auth login trả user có profile lồng nhau; GET /users/me trả UserResponse phẳng (xem docs/AUTH_PROFILE_FE.md)

export type Role = {
  description: string;
  id: string;
  name: string;
};

/** Profile lồng trong user khi login / register / Google / refresh */
export type UserProfileNested = {
  fullname: string;
  avatar: string;
  phone: string;
  dob?: string | null;
  bio: string;
  current_level: string;
  goal: string;
  interests: string;
};

/** User trong LoginResponse — thường có `profile` lồng nhau (optional nếu BE đổi) */
export type AuthLoginUser = {
  id: string;
  username: string;
  email: string;
  google_id: string | null;
  profile?: UserProfileNested;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: string[];
};

/**
 * UserResponse phẳng (GET /users/me, PUT /users/profile) — dùng trong Redux và UI.
 */
export type User = {
  id: string;
  username: string;
  email: string;
  google_id?: string | null;
  fullname: string;
  avatar: string;
  phone: string;
  dob: string | null;
  bio: string;
  current_level: string;
  goal: string;
  interests: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: string[];
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthLoginUser;
};

export type RegisterPayload = {
  email: string;
  fullname: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  fullname?: string;
  avatar?: string;
  phone?: string;
  dob?: string;
  bio?: string;
  current_level?: string;
  goal?: string;
  interests?: string;
};

/** Chuẩn hoá dob từ RFC3339 hoặc YYYY-MM-DD → ô input date */
export function dobToDateInput(dob: string | null | undefined): string {
  if (!dob) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) return dob;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/**
 * Gộp user từ login (có profile lồng) thành User phẳng giống GET /users/me.
 * Hỗ trợ fallback nếu BE trả dạng phẳng (tương thích cũ).
 */
export function normalizeAuthLoginUser(user: AuthLoginUser | User): User {
  const u = user as AuthLoginUser & Partial<User>;
  if (u.profile && typeof u.profile === "object") {
    const p = u.profile;
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      google_id: u.google_id ?? null,
      fullname: p.fullname ?? "",
      avatar: p.avatar ?? "",
      phone: p.phone ?? "",
      dob: dobToDateInput(p.dob ?? null) || null,
      bio: p.bio ?? "",
      current_level: p.current_level ?? "",
      goal: p.goal ?? "",
      interests: p.interests ?? "",
      email_verified: u.email_verified,
      created_at: u.created_at,
      updated_at: u.updated_at,
      roles: u.roles ?? [],
      permissions: u.permissions ?? [],
    };
  }
  const flat = user as Partial<User> & { id: string };
  return {
    id: flat.id,
    username: flat.username ?? "",
    email: flat.email ?? "",
    google_id: flat.google_id ?? null,
    fullname: flat.fullname ?? "",
    avatar: flat.avatar ?? "",
    phone: flat.phone ?? "",
    dob: flat.dob ? dobToDateInput(flat.dob) || flat.dob : null,
    bio: flat.bio ?? "",
    current_level: flat.current_level ?? "",
    goal: flat.goal ?? "",
    interests: flat.interests ?? "",
    email_verified: flat.email_verified ?? false,
    created_at: flat.created_at ?? "",
    updated_at: flat.updated_at ?? "",
    roles: flat.roles ?? [],
    permissions: flat.permissions ?? [],
  };
}
