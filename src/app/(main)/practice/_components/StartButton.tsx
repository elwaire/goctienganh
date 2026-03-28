import { Play } from "lucide-react";

interface StartButtonProps {
  hasSelection: boolean;
  hasDeck: boolean;
  hasMode: boolean;
  onStart: () => void;
}

export function StartButton({
  hasSelection,
  hasDeck,
  hasMode,
  onStart,
}: StartButtonProps) {
  const getLabel = () => {
    if (hasSelection) return null; // render icon + text below
    if (!hasDeck && !hasMode) return "Chọn bộ từ và phương thức để bắt đầu";
    if (hasDeck && !hasMode) return "Chọn phương thức luyện tập";
    if (!hasDeck && hasMode) return "Chọn bộ từ vựng";
    return "";
  };

  return (
    <div className="mt-6">
      <button
        onClick={onStart}
        disabled={!hasSelection}
        className={`w-full px-8 py-4 rounded-xl font-bold transition-all ${
          hasSelection
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {hasSelection ? (
          <span className="flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            Bắt đầu luyện tập ngay
          </span>
        ) : (
          getLabel()
        )}
      </button>
    </div>
  );
}
