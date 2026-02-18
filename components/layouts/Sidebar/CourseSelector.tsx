// components/layouts/Sidebar/CourseSelector.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCourse } from "@/context/CourseContext";
import { COURSE_LIST } from "@/constants";

const colorMap: Record<
  string,
  { bg: string; bgLight: string; text: string; ring: string }
> = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
    ring: "ring-blue-200",
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50",
    text: "text-purple-600",
    ring: "ring-purple-200",
  },
};

export function CourseSelector() {
  const { currentCourse, courseConfig, setCourse } = useCourse();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentColors = colorMap[courseConfig.color];
  const Icon = courseConfig.icon;

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 p-2 cursor-pointer rounded-xl
          border-2 border-transparent
          transition-all duration-200
          ${currentColors.bgLight}
          hover:border-${courseConfig.color}-200
          ${isOpen ? `ring-2 ${currentColors.ring}` : ""}
        `}
      >
        <div
          className={`w-9 h-9 ${currentColors.bg} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className={`text-sm font-semibold ${currentColors.text}`}>
            {courseConfig.name}
          </p>
          <p className="text-xs text-neutral-400">Đang học</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50">
          {COURSE_LIST.map((course) => {
            const colors = colorMap[course.color];
            const CourseIcon = course.icon;
            const isSelected = currentCourse === course.id;

            return (
              <button
                key={course.id}
                onClick={() => {
                  setCourse(course.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center  gap-3 px-3 py-2.5 mx-auto
                  transition-colors
                  ${isSelected ? colors.bgLight : "hover:bg-neutral-50"}
                `}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? colors.bg : "bg-neutral-100"
                  }`}
                >
                  <CourseIcon
                    className={`w-4 h-4 ${isSelected ? "text-white" : "text-neutral-500"}`}
                  />
                </div>
                <span
                  className={`flex-1 text-left text-sm font-medium ${
                    isSelected ? colors.text : "text-neutral-600"
                  }`}
                >
                  {course.name}
                </span>
                {isSelected && <Check className={`w-4 h-4 ${colors.text}`} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
