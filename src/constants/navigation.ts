// constants/navigation.ts

import { Book, Globe, MessageSquareText, Notebook, Zap } from "lucide-react";

export const SECTIONS_SIDEBAR = [
  { nameKey: "home", icon: Globe, href: "/" },
  { nameKey: "myVocabularySet", icon: Book, href: "/vocabulary-set" },
  { nameKey: "activeLearning", icon: Zap, href: "/active-learning" },
  // { nameKey: "exam", icon: Notebook, href: "/exam" },
  { nameKey: "feedback", icon: MessageSquareText, href: "/feedback" },
];
