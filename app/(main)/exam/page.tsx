// app/(main)/exam/page.tsx

"use client";

import { ExamCard, StatsCard } from "@/components/pages/exam";
import CreateExamModal from "@/components/pages/exam/CreateExamModal";
import { EmptyState, TabButton } from "@/components/ui";
import { Exam, ExamCategory, TabType } from "@/types";
import {
  BookOpen,
  FolderPlus,
  Grid3X3,
  Layers,
  MousePointer2,
  Palette,
  PenTool,
  Plus,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

// Mock data - Bài thi chính thức
const officialExams: Exam[] = [
  {
    id: "1",
    title: "UI/UX Fundamentals",
    description: "Kiểm tra kiến thức nền tảng về thiết kế UI/UX",
    category: "fundamentals",
    icon: BookOpen,
    color: "blue",
    duration: "15 phút",
    questions: 20,
    difficulty: "easy",
    attempts: 1250,
    bestScore: 92,
    isOfficial: true,
  },
  {
    id: "2",
    title: "Design Principles",
    description:
      "Các nguyên tắc thiết kế: Contrast, Alignment, Repetition, Proximity",
    category: "fundamentals",
    icon: Grid3X3,
    color: "emerald",
    duration: "20 phút",
    questions: 25,
    difficulty: "medium",
    attempts: 890,
    bestScore: 88,
    isOfficial: true,
  },
  {
    id: "3",
    title: "Color Theory & Typography",
    description: "Lý thuyết màu sắc và typography trong thiết kế",
    category: "ui",
    icon: Palette,
    color: "rose",
    duration: "25 phút",
    questions: 30,
    difficulty: "medium",
    attempts: 756,
    isOfficial: true,
  },
  {
    id: "4",
    title: "User Research Methods",
    description: "Các phương pháp nghiên cứu người dùng",
    category: "ux",
    icon: Users,
    color: "purple",
    duration: "30 phút",
    questions: 35,
    difficulty: "hard",
    attempts: 432,
    bestScore: 75,
    isOfficial: true,
  },
  {
    id: "5",
    title: "Figma Mastery",
    description: "Thành thạo công cụ thiết kế Figma",
    category: "tools",
    icon: PenTool,
    color: "orange",
    duration: "20 phút",
    questions: 25,
    difficulty: "medium",
    attempts: 1100,
    bestScore: 95,
    isOfficial: true,
  },
  {
    id: "6",
    title: "Prototyping & Interaction",
    description: "Tạo prototype và thiết kế tương tác",
    category: "tools",
    icon: MousePointer2,
    color: "cyan",
    duration: "25 phút",
    questions: 20,
    difficulty: "hard",
    attempts: 567,
    isOfficial: true,
  },
  {
    id: "7",
    title: "Design System Quiz",
    description: "Xây dựng và quản lý Design System",
    category: "ui",
    icon: Layers,
    color: "indigo",
    duration: "30 phút",
    questions: 40,
    difficulty: "hard",
    attempts: 234,
    bestScore: 82,
    isOfficial: true,
  },
  {
    id: "8",
    title: "UX Case Study Analysis",
    description: "Phân tích case study UX thực tế",
    category: "case-study",
    icon: Target,
    color: "amber",
    duration: "45 phút",
    questions: 15,
    difficulty: "hard",
    attempts: 189,
    isOfficial: true,
  },
];

// Mock data - Bài thi của người dùng
const myExams: Exam[] = [
  {
    id: "my-1",
    title: "Ôn tập UI Components",
    description: "Bộ câu hỏi tự tạo về các UI components phổ biến",
    category: "ui",
    icon: Layers,
    color: "blue",
    duration: "10 phút",
    questions: 15,
    difficulty: "easy",
    attempts: 5,
    bestScore: 87,
    createdBy: "me",
  },
  {
    id: "my-2",
    title: "UX Writing Practice",
    description: "Luyện tập viết UX copy hiệu quả",
    category: "ux",
    icon: PenTool,
    color: "purple",
    duration: "15 phút",
    questions: 20,
    difficulty: "medium",
    attempts: 3,
    bestScore: 90,
    createdBy: "me",
  },
];

const categories = [
  { id: "all", label: "Tất cả", icon: Grid3X3 },
  { id: "fundamentals", label: "Nền tảng", icon: BookOpen },
  { id: "ui", label: "UI Design", icon: Palette },
  { id: "ux", label: "UX Design", icon: Users },
  { id: "tools", label: "Công cụ", icon: PenTool },
  { id: "case-study", label: "Case Study", icon: Target },
];

export default function ExamPage() {
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [activeCategory, setActiveCategory] = useState<ExamCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter exams
  const currentExams = activeTab === "explore" ? officialExams : myExams;
  const filteredExams = currentExams.filter((exam) => {
    const matchCategory =
      activeCategory === "all" || exam.category === activeCategory;
    const matchSearch = exam.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              Luyện thi UI/UX
            </h1>
            <p className="text-neutral-500">
              Kiểm tra và nâng cao kiến thức thiết kế của bạn
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary-200"
          >
            <Plus className="w-5 h-5" />
            Tạo bộ đề
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCard />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-200">
        <TabButton
          active={activeTab === "explore"}
          onClick={() => setActiveTab("explore")}
          icon={<Sparkles className="w-4 h-4" />}
          label="Khám phá"
          count={officialExams.length}
        />
        <TabButton
          active={activeTab === "my-exams"}
          onClick={() => setActiveTab("my-exams")}
          icon={<FolderPlus className="w-4 h-4" />}
          label="Bộ đề của tôi"
          count={myExams.length}
        />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ExamCategory)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exam Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isMyExam={activeTab === "my-exams"}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            activeTab === "my-exams"
              ? "Chưa có bộ đề nào"
              : "Không tìm thấy bài thi"
          }
          description={
            activeTab === "my-exams"
              ? "Tạo bộ đề riêng để luyện tập theo cách của bạn"
              : "Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác"
          }
          buttonText={activeTab === "my-exams" ? "Tạo bộ đề mới" : "Tìm kiếm"}
          onClick={
            activeTab === "my-exams" ? () => setShowCreateModal(true) : () => {}
          }
          icon={
            activeTab === "my-exams" ? (
              <FolderPlus className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )
          }
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateExamModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
