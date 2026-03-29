"use client";

import { vocabularyApi } from "@/api/vocabularyApi";
import { GAME_MODES, type GameModeConfig } from "@/constants/gameModes";
import type { VocabularySet } from "@/types/vocabulary";
import { useQuery } from "@tanstack/react-query";
import {
  Book,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Zap,
  HelpCircle,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ActiveLearningPage() {
  const router = useRouter();
  const t = useTranslations("common.sidebar");
  const [selectedDeck, setSelectedDeck] = useState<VocabularySet | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Fetch only decks that belong to the user (is_owner) or all available if preferred
  const { data: deckData, isLoading } = useQuery({
    queryKey: ["vocabularySets", "list", {}],
    queryFn: () => vocabularyApi.getSets({}),
  });

  const { data: selectedDeckData, isLoading: isLoadingWords } = useQuery({
    queryKey: ["vocabularySets", "detail", selectedDeck?.id],
    queryFn: () => vocabularyApi.getSet(selectedDeck!.id),
    enabled: !!selectedDeck?.id,
  });

  const allDecks = deckData?.sets ?? [];
  const selectedWords = selectedDeckData?.words ?? [];

  const handleStartMode = (mode: GameModeConfig) => {
    if (!selectedDeck) return;
    router.push(`${mode.path}?deckId=${selectedDeck.id}`);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-1">
            {t("activeLearning")}
          </h1>
          <p className="text-sm text-neutral-500">
            Khắc sâu từ vựng qua nhiều phương pháp. Hãy chọn bộ từ và cách học.
          </p>
        </div>
        <button
          onClick={() => setShowTutorial(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
        >
          <HelpCircle className="w-4 h-4" />
          Hướng dẫn
        </button>
      </div>

      <div className="mb-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-800">
            1. Chọn bộ từ vựng
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 py-10 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p>Đang tải danh sách bộ từ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-2">
            {allDecks.map((deck) => {
              const isSelected = selectedDeck?.id === deck.id;
              return (
                <div
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20"
                      : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 className="w-5 h-5 fill-current bg-white rounded-full" />
                    </div>
                  )}
                  <h3
                    className={`font-bold mb-1 line-clamp-1 ${isSelected ? "text-blue-700" : "text-gray-900"}`}
                  >
                    {deck.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{deck.word_count} từ</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Word Preview */}
      {selectedDeck && (
        <div className="mb-8 bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Duyệt từ vựng:{" "}
              <span className="text-blue-600">{selectedDeck.title}</span>
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
              {selectedDeck.word_count} từ
            </span>
          </div>

          {isLoadingWords ? (
            <div className="flex items-center gap-2 text-gray-500 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang lấy danh sách từ...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {selectedWords.map((word) => (
                <div
                  key={word.id}
                  className="p-2.5 bg-gray-50 rounded-lg border border-gray-100/50"
                >
                  <p className="font-bold text-gray-800 text-sm mb-0.5">
                    {word.term}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 italic">
                    {word.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-800">
            2. Chọn phương pháp học
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GAME_MODES.map((mode) => {
            const isDisabled = !selectedDeck;
            return (
              <div
                key={mode.id}
                onClick={() => !isDisabled && handleStartMode(mode)}
                className={`flex flex-col h-full p-5 rounded-xl border transition-all 
                  ${
                    isDisabled
                      ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                      : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer group hover:-translate-y-1"
                  }
                `}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${mode.bgColor} ${mode.color}`}
                >
                  {mode.icon}
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-1.5">
                  {mode.name}
                </h3>
                <p className="text-gray-500 text-sm flex-1 mb-5">
                  {mode.description}
                </p>

                <div className="space-y-2 mb-5 text-xs py-3 border-y border-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Độ khó</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] uppercase ${mode.bgColor} ${mode.color}`}
                    >
                      {mode.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Kỳ vọng</span>
                    <span className="font-semibold text-gray-700">
                      {mode.estimatedTime}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isDisabled}
                  className={`w-full py-2.5 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-1.5
                    ${
                      isDisabled
                        ? "bg-gray-100 text-gray-400"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow shadow-blue-200/50"
                    }
                  `}
                >
                  Bắt đầu ngay
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowTutorial(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-[480px] w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Hướng dẫn học chủ động
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">
                    Chọn bộ từ vựng
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Nhấp chuột vào một bộ từ vựng mà bạn muốn ôn tập trong danh
                    sách có sẵn.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">
                    Duyệt trước từ vựng
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Sau khi chọn, bạn có thể lướt nhanh danh sách các từ có
                    trong bộ để nhắc nhớ trí nhớ.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm">
                    Bắt đầu học
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Chọn một trong 3 phương pháp (Flashcard, Chép chính tả, Học
                    qua file Audio) và bấm Bắt đầu.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
              >
                Tuyệt vời. Đã hiểu!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
