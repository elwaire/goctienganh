import { PenTool, Play, Check, Keyboard, Loader2, Shuffle } from "lucide-react";
import { FileText, Languages, Type } from "lucide-react";
import type { WritingMode } from "@/types/vocabulary";
import type { VocabularySetWithWords } from "@/types/vocabulary";
import { WRITING_MODES } from "../_types";

const MODE_ICONS: Record<WritingMode, React.ReactNode> = {
  en_to_vi: <FileText className="w-6 h-6" />,
  vi_to_en: <Languages className="w-6 h-6" />,
  fill_blank: <Type className="w-6 h-6" />,
  random: <Shuffle className="w-6 h-6" />,
};

interface WritingIntroScreenProps {
  deck: VocabularySetWithWords;
  cardCount: number;
  selectedMode: WritingMode | null;
  isStarting: boolean;
  onSelectMode: (mode: WritingMode) => void;
  onStart: () => void;
}

export function WritingIntroScreen({
  deck,
  cardCount,
  selectedMode,
  isStarting,
  onSelectMode,
  onStart,
}: WritingIntroScreenProps) {
  return (
    <div className="min-h-screen  flex items-center justify-center ">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Luyện viết từ
            </h1>
            <p className="text-gray-600 text-sm">
              Chọn phương thức luyện tập và bắt đầu
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              {deck.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span>{cardCount} từ vựng</span>
              <span>•</span>
              <span>~{Math.max(2, Math.ceil(cardCount * 1.5))} phút</span>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Chọn phương thức luyện tập:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WRITING_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode(mode.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedMode === mode.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      selectedMode === mode.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {MODE_ICONS[mode.id]}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">
                    {mode.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {mode.description}
                  </p>
                  <p className="text-xs text-gray-500 italic">{mode.example}</p>
                  {selectedMode === mode.id && (
                    <div className="mt-3 flex items-center gap-1 text-blue-600">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Đã chọn</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900 text-sm">Phím tắt:</h4>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Gửi câu trả lời / Câu tiếp theo</span>
                <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  Enter
                </kbd>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            disabled={!selectedMode || isStarting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang chuẩn bị...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {selectedMode ? "Bắt đầu" : "Chọn phương thức để bắt đầu"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
