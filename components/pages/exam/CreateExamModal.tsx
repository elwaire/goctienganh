import { Difficulty, ExamCategory } from "@/types";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";

// Create Exam Modal Component
export default function CreateExamModal({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExamCategory>("fundamentals");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [duration, setDuration] = useState("15");

  // Animation
  useState(() => {
    setTimeout(() => setIsVisible(true), 50);
  });

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle create exam
    console.log({ title, description, category, difficulty, duration });
    handleClose();
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-colors duration-200
        ${isVisible ? "bg-black/50" : "bg-transparent"}
      `}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-lg bg-white rounded-2xl shadow-xl
          transition-all duration-300
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Tạo bộ đề mới
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Tùy chỉnh bài kiểm tra theo cách của bạn
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-neutral-500 rotate-45" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Tên bộ đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Ôn tập UI Components"
              className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về bộ đề..."
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
            />
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Chủ đề
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExamCategory)}
                className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option value="fundamentals">Nền tảng</option>
                <option value="ui">UI Design</option>
                <option value="ux">UX Design</option>
                <option value="tools">Công cụ</option>
                <option value="case-study">Case Study</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Độ khó
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Thời gian (phút)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="5"
              max="120"
              className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Bước tiếp theo</p>
              <p className="text-blue-600">
                Sau khi tạo, bạn có thể thêm câu hỏi từ ngân hàng đề hoặc tự tạo
                câu hỏi mới.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-3 px-4 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
            >
              Tạo bộ đề
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
