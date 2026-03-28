import { BookOpen, ChevronDown, Check, TrendingUp } from "lucide-react";
import type { DeckResponse } from "@/types/flashcard";

interface DeckSelectorProps {
  decks: DeckResponse[];
  selectedDeck: DeckResponse | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (deck: DeckResponse) => void;
}

export function DeckSelector({
  decks,
  selectedDeck,
  isOpen,
  onToggle,
  onSelect,
}: DeckSelectorProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-500 transition-colors text-sm"
      >
        {selectedDeck ? (
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900">{selectedDeck.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {selectedDeck.card_count} từ
            </p>
          </div>
        ) : (
          <span className="text-gray-500">Chọn bộ từ vựng...</span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-10">
          {decks.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Chưa có bộ từ nào
            </div>
          ) : (
            decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => onSelect(deck)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  selectedDeck?.id === deck.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {deck.title}
                    </p>
                    {deck.description && (
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                        {deck.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-600">
                        {deck.card_count} từ
                      </span>
                      {deck.accuracy != null && deck.accuracy > 0 && (
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(deck.accuracy * 100)}% chính xác
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedDeck?.id === deck.id && (
                    <Check className="w-5 h-5 text-blue-600 shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/** Info box for the selected deck */
export function SelectedDeckInfo({ deck }: { deck: DeckResponse }) {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">
            Bộ từ đã chọn:
          </p>
          <p className="font-bold text-gray-900 text-sm">{deck.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <BookOpen className="w-3 h-3 text-blue-600" />
          <span className="font-medium">{deck.card_count} từ</span>
        </div>
        {deck.accuracy != null && deck.accuracy > 0 && (
          <div className="flex items-center gap-2 text-gray-700">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="font-medium">
              {Math.round(deck.accuracy * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
