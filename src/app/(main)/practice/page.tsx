"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Play, Loader2, AlertCircle } from "lucide-react";
import { flashcardApi } from "@/api/flashcardApi";
import { queryKeys } from "@/lib/queryKeys";
import { GAME_MODES } from "@/constants/gameModes";
import type { DeckResponse } from "@/types/flashcard";
import {
  DeckSelector,
  SelectedDeckInfo,
  GameModeList,
  StartButton,
} from "./_components";

export default function PracticePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"my-sets" | "public">("my-sets");
  const [selectedDeck, setSelectedDeck] = useState<DeckResponse | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ─── Fetch all decks ───
  const { data: deckData, isLoading } = useQuery({
    queryKey: queryKeys.flashcardDecks.list(),
    queryFn: () => flashcardApi.getDecks(),
  });

  const allDecks = deckData?.decks ?? [];

  // Filter by tab
  const filteredDecks =
    activeTab === "my-sets"
      ? allDecks.filter((d) => d.is_owner)
      : allDecks.filter((d) => d.is_public && !d.is_owner);

  // ─── Handler ───
  const handleSelectDeck = (deck: DeckResponse) => {
    setSelectedDeck(deck);
    setShowDropdown(false);
  };

  const handleStartPractice = () => {
    if (!selectedDeck || !selectedGameMode) return;
    const mode = GAME_MODES.find((g) => g.id === selectedGameMode);
    if (mode) {
      router.push(`${mode.path}?deckId=${selectedDeck.id}`);
    }
  };

  const canStart = !!selectedDeck && !!selectedGameMode;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Luyện tập</h1>
              <p className="text-gray-600 mt-1 text-sm">
                Chọn bộ từ và phương thức luyện tập để bắt đầu
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Select Deck */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Chọn bộ từ vựng
                  </h2>
                  <p className="text-xs text-gray-600">
                    Bước 1: Chọn bộ từ bạn muốn luyện
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("my-sets")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "my-sets"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Của tôi
                </button>
                <button
                  onClick={() => setActiveTab("public")}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "public"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Khám phá
                </button>
              </div>

              {/* Deck Selector */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8 gap-2">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-500">
                    Đang tải bộ từ...
                  </span>
                </div>
              ) : (
                <DeckSelector
                  decks={filteredDecks}
                  selectedDeck={selectedDeck}
                  isOpen={showDropdown}
                  onToggle={() => setShowDropdown(!showDropdown)}
                  onSelect={handleSelectDeck}
                />
              )}

              {/* Selected Deck Info */}
              {selectedDeck && <SelectedDeckInfo deck={selectedDeck} />}
            </div>
          </div>

          {/* Right — Select Game Mode */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Chọn phương thức
                  </h2>
                  <p className="text-xs text-gray-600">
                    Bước 2: Chọn cách luyện tập
                  </p>
                </div>
              </div>

              <GameModeList
                modes={GAME_MODES}
                selectedModeId={selectedGameMode}
                selectedDeck={selectedDeck}
                onSelect={setSelectedGameMode}
              />
            </div>
          </div>
        </div>

        {/* Start Button */}
        <StartButton
          hasSelection={canStart}
          hasDeck={!!selectedDeck}
          hasMode={!!selectedGameMode}
          onStart={handleStartPractice}
        />
      </div>
    </div>
  );
}
