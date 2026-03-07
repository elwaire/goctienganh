"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Clock,
  Tag,
  Star,
  ChevronRight,
  BookOpen,
  Zap,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "Easy" | "Medium" | "Hard";

type ExamSet = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  questions: number;
  duration: number; // minutes
  points: number;
  tags: string[];
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EXAMS: ExamSet[] = [
  {
    id: "1",
    title: "Bài kiểm tra IELTS Reading",
    description:
      "Kiểm tra kỹ năng đọc hiểu học thuật theo chuẩn IELTS band 6.0–7.5",
    difficulty: "Medium",
    category: "Từ vựng",
    questions: 40,
    duration: 60,
    points: 10,
    tags: ["bài cuối môn", "IELTS", "reading"],
  },
  {
    id: "2",
    title: "OOP Concepts Quiz",
    description:
      "Kiểm tra kiến thức lập trình hướng đối tượng cơ bản đến nâng cao",
    difficulty: "Easy",
    category: "Lập trình",
    questions: 20,
    duration: 30,
    points: 8,
    tags: ["OOP", "Java", "cuối kỳ"],
  },
  {
    id: "3",
    title: "TOEIC Listening Full Test",
    description: "Bộ đề nghe đầy đủ theo format TOEIC mới nhất, 100 câu hỏi",
    difficulty: "Hard",
    category: "Nghe",
    questions: 100,
    duration: 45,
    points: 15,
    tags: ["TOEIC", "listening", "min đẹp zai"],
  },
  {
    id: "4",
    title: "Business English Vocabulary",
    description:
      "Từ vựng tiếng Anh thương mại và giao tiếp công sở chuyên nghiệp",
    difficulty: "Easy",
    category: "Từ vựng",
    questions: 15,
    duration: 20,
    points: 6,
    tags: ["business", "giao tiếp"],
  },
  {
    id: "5",
    title: "Data Structures Mid-term",
    description: "Đề thi giữa kỳ môn Cấu trúc dữ liệu và giải thuật — HK2 2024",
    difficulty: "Hard",
    category: "Lập trình",
    questions: 30,
    duration: 90,
    points: 20,
    tags: ["DSA", "giữa kỳ", "nâng cao"],
  },
  {
    id: "6",
    title: "Grammar: Tenses Mastery",
    description: "Ôn luyện các thì động từ tiếng Anh từ cơ bản đến nâng cao",
    difficulty: "Medium",
    category: "Ngữ pháp",
    questions: 25,
    duration: 35,
    points: 9,
    tags: ["grammar", "tenses"],
  },
];

// ─── Difficulty config ────────────────────────────────────────────────────────

const DIFF_CONFIG: Record<Difficulty, { label: string; className: string }> = {
  Easy: {
    label: "Easy",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  Medium: {
    label: "Medium",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  Hard: { label: "Hard", className: "bg-red-50 text-red-500 border-red-200" },
};

// ─── ExamCard ─────────────────────────────────────────────────────────────────

function ExamCard({ exam }: { exam: ExamSet }) {
  const diff = DIFF_CONFIG[exam.difficulty];

  return (
    <div className="group bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer">
      {/* Top bar */}
      <div className="px-5 pt-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${diff.className}`}
          >
            {diff.label}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-primary-200 bg-primary-50 text-primary-600">
            {exam.category}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 shrink-0">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-[11px] font-bold text-amber-600">
            {exam.points}đ
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-3 pb-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold text-neutral-800 leading-snug group-hover:text-primary-600 transition-colors">
            {exam.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
            {exam.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
              <FileText size={13} className="text-primary-500" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 leading-none">
                Questions
              </p>
              <p className="text-xs font-bold text-neutral-700 mt-0.5">
                {exam.questions} câu
              </p>
            </div>
          </div>
          <div className="w-px h-6 bg-neutral-100" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
              <Clock size={13} className="text-primary-500" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 leading-none">
                Duration
              </p>
              <p className="text-xs font-bold text-neutral-700 mt-0.5">
                {exam.duration} min
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {exam.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {exam.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-400 border border-neutral-150 bg-neutral-50 px-2 py-0.5 rounded-md"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button className="w-full py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 group/btn">
          Bắt đầu làm bài
          <ChevronRight
            size={14}
            className="group-hover/btn:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_TABS = ["Tất cả", "Easy", "Medium", "Hard"] as const;

export default function PracticeExamsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTER_TABS)[number]>("Tất cả");

  const filtered = MOCK_EXAMS.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff =
      activeFilter === "Tất cả" || e.difficulty === activeFilter;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen bg-[#fefcff]">
      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* ── Page header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Practice Exams
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Test and improve your knowledge
            </p>
          </div>
          <Link href={`/flashcards/add`} className="text-primary-500">
            Add bộ bộ đề
          </Link>
          <Link href={`/flashcards/start`} className="text-primary-500">
            Chơi phờ lát cạt
          </Link>
          {/* Quick stats */}
          <div className="hidden md:flex items-center gap-6">
            {[
              {
                icon: <BookOpen size={14} />,
                value: MOCK_EXAMS.length,
                label: "Đề thi",
              },
              {
                icon: <Zap size={14} />,
                value: MOCK_EXAMS.reduce((a, e) => a + e.questions, 0),
                label: "Câu hỏi",
              },
              {
                icon: <Star size={14} />,
                value: MOCK_EXAMS.reduce((a, e) => a + e.points, 0) + "đ",
                label: "Tổng điểm",
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary-500 mb-0.5">
                  {s.icon}
                </div>
                <p className="text-lg font-bold text-neutral-800">{s.value}</p>
                <p className="text-[11px] text-neutral-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm đề thi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-300 focus:border-primary-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex gap-1.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  activeFilter === tab
                    ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-primary-300 hover:text-primary-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Count ── */}
        <p className="text-xs text-neutral-400 mb-4">
          {filtered.length} exam set{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <Search size={22} className="text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-neutral-500">
              Không tìm thấy đề thi nào
            </p>
            <p className="text-xs text-neutral-400">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
