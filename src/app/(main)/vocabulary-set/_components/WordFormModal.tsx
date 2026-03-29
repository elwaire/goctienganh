import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, Copy, Check, Languages, Loader2 } from "lucide-react";
import type {
  VocabularyWord,
  CreateVocabularyWordRequest,
} from "@/types/vocabulary";
import { WORD_TYPES, EMPTY_WORD_FORM } from "../_constants";

interface WordFormModalProps {
  isOpen: boolean;
  editingCard: VocabularyWord | null;
  onClose: () => void;
  onSave: (data: CreateVocabularyWordRequest) => void;
  onSaveBulk?: (data: CreateVocabularyWordRequest[]) => void;
}

export function WordFormModal({
  isOpen,
  editingCard,
  onClose,
  onSave,
  onSaveBulk,
}: WordFormModalProps) {
  const t = useTranslations("vocabulary.form");
  const [activeTab, setActiveTab] = useState<"manual" | "json">("manual");
  const [isTranslating, setIsTranslating] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [copied, setCopied] = useState(false);

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
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleTranslate = async () => {
    if (!form.term.trim()) return;
    setIsTranslating(true);
    try {
      // MyMemory API
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(form.term)}&langpair=vi|en&mt=1`);
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        updateField("definition", data.responseData.translatedText);
      }
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
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

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("Dữ liệu JSON phải là một mảng (Array).");
      }

      const validatedData: CreateVocabularyWordRequest[] = parsed.map(
        (item, index) => {
          if (!item.term || !item.definition) {
            throw new Error(
              `Từ vựng ở vị trí thứ ${index + 1} ('${item.term || "không tên"}') thiếu trường bắt buộc (term, definition).`,
            );
          }
          return {
            term: item.term,
            phonetic: item.phonetic,
            word_type: item.word_type,
            definition: item.definition,
            example_sentence: item.example_sentence,
            example_translation: item.example_translation,
          };
        },
      );

      if (onSaveBulk) {
        onSaveBulk(validatedData);
      }
    } catch (err: any) {
      setJsonError(
        err.message || "JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.",
      );
    }
  };

  const PROMPT_TEXT = `Hãy tạo cho tôi một mảng JSON các từ vựng tiếng Anh. Mỗi đối tượng phần tử bắt buộc phải có các trường sau:
- "term" (từ vựng, kiểu String)
- "phonetic" (phiên âm, kiểu String)
- "word_type" (loại từ: "noun", "verb", "adjective", "adverb"...)
- "definition" (nghĩa tiếng Việt, kiểu String)
- "example_sentence" (câu ví dụ tiếng Anh, kiểu String)
- "example_translation" (dịch nghĩa câu ví dụ sang tiếng Việt, kiểu String).
Chỉ trả về định dạng JSON array chuẩn, không kèm theo bất kỳ văn bản giải thích nào khác.`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="sticky top-0 bg-white border-b border-gray-200 pt-5 px-5 flex flex-col z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {editingCard ? t("editTitle") : t("addTitle")}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {!editingCard && (
            <div className="flex gap-4 mt-2">
              <button
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "manual" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("manual")}
              >
                {t("manualTab")}
              </button>
              <button
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "json" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("json")}
              >
                {t("bulkTab")}
              </button>
            </div>
          )}
        </div>

        {activeTab === "manual" ? (
          <>
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
                  onChange={(e) =>
                    updateField("example_sentence", e.target.value)
                  }
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
          </>
        ) : (
          <>
            <div className="p-5 space-y-5">
              <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-2xl text-sm text-blue-900">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-base">
                    Hướng dẫn tạo dữ liệu JSON:
                  </p>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-blue-700 font-medium whitespace-nowrap"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Đã chép" : "Copy Prompt"}
                  </button>
                </div>
                <p className="mb-3 text-blue-800">
                  Bạn có thể copy đoạn yêu cầu (prompt) dưới đây và dán vào
                  ChatGPT (hoặc Claude, Gemini) để trí tuệ nhân tạo sinh ra danh
                  sách từ vựng theo đúng định dạng JSON chuẩn. Sau đó copy JSON
                  sinh ra dán vào ô bên dưới:
                </p>
                <div className="relative group">
                  <pre className="bg-white/70 p-4 rounded-xl text-[13px] font-mono overflow-x-auto border border-blue-100 whitespace-pre-wrap text-slate-700">
                    {PROMPT_TEXT}
                  </pre>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Dán mã JSON vào đây:
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    if (jsonError) setJsonError("");
                  }}
                  rows={8}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed transition-colors ${jsonError ? "border-red-300 ring-1 ring-red-100" : "border-gray-200"}`}
                  placeholder="[
  {
    &#34;term&#34;: &#34;Accomplish&#34;,
    &#34;phonetic&#34;: &#34;əˈkʌmplɪʃ&#34;,
    &#34;word_type&#34;: &#34;verb&#34;,
    &#34;definition&#34;: &#34;Hoàn thành, đạt được&#34;,
    &#34;example_sentence&#34;: &#34;She accomplished her goal.&#34;,
    &#34;example_translation&#34;: &#34;Cô ấy đã hoàn thành mục tiêu.&#34;
  }
]"
                />
                {jsonError && (
                  <div className="mt-2.5 text-red-600 text-sm flex items-start gap-1.5">
                    <X className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{jsonError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-5 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleJsonSubmit}
                disabled={!jsonInput.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tạo hàng loạt
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
