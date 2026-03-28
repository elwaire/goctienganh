import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GAME_MODES } from "../_constants";
import type { GameModeConfig } from "../_constants";

interface GameModeModalProps {
  isOpen: boolean;
  deckId: string;
  deckTitle: string;
  cardCount: number;
  onClose: () => void;
}

export function GameModeModal({
  isOpen,
  deckId,
  deckTitle,
  cardCount,
  onClose,
}: GameModeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleStartGame = (mode: GameModeConfig) => {
    router.push(`${mode.path}?deckId=${deckId}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Chọn phương thức luyện tập
              </h3>
              <p className="text-gray-600 mt-1 text-sm">
                {deckTitle} • {cardCount} từ
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {GAME_MODES.map((mode) => (
              <GameModeCard
                key={mode.id}
                mode={mode}
                onStart={() => handleStartGame(mode)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GameModeCard({
  mode,
  onStart,
}: {
  mode: GameModeConfig;
  onStart: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-sm group cursor-pointer">
      <div className="flex flex-col h-full">
        <div
          className={`w-12 h-12 ${mode.bgColor} rounded-xl flex items-center justify-center mb-3 ${mode.color}`}
        >
          {mode.icon}
        </div>

        <h4 className="text-base font-bold text-gray-900 mb-1">{mode.name}</h4>
        <p className="text-xs text-gray-600 mb-3 flex-1">
          {mode.description}
        </p>

        <div className="space-y-1 mb-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Độ khó:</span>
            <span className={`font-semibold ${mode.color}`}>
              {mode.difficulty}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-semibold text-gray-900">
              ~{mode.estimatedTime}
            </span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm"
        >
          Bắt đầu
        </button>
      </div>
    </div>
  );
}
