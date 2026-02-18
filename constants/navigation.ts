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
          { name: "Dashboard", icon: Home, href: "/dashboard" },
          {
            name: "Flashcards",
            icon: BookOpen,
            href: "/flashcards",
            badge: 12,
          },
          { name: "Luyện tập", icon: Notebook, href: "/exam" },
        ],
      },
      // {
      //   title: "Cộng đồng",
      //   items: [
      //     { name: "Bài viết", icon: FileText, href: "/posts" },
      //     { name: "Thảo luận", icon: Users, href: "/community" },
      //   ],
      // },
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
          { name: "Bài tập", icon: PenTool, href: "/exam" },
        ],
      },
      {
        title: "Tài nguyên",
        items: [
          {
            name: "Tài liệu",
            icon: FileText,
            href: "https://www.elwaire.com/resources",
          },
        ],
      },
    ],
  },
};

export const COURSE_LIST = Object.values(COURSES);
