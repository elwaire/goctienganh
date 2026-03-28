// constants/navigation.ts

import { Book, BookOpen, Home, Notebook, Trophy } from "lucide-react";

export const SECTIONS_SIDEBAR = [
  { nameKey: "dashboard", icon: Home, href: "/" },
  { nameKey: "vocabularySet", icon: Book, href: "/vocabulary-set" },
  {
    nameKey: "practice",
    icon: BookOpen,
    href: "/practice",
  },
  { nameKey: "exam", icon: Notebook, href: "/exam" },
];
