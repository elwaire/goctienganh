"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { authApi, getAccessToken } from "@/lib/auth";

export function ProfileWatcher({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const user = await authApi.getMe();
        dispatch(setUser(user));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // If profile fetch fails with 401 or similar, we might want to clear user
        // but let's be careful here, maybe just keep existing user if it's a network error
      }
    };

    fetchProfile();
  }, [dispatch]);

  return <>{children}</>;
}
