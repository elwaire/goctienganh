import { Check } from "lucide-react";
import type { GameModeConfig } from "@/constants/gameModes";
import type { DeckResponse } from "@/types/flashcard";

interface GameModeListProps {
  modes: GameModeConfig[];
  selectedModeId: string | null;
  selectedDeck: DeckResponse | null;
  onSelect: (modeId: string) => void;
}

export function GameModeList({
  modes,
  selectedModeId,
  selectedDeck,
  onSelect,
}: GameModeListProps) {
  return (
    <div className="space-y-3">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          disabled={!selectedDeck}
          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
            selectedModeId === mode.id
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-200 hover:border-gray-300 bg-white"
          } ${!selectedDeck ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selectedModeId === mode.id ? "bg-blue-100" : "bg-gray-100"
              } ${mode.color}`}
            >
              {mode.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  {mode.name}
                </h3>
                {selectedModeId === mode.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">{mode.description}</p>

              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="font-medium text-blue-600">
                  {mode.difficulty}
                </span>
                <span>•</span>
                <span>~{mode.estimatedTime}</span>
                {selectedDeck && (
                  <>
                    <span>•</span>
                    <span>{selectedDeck.card_count} từ</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
