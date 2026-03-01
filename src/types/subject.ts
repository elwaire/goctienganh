// types/subject.ts

export type SubjectStatus = "draft" | "published" | "archived";

export type Subject = {
  bg_color: string;
  color: string;
  created_at: string;
  description: string;
  icon: string;
  id: string;
  name: string;
  order: number;
  slug: string;
  status: SubjectStatus;
  updated_at: string;
};

export type SubjectsResponse = {
  subjects: Subject[];
  total: number;
};
