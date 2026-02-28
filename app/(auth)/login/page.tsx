"use client";

import FormInput from "@/components/ui/FormInput";
import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";

export default function LoginPage() {
  const { fields, errors, serverError, isLoading, setField, handleSubmit } =
    useLogin();

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Email"
          placeholder="example@email.com"
          type="email"
          value={fields.email}
          onChange={(v) => setField("email", v)}
          error={errors.email}
        />

        <FormInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          value={fields.password}
          onChange={(v) => setField("password", v)}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#2855F7] focus:ring-[#2855F7]"
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

      <button
        type="button"
        className="w-full border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
      >
        Continue with Google
      </button>
    </div>
  );
}
