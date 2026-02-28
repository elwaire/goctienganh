"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      // Already logged in → redirect to home
      window.location.href = "/";
      return;
    }
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#2855F7] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE - FORM */}
        {children}

        {/* RIGHT SIDE */}
        <div className="hidden md:flex relative items-center justify-center bg-[#2855F7] text-white p-14 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:40px_40px]" />
          <div className="relative z-10 max-w-md">
            <div className="text-green-300 text-3xl mb-6">❝</div>
            <h2 className="text-5xl font-bold leading-tight mb-8">
              Begin Your <br /> Journey.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-8">
              Join thousands of learners improving their English every day.
            </p>
            <div className="text-sm">
              <p className="font-semibold">Your English Journey</p>
              <p className="text-white/70">Smart Learning Platform</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
