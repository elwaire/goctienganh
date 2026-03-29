// constants/navigation.ts

import { Book, MessageSquareText, Notebook, Zap } from "lucide-react";

export const SECTIONS_SIDEBAR = [
  // { nameKey: "dashboard", icon: Home, href: "/" },
  { nameKey: "vocabularySet", icon: Book, href: "/vocabulary-set" },
  { nameKey: "activeLearning", icon: Zap, href: "/active-learning" },
  { nameKey: "exam", icon: Notebook, href: "/exam" },
  { nameKey: "feedback", icon: MessageSquareText, href: "/feedback" },
];
