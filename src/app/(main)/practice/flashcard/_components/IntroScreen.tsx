import { BookOpen, Keyboard, Play, Loader2 } from "lucide-react";
import type { DeckResponse } from "@/types/flashcard";
import { INTRO_SHORTCUTS } from "../_constants";

interface IntroScreenProps {
  deck: DeckResponse;
  cardCount: number;
  isStarting: boolean;
  onStart: () => void;
}

export function IntroScreen({
  deck,
  cardCount,
  isStarting,
  onStart,
}: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Flashcard
            </h1>
            <p className="text-gray-600">
              Lật thẻ để xem nghĩa và ghi nhớ từ vựng
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">{deck.title}</h3>
            {deck.description && (
              <p className="text-sm text-gray-600 mb-3">{deck.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <span>{cardCount} từ</span>
              <span>•</span>
              <span>~{Math.max(1, Math.ceil(cardCount / 2))} phút</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Phím tắt:</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {INTRO_SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.description}
                  className="flex items-center justify-between"
                >
                  <span>{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                    {shortcut.keys[0]}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onStart}
            disabled={isStarting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang chuẩn bị...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Bắt đầu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
