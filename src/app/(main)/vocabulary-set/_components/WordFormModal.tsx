import { useState } from "react";
import { X } from "lucide-react";
import type { CardResponse, CreateCardRequest } from "@/types/flashcard";
import { WORD_TYPES, EMPTY_WORD_FORM } from "../_constants";

interface WordFormModalProps {
  isOpen: boolean;
  editingCard: CardResponse | null;
  onClose: () => void;
  onSave: (data: CreateCardRequest) => void;
}

export function WordFormModal({
  isOpen,
  editingCard,
  onClose,
  onSave,
}: WordFormModalProps) {
  const [form, setForm] = useState(() =>
    editingCard
      ? {
          term: editingCard.term,
          phonetic: editingCard.phonetic ?? "",
          word_type: editingCard.word_type ?? "noun",
          definition: editingCard.definition,
          example_sentence: editingCard.example_sentence ?? "",
          example_translation: editingCard.example_translation ?? "",
        }
      : { ...EMPTY_WORD_FORM },
  );

  if (!isOpen) return null;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      term: form.term,
      definition: form.definition,
      phonetic: form.phonetic || undefined,
      word_type: form.word_type || undefined,
      example_sentence: form.example_sentence || undefined,
      example_translation: form.example_translation || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {editingCard ? "Chỉnh sửa từ" : "Thêm từ mới"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ vựng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Accomplish"
              value={form.term}
              onChange={(e) => updateField("term", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phiên âm
              </label>
              <input
                type="text"
                placeholder="VD: əˈkʌmplɪʃ"
                value={form.phonetic}
                onChange={(e) => updateField("phonetic", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại từ
              </label>
              <select
                value={form.word_type}
                onChange={(e) => updateField("word_type", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {WORD_TYPES.map((wt) => (
                  <option key={wt.value} value={wt.value}>
                    {wt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nghĩa tiếng Việt <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: Hoàn thành, đạt được"
              value={form.definition}
              onChange={(e) => updateField("definition", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ví dụ
            </label>
            <input
              type="text"
              placeholder="VD: She accomplished her goal"
              value={form.example_sentence}
              onChange={(e) => updateField("example_sentence", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dịch ví dụ
            </label>
            <input
              type="text"
              placeholder="VD: Cô ấy đã hoàn thành mục tiêu"
              value={form.example_translation}
              onChange={(e) =>
                updateField("example_translation", e.target.value)
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 p-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.term || !form.definition}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingCard ? "Lưu thay đổi" : "Thêm từ"}
          </button>
        </div>
      </div>
    </div>
  );
}
