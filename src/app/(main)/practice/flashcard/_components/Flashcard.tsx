import { Volume2 } from "lucide-react";
import type { FlashcardWord } from "../_types";

interface FlashcardProps {
  word: FlashcardWord;
  isFlipped: boolean;
  pressedKey: string | null;
  direction?: "en-vi" | "vi-en";
  onFlip: () => void;
  onSpeak: (text: string) => void;
}

export function Flashcard({
  word,
  isFlipped,
  pressedKey,
  direction = "en-vi",
  onFlip,
  onSpeak,
}: FlashcardProps) {
  const isEnToVi = direction === "en-vi";

  const renderFrontContent = () => {
    if (isEnToVi) {
      return (
        <div className="text-center">
          {word.type && (
            <span className="inline-block px-2.5 py-1 bg-white/20 text-white text-xs font-medium rounded-lg mb-3">
              {word.type}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {word.word}
          </h1>
          {word.phonetic && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <p className="text-base text-white/80">/{word.phonetic}/</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(word.word);
                }}
                className={`p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all ${
                  pressedKey === "s" ? "scale-110 bg-white/40" : ""
                }`}
              >
                <Volume2 className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-center">
          {word.type && (
            <span className="inline-block px-2.5 py-1 bg-white/20 text-white text-xs font-medium rounded-lg mb-3">
              {word.type}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight px-4">
            {word.meaning}
          </h1>
        </div>
      );
    }
  };

  const renderBackContent = () => {
    if (isEnToVi) {
      return (
        <div className="text-center w-full px-4">
          {word.type && (
            <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-lg mb-3">
              {word.type}
            </span>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 px-4">
            {word.meaning}
          </h2>
          {word.example && (
            <div className="bg-gray-50 rounded-xl p-4 max-w-xl mx-auto border border-gray-100">
              <p className="text-gray-700 mb-1 text-sm md:text-base">
                &quot;{word.example}&quot;
              </p>
              {word.translation && (
                <p className="text-xs md:text-sm text-gray-500 italic">{word.translation}</p>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-center w-full px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {word.word}
          </h2>
          {word.phonetic && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-base text-gray-500">/{word.phonetic}/</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(word.word);
                }}
                className={`p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all ${
                  pressedKey === "s" ? "scale-110 bg-gray-300" : ""
                }`}
              >
                <Volume2 className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          )}
          {word.example && (
            <div className="bg-gray-50 rounded-xl p-4 max-w-xl mx-auto border border-gray-100 mt-2">
              <p className="text-gray-700 mb-1 text-sm md:text-base">
                &quot;{word.example}&quot;
              </p>
              {word.translation && (
                <p className="text-xs md:text-sm text-gray-500 italic">{word.translation}</p>
              )}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="mb-6 perspective-1000">
      <div
        onClick={onFlip}
        className={`relative w-full max-w-2xl mx-auto min-h-[300px] cursor-pointer transition-all duration-500 ${
          pressedKey === " " || pressedKey === "Enter" ? "scale-95" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-blue-600 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {renderFrontContent()}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {renderBackContent()}
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
