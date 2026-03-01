// components/layouts/Sidebar/CourseSelector.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, BookOpen, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { subjectsApi } from "@/api/subjectsApi";
import { queryKeys } from "@/lib/queryKeys";
import DynamicIcon from "@/components/ui/DynamicIcon";
import type { Subject } from "@/types/subject";

const SUBJECT_COOKIE = "x-subject-id";

/**
 * Parse a CSS-like color string and return tailwind-compatible inline styles.
 * Supports hex, rgb, hsl, or plain color names from the API.
 */
function getSubjectStyles(subject: Subject) {
  const bg = subject.bg_color || "#3b82f6";
  const color = subject.color || "#2563eb";

  return {
    iconBg: { backgroundColor: color },
    lightBg: { backgroundColor: bg },
    text: { color },
    ring: { boxShadow: `0 0 0 2px ${bg}` },
  };
}

export function CourseSelector() {
  const [selectedId, setSelectedId] = useState<string>(() => {
    return Cookies.get(SUBJECT_COOKIE) || "";
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch subjects from API
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.subjects.all,
    queryFn: subjectsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const subjects = data?.subjects ?? [];

  // Auto-select first subject if none selected yet
  useEffect(() => {
    if (!selectedId && subjects.length > 0) {
      const firstId = subjects[0].id;
      setSelectedId(firstId);
      Cookies.set(SUBJECT_COOKIE, firstId, { expires: 365 });
    }
  }, [subjects, selectedId]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedSubject = subjects.find((s) => s.id === selectedId);

  const handleSelect = (subject: Subject) => {
    setSelectedId(subject.id);
    Cookies.set(SUBJECT_COOKIE, subject.id, { expires: 365 });
    setIsOpen(false);
    // Reload to apply new subject context across the app
    window.location.reload();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-50">
        <div className="w-9 h-9 bg-neutral-200 rounded-lg flex items-center justify-center animate-pulse">
          <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
        </div>
        <div className="flex-1">
          <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
          <div className="h-3 w-14 bg-neutral-100 rounded mt-1 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error or empty state
  if (isError || subjects.length === 0) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-50">
        <div className="w-9 h-9 bg-neutral-200 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-neutral-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-neutral-500">
            {isError ? "Lỗi tải môn học" : "Chưa có môn học"}
          </p>
        </div>
      </div>
    );
  }

  const currentStyles = selectedSubject
    ? getSubjectStyles(selectedSubject)
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2 cursor-pointer rounded-xl border-2 border-transparent transition-all duration-200 hover:opacity-90"
        style={{
          backgroundColor: currentStyles
            ? selectedSubject!.bg_color
            : "#f5f5f5",
          ...(isOpen && currentStyles ? currentStyles.ring : {}),
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={currentStyles?.iconBg ?? { backgroundColor: "#d4d4d4" }}
        >
          {selectedSubject?.icon ? (
            <DynamicIcon
              name={selectedSubject.icon}
              className="w-5 h-5 text-white"
            />
          ) : (
            <BookOpen className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p
            className="text-sm font-semibold"
            style={currentStyles?.text ?? { color: "#525252" }}
          >
            {selectedSubject?.name ?? "Chọn môn"}
          </p>
          <p className="text-xs text-neutral-500">Đang học</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full overflow-hidden mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50">
          {subjects.map((subject) => {
            const styles = getSubjectStyles(subject);
            const isSelected = selectedId === subject.id;

            return (
              <button
                key={subject.id}
                onClick={() => handleSelect(subject)}
                className="w-full flex items-center gap-3 cursor-pointer px-3 py-2.5 mx-auto transition-colors"
                style={{
                  backgroundColor: isSelected ? subject.bg_color : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? subject.color : "#f5f5f5",
                  }}
                >
                  {subject.icon ? (
                    <DynamicIcon
                      name={subject.icon}
                      className={`w-4 h-4 ${isSelected ? "text-white" : "text-neutral-500"}`}
                    />
                  ) : (
                    <BookOpen
                      className={`w-4 h-4 ${isSelected ? "text-white" : "text-neutral-500"}`}
                    />
                  )}
                </div>
                <span
                  className="flex-1 text-left text-sm font-medium"
                  style={isSelected ? styles.text : { color: "#525252" }}
                >
                  {subject.name}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4" style={styles.text} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
