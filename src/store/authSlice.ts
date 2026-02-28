import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = {
  id: string;
  name: string;
  description: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  phone: string;
  dob: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: string[];
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
