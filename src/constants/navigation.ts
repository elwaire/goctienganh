// constants/navigation.ts

import { BookOpen, Home, Notebook } from "lucide-react";

export const SECTIONS_SIDEBAR = [
  { nameKey: "dashboard", icon: Home, href: "/dashboard" },
  { nameKey: "vocabularySet", icon: Home, href: "/vocabulary-set" },
  {
    nameKey: "practice",
    icon: BookOpen,
    href: "/practice",
  },
  { nameKey: "exam", icon: Notebook, href: "/exam" },
];
