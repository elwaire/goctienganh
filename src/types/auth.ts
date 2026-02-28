// types/auth.ts

export type Role = {
  description: string;
  id: string;
  name: string;
};

export type User = {
  avatar: string;
  created_at: string;
  dob: string;
  email: string;
  email_verified: boolean;
  fullname: string;
  google_id: string;
  id: string;
  permissions: string[];
  phone: string;
  roles: Role[];
  updated_at: string;
  username: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
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
