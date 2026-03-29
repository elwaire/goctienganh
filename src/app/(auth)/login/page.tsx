"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { loginUser, loginWithGoogle, saveSession, authApi } from "@/lib/auth";
import { normalizeAuthLoginUser } from "@/types/auth";
import { ApiError } from "@/lib/api";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleLogin } from "@react-oauth/google";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Standard Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      saveSession(data);
      try {
        const fullUser = await authApi.getMe();
        dispatch(setUser(fullUser));
      } catch {
        dispatch(setUser(normalizeAuthLoginUser(data.user)));
      }
      window.location.href = "/";
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Login failed. Please check your credentials.");
      } else if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    },
  });

  // Google Login Mutation
  const googleMutation = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: async (data) => {
      saveSession(data);
      try {
        const fullUser = await authApi.getMe();
        dispatch(setUser(fullUser));
      } catch {
        dispatch(setUser(normalizeAuthLoginUser(data.user)));
      }
      window.location.href = "/";
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Google login failed.");
      } else {
        setServerError("Failed to sign in with Google. Please try again.");
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError("");
    loginMutation.mutate({
      email: data.email.trim(),
      password: data.password,
    });
  };

  const isLoading = loginMutation.isPending || googleMutation.isPending;

  return (
    <div className="p-8 md:p-14 flex flex-col justify-center">
      <p className="text-sm text-gray-500 mb-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#2855F7] font-medium hover:underline"
        >
          Sign Up
        </Link>
      </p>

      <h1 className="text-3xl font-bold mb-3">Welcome back</h1>
      <p className="text-gray-500 mb-10 text-sm leading-relaxed">
        Sign in to continue your English learning journey.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Email"
          placeholder="example@email.com"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#2855F7] focus:ring-[#2855F7]"
              {...register("rememberMe")}
            />
            <span className="text-sm text-gray-500">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-[#2855F7] font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
            <p className="text-sm text-rose-500">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#2855F7] hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-lg transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">Or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleMutation.mutate(credentialResponse.credential);
            }
          }}
          onError={() => {
            setServerError("Google Login Failed");
          }}
          useOneTap
          theme="outline"
          shape="circle"
          width="100%"
        />
      </div>
    </div>
  );
}
