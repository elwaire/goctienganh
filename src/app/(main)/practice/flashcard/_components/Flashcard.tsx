import { Volume2 } from "lucide-react";
import type { FlashcardWord } from "../_types";

interface FlashcardProps {
  word: FlashcardWord;
  isFlipped: boolean;
  pressedKey: string | null;
  onFlip: () => void;
  onSpeak: (text: string) => void;
}

export function Flashcard({
  word,
  isFlipped,
  pressedKey,
  onFlip,
  onSpeak,
}: FlashcardProps) {
  return (
    <div className="mb-8 perspective-1000">
      <div
        onClick={onFlip}
        className={`relative w-full aspect-[3/2] cursor-pointer transition-all duration-500 ${
          pressedKey === " " || pressedKey === "Enter" ? "scale-95" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center">
            {word.type && (
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-lg mb-4">
                {word.type}
              </span>
            )}

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {word.word}
            </h1>

            {word.phonetic && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-lg text-white/80">/{word.phonetic}/</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSpeak(word.word);
                  }}
                  className={`p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all ${
                    pressedKey === "s" ? "scale-110 bg-white/40" : ""
                  }`}
                >
                  <Volume2 className="w-5 h-5 text-white" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <span>Nhấn</span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">
                Space
              </kbd>
              <span>để lật</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center w-full">
            {word.type && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg mb-4">
                {word.type}
              </span>
            )}

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {word.meaning}
            </h2>

            {word.example && (
              <div className="bg-gray-50 rounded-xl p-5 max-w-2xl mx-auto border border-gray-200">
                <p className="text-gray-700 mb-2">
                  &quot;{word.example}&quot;
                </p>
                {word.translation && (
                  <p className="text-sm text-gray-600">{word.translation}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
