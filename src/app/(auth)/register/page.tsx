"use client";

import { useState } from "react";
import FormInput from "@/components/ui/FormInput";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { registerUser, loginWithGoogle, saveSession, authApi } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleLogin } from "@react-oauth/google";

const registerSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Standard Register Mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      saveSession(data);
      try {
        const fullUser = await authApi.getMe();
        dispatch(setUser(fullUser));
      } catch {
        dispatch(setUser(data.user));
      }
      window.location.href = "/";
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Registration failed. Please try again.");
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
        dispatch(setUser(data.user));
      }
      window.location.href = "/";
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setServerError(error.response?.data?.message || "Google signup failed.");
      } else {
        setServerError("Failed to sign up with Google. Please try again.");
      }
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError("");
    registerMutation.mutate({
      email: data.email.trim(),
      fullname: data.fullname.trim(),
      password: data.password,
    });
  };

  const isLoading = registerMutation.isPending || googleMutation.isPending;

  return (
    <div className="p-8 md:p-14 flex flex-col justify-center">
      <p className="text-sm text-gray-500 mb-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#2855F7] font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>

      <h1 className="text-3xl font-bold mb-3">Create account</h1>
      <p className="text-gray-500 mb-10 text-sm leading-relaxed">
        Start your English learning journey today.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Full Name"
          placeholder="John Doe"
          error={errors.fullname?.message}
          {...register("fullname")}
        />

        <FormInput
          label="Email"
          placeholder="example@email.com"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          label="Password"
          placeholder="Create a password"
          type="password"
          error={errors.password?.message}
          hint="At least 6 characters"
          {...register("password")}
        />

        <FormInput
          label="Confirm Password"
          placeholder="Repeat your password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

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
          {isLoading ? "Creating account..." : "Create account"}
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
            setServerError("Google Signup Failed");
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
