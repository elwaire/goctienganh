"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

// Map pathname to page title
const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome back!" },
  "/flashcards": { title: "Flashcards", subtitle: "Review your vocabulary" },
  "/lessons": { title: "Lessons", subtitle: "Continue learning" },
  "/community": { title: "Community", subtitle: "Connect with learners" },
  "/progress": { title: "Progress", subtitle: "Track your journey" },
  "/settings": { title: "Settings", subtitle: "Manage your account" },
  "/help": { title: "Help Center", subtitle: "Get support" },
};

export default function Header() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pageInfo = PAGE_TITLES[pathname] || { title: "Page", subtitle: "" };

  return (
    <header className="p-3 bg-white rounded-2xl border border-slate-200  flex items-center justify-between sticky top-0 z-40">
      {/* Center - Search Bar */}
      <div className="flex-1 max-w-md  hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search lessons, flashcards..."
            className="
              w-full pl-10 pr-4 py-2 
              bg-neutral-50 border border-neutral-200 rounded-xl
              text-sm text-neutral-700 placeholder:text-neutral-400
              focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100
              transition-all
            "
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-neutral-400 bg-white border border-neutral-200 rounded-md hidden lg:inline-block">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right - Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Streak/XP Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">128 XP</span>
        </div>
        <LanguageSwitcher />

        {/* Notifications */}
        <button className="relative p-2.5 hover:bg-neutral-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-neutral-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-neutral-200 mx-2 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 hover:bg-neutral-50 rounded-xl transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
              M
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-neutral-700">Min</p>
              <p className="text-xs text-neutral-400">Student</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-medium text-neutral-800">Min</p>
                  <p className="text-xs text-neutral-400">min@example.com</p>
                </div>
                <div className="py-1">
                  <DropdownItem label="My Profile" />
                  <DropdownItem label="Achievements" />
                  <DropdownItem label="Settings" />
                </div>
                <div className="border-t border-neutral-100 pt-1">
                  <DropdownItem label="Sign out" danger />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownItem({
  label,
  danger = false,
}: {
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      className={`
        w-full px-4 py-2 text-left text-sm transition-colors
        ${
          danger
            ? "text-rose-600 hover:bg-rose-50"
            : "text-neutral-600 hover:bg-neutral-50"
        }
      `}
    >
      {label}
    </button>
  );
}
