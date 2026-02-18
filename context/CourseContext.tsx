// context/CourseContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CourseType, CourseConfig } from "@/types";
import { COURSES } from "@/constants";

type CourseContextType = {
  currentCourse: CourseType;
  courseConfig: CourseConfig;
  setCourse: (course: CourseType) => void;
};

const CourseContext = createContext<CourseContextType | null>(null);

const STORAGE_KEY = "learneng_current_course";

export function CourseProvider({ children }: { children: ReactNode }) {
  const [currentCourse, setCurrentCourse] = useState<CourseType>("english");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === "english" || saved === "uiux")) {
      setCurrentCourse(saved);
    }
  }, []);

  // Save to localStorage
  const setCourse = (course: CourseType) => {
    setCurrentCourse(course);
    localStorage.setItem(STORAGE_KEY, course);
  };

  const courseConfig = COURSES[currentCourse];

  return (
    <CourseContext.Provider value={{ currentCourse, courseConfig, setCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
}
