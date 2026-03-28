"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Zap, Loader2, Book } from "lucide-react";
import { vocabularyApi } from "@/api/vocabularyApi";
import { queryKeys } from "@/lib/queryKeys";
import FormSelect from "@/components/ui/FormSelect";
import { GAME_MODES, type GameModeConfig } from "@/constants/gameModes";

export default function ActiveLearningPage() {
  const router = useRouter();
  const t = useTranslations("common.sidebar");
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");

  // Fetch only decks that belong to the user (is_owner) or all available if preferred
  const { data: deckData, isLoading } = useQuery({
    queryKey: ["vocabularySets", "list", {}],
    queryFn: () => vocabularyApi.getSets({}),
  });

  const allDecks = deckData?.sets ?? [];
  // For training, usually users want to practice their own decks or forks
  // but let's allow any returned active deck
  const deckOptions = allDecks.map((deck) => ({
    value: deck.id,
    label: `${deck.title} (${deck.word_count} từ)`,
  }));

  const handleStartMode = (mode: GameModeConfig) => {
    if (!selectedDeckId) return;
    router.push(`${mode.path}?deckId=${selectedDeckId}`);
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Zap className="w-8 h-8 text-blue-600" />
          {t("activeLearning")}
        </h1>
        <p className="text-gray-600 mt-2">
          Học chủ động giúp bạn khắc sâu từ vựng qua nhiều phương pháp khác nhau.
          Vui lòng chọn bộ từ và phương pháp bạn muốn học.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Chọn bộ từ vựng</h2>
        </div>
        
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang tải danh sách bộ từ...
          </div>
        ) : (
          <div className="max-w-md">
            <FormSelect
              value={selectedDeckId}
              onChange={setSelectedDeckId}
              options={deckOptions}
              placeholder="-- Chọn bộ từ để bắt đầu --"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Phương pháp học</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GAME_MODES.map((mode) => {
            const isDisabled = !selectedDeckId;
            return (
              <div
                key={mode.id}
                onClick={() => !isDisabled && handleStartMode(mode)}
                className={`flex flex-col h-full p-5 rounded-2xl border-2 transition-all 
                  ${
                    isDisabled 
                      ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed" 
                      : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer group"
                  }
                `}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode.bgColor} ${mode.color}`}
                >
                  {mode.icon}
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2">{mode.name}</h3>
                <p className="text-gray-600 text-sm flex-1 mb-4">
                  {mode.description}
                </p>

                <div className="space-y-1.5 mb-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Độ khó:</span>
                    <span className={`font-semibold ${mode.color}`}>
                      {mode.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Kỳ vọng:</span>
                    <span className="font-medium text-gray-900">
                      ~{mode.estimatedTime}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isDisabled}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all text-sm
                    ${
                      isDisabled 
                        ? "bg-gray-200 text-gray-400" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }
                  `}
                >
                  Bắt đầu
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
