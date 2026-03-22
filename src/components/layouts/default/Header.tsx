"use client";

import {
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  LogOut,
  User,
  Award,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { logout as authLogout } from "@/lib/auth";

function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const displayName = user?.fullname || user?.username || "Learner";
  const displayEmail = user?.email || "";
  const roleName = user?.roles?.[0]?.name || "Student";
  const initials = getInitials(displayName);
  const isLoading = false; // We can use Redux state if needed, but for now simple

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await authLogout();
  };

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
        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full">
          🔥
          <span className="text-sm font-medium">12</span>
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
            {/* Avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                {isLoading ? "..." : initials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-neutral-700">
                {isLoading ? "Loading..." : displayName}
              </p>
              <p className="text-xs text-neutral-400">{roleName}</p>
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
                  <p className="text-sm font-medium text-neutral-800">
                    {displayName}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {displayEmail}
                  </p>
                </div>
                <div className="py-1">
                  <DropdownItem
                    icon={<User className="w-4 h-4" />}
                    label="My Profile"
                    onClick={() => {
                      setIsProfileOpen(false);
                      router.push("/profile");
                    }}
                  />
                  <DropdownItem
                    icon={<Award className="w-4 h-4" />}
                    label="Achievements"
                  />
                  <DropdownItem
                    icon={<Settings className="w-4 h-4" />}
                    label="Settings"
                  />
                </div>
                <div className="border-t border-neutral-100 pt-1">
                  <DropdownItem
                    icon={<LogOut className="w-4 h-4" />}
                    label="Sign out"
                    danger
                    onClick={() => {
                      handleLogout();
                    }}
                  />
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
  icon,
  danger = false,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2.5
        ${
          danger
            ? "text-rose-600 hover:bg-rose-50"
            : "text-neutral-600 hover:bg-neutral-50"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
