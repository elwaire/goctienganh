// constants/navigation.ts

import {
  Home,
  BookOpen,
  Notebook,
  FileText,
  Users,
  Headphones,
  PenTool,
  Layers,
  Palette,
  MousePointer2,
  FolderOpen,
  Languages,
  Figma,
} from "lucide-react";
import { CourseConfig, CourseType } from "@/types";

export const COURSES: Record<CourseType, CourseConfig> = {
  english: {
    id: "english",
    name: "Tiếng Anh",
    icon: Languages,
    color: "blue",
    sections: [
      {
        title: "Học tập",
        items: [
          { name: "Dashboard", icon: Home, href: "/" },
          {
            name: "Flashcards",
            icon: BookOpen,
            href: "/flashcards",
            badge: 12,
          },
          { name: "Luyện thi", icon: Notebook, href: "/exam" },
          { name: "Listening", icon: Headphones, href: "/listening" },
        ],
      },
      {
        title: "Cộng đồng",
        items: [
          { name: "Bài viết", icon: FileText, href: "/posts" },
          { name: "Thảo luận", icon: Users, href: "/community" },
        ],
      },
    ],
  },
  uiux: {
    id: "uiux",
    name: "UI/UX Design",
    icon: Figma,
    color: "purple",
    sections: [
      {
        title: "Học tập",
        items: [
          { name: "Dashboard", icon: Home, href: "/" },
          { name: "Khóa học", icon: FolderOpen, href: "/courses" },
          { name: "Bài tập", icon: PenTool, href: "/exercises" },
          { name: "Design System", icon: Layers, href: "/design-system" },
        ],
      },
      {
        title: "Tài nguyên",
        items: [
          { name: "UI Kits", icon: Palette, href: "/ui-kits" },
          { name: "Prototypes", icon: MousePointer2, href: "/prototypes" },
          { name: "Cộng đồng", icon: Users, href: "/community" },
        ],
      },
    ],
  },
};

export const COURSE_LIST = Object.values(COURSES);
