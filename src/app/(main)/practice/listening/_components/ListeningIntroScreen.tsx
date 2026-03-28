import { Headphones, Play, Info, Keyboard, Loader2 } from "lucide-react";
import type { DeckResponse } from "@/types/flashcard";

interface ListeningIntroScreenProps {
  deck: DeckResponse;
  cardCount: number;
  isStarting: boolean;
  onStart: () => void;
}

export function ListeningIntroScreen({
  deck,
  cardCount,
  isStarting,
  onStart,
}: ListeningIntroScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Luyện nghe
            </h1>
            <p className="text-gray-600 text-sm">Nghe và viết lại từ vựng</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              {deck.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span>{cardCount} câu hỏi</span>
              <span>•</span>
              <span>~{Math.max(2, Math.ceil(cardCount * 1.5))} phút</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900 text-sm">
                Loại câu hỏi:
              </h4>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p>• Nghe tiếng Anh, viết lại từ</p>
              <p>• Nghe tiếng Anh, viết nghĩa</p>
              <p>• Nghe tiếng Việt, viết từ Anh</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-gray-900 text-sm">
                Phím tắt:
              </h4>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Nghe lại</span>
                <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  S
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Gửi câu trả lời</span>
                <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">
                  Enter
                </kbd>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            disabled={isStarting}
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
                Bắt đầu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
