// types/course.ts

export type CourseType = "english" | "uiux";

export type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
  hasNotification?: boolean;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type CourseConfig = {
  id: CourseType;
  name: string;
  icon: React.ElementType;
  color: string;
  sections: NavSection[];
};
