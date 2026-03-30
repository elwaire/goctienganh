"use client";

import { WRITING_MODES } from "@/app/(main)/practice/writing/_types";
import { vocabularyApi } from "@/api/vocabularyApi";
import { GAME_MODES, type GameModeConfig } from "@/constants/gameModes";
import type { VocabularySet, WritingMode } from "@/types/vocabulary";
import { useQuery } from "@tanstack/react-query";
import {
  Book,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Headphones,
  Languages,
  Loader2,
  Shuffle,
  Type,
  Volume2,
  Zap,
  HelpCircle,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const WRITING_MODE_ICONS: Record<WritingMode, ReactNode> = {
  en_to_vi: <FileText className="w-5 h-5" />,
  vi_to_en: <Languages className="w-5 h-5" />,
  fill_blank: <Type className="w-5 h-5" />,
  random: <Shuffle className="w-5 h-5" />,
};

export default function ActiveLearningPage() {
  const router = useRouter();
  const t = useTranslations("common.sidebar");
  const [selectedDeck, setSelectedDeck] = useState<VocabularySet | null>(null); // chỉ leaf deck
  const [selectedParentDeck, setSelectedParentDeck] =
    useState<VocabularySet | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Fetch only decks that belong to the user (is_owner) or all available if preferred
  const { data: deckData, isLoading } = useQuery({
    queryKey: ["vocabularySets", "list", {}],
    queryFn: () => vocabularyApi.getSets({}),
  });

  const parentIdForChildren = selectedParentDeck?.id ?? null;
  const { data: childDeckData, isLoading: isLoadingChildren } = useQuery({
    queryKey: ["vocabularySets", "list", { parent_id: parentIdForChildren }],
    queryFn: () =>
      parentIdForChildren
        ? vocabularyApi.getSets({ parent_id: parentIdForChildren })
        : Promise.resolve({ sets: [], total: 0 }),
    enabled: !!parentIdForChildren,
  });

  const { data: selectedDeckData, isLoading: isLoadingWords } = useQuery({
    queryKey: ["vocabularySets", "detail", selectedDeck?.id],
    queryFn: () => vocabularyApi.getSet(selectedDeck!.id),
    enabled: !!selectedDeck?.id,
  });

  const allDecks = deckData?.sets ?? [];
  const rootDecks = allDecks.filter((d) => !d.parent_id);
  const childDecks = childDeckData?.sets ?? [];
  const selectedWords = selectedDeckData?.words ?? [];

  const handleStartMode = (mode: GameModeConfig) => {
    if (!selectedDeck) return;
    router.push(`${mode.path}?deckId=${selectedDeck.id}`);
  };

  const handleStartWritingMode = (writingMode: WritingMode) => {
    if (!selectedDeck) return;
    router.push(
      `/practice/writing?deckId=${selectedDeck.id}&mode=${writingMode}`,
    );
  };

  const handleStartListening = () => {
    const listening = GAME_MODES.find((m) => m.id === "listening");
    if (!selectedDeck || !listening) return;
    router.push(`${listening.path}?deckId=${selectedDeck.id}`);
  };

  const handleSelectDeck = (deck: VocabularySet) => {
    const hasChildren = (deck.child_count ?? 0) > 0;
    if (hasChildren) {
      setSelectedParentDeck(deck);
      setSelectedDeck(null);
      return;
    }
    setSelectedParentDeck(deck.parent_id ? deck.parent ?? null : null);
    setSelectedDeck(deck);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto py-4 px-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-1">
            {t("activeLearning")}
          </h1>
          <p className="text-sm text-neutral-500">
            Chọn bộ từ bên trái, rồi chọn cách học bên phải.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTutorial(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100 shrink-0 self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4" />
          Hướng dẫn
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-start">
        {/* Cột trái: bộ từ + xem trước */}
        <aside className="min-w-0 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-gray-400 shrink-0" />
            <h2 className="text-lg font-bold text-gray-800">Bộ từ vựng</h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {isLoading ? (
              <div className="flex items-center gap-3 py-12 text-gray-500 justify-center">
                <Loader2 className="w-6 h-6 animate-spin shrink-0" />
                <p className="text-sm">Đang tải danh sách bộ từ...</p>
              </div>
            ) : rootDecks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Chưa có bộ từ nào.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[min(420px,55vh)] overflow-y-auto pr-1 custom-scrollbar">
                {rootDecks.map((deck) => {
                  const isSelected = selectedDeck?.id === deck.id;
                  const isParentSelected = selectedParentDeck?.id === deck.id;
                  const hasChildren = (deck.child_count ?? 0) > 0;
                  return (
                    <div key={deck.id} className="flex flex-col gap-2">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectDeck(deck)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectDeck(deck);
                          }
                        }}
                        className={`relative p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected || isParentSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20"
                            : "border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                        }`}
                      >
                        {(isSelected || isParentSelected) && (
                          <div className="absolute top-2.5 right-2.5 text-blue-600">
                            <CheckCircle2 className="w-5 h-5 fill-current bg-white rounded-full" />
                          </div>
                        )}
                        <h3
                          className={`font-bold mb-1 line-clamp-2 pr-8 text-sm ${
                            isSelected || isParentSelected
                              ? "text-blue-700"
                              : "text-gray-900"
                          }`}
                        >
                          {deck.title}
                        </h3>
                        <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 shrink-0" />
                            <span>{deck.word_count} từ</span>
                          </div>
                          {hasChildren && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                              Có bộ con
                            </span>
                          )}
                        </div>
                      </div>

                      {isParentSelected && hasChildren && (
                        <div className="pl-3 border-l border-gray-100">
                          {isLoadingChildren ? (
                            <div className="flex items-center gap-2 text-gray-500 py-2 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Đang tải bộ con...
                            </div>
                          ) : childDecks.length === 0 ? (
                            <p className="text-xs text-gray-500 py-1">
                              Bộ này có bộ con, nhưng hiện chưa tải được danh sách bộ con.
                            </p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <p className="text-[11px] font-semibold text-gray-500">
                                Chọn bộ con để học (bắt buộc)
                              </p>
                              {childDecks.map((child) => {
                                const isChildSelected = selectedDeck?.id === child.id;
                                const childHasChildren = (child.child_count ?? 0) > 0;
                                return (
                                  <div
                                    key={child.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleSelectDeck(child)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleSelectDeck(child);
                                      }
                                    }}
                                    className={`relative p-3 rounded-xl border transition-all cursor-pointer text-left ${
                                      isChildSelected
                                        ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20"
                                        : "border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-white"
                                    }`}
                                  >
                                    {isChildSelected && (
                                      <div className="absolute top-2.5 right-2.5 text-blue-600">
                                        <CheckCircle2 className="w-5 h-5 fill-current bg-white rounded-full" />
                                      </div>
                                    )}
                                    <h4
                                      className={`font-bold mb-1 line-clamp-2 pr-8 text-xs ${
                                        isChildSelected ? "text-blue-700" : "text-gray-900"
                                      }`}
                                    >
                                      {child.title}
                                    </h4>
                                    <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
                                      <span>{child.word_count} từ</span>
                                      {childHasChildren && (
                                        <span className="font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                          Có bộ con
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedDeck && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-gray-800 text-sm leading-snug">
                  Xem trước:{" "}
                  <span className="text-blue-600">{selectedDeck.title}</span>
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md shrink-0">
                  {selectedDeck.word_count} từ
                </span>
              </div>

              {isLoadingWords ? (
                <div className="flex items-center gap-2 text-gray-500 py-6 justify-center text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải từ...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                  {selectedWords.map((word) => (
                    <div
                      key={word.id}
                      className="p-2.5 bg-gray-50 rounded-lg border border-gray-100/50"
                    >
                      <p className="font-bold text-gray-800 text-xs mb-0.5 line-clamp-1">
                        {word.term}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 italic">
                        {word.definition}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Cột phải: phương pháp học */}
        <section className="min-w-0 flex flex-col gap-8 lg:sticky lg:top-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-400 shrink-0" />
            <h2 className="text-lg font-bold text-gray-800">
              Phương pháp học
            </h2>
          </div>

        {/* Luyện viết từ — bốn kiểu như màn chọn mode */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-1">
            Luyện viết từ
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Chọn một kiểu: viết nghĩa (Anh → Việt), viết từ (Việt → Anh), điền
            chữ thiếu, hoặc trộn lẫn ngẫu nhiên.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WRITING_MODES.map((mode) => {
              const isDisabled = !selectedDeck;
              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleStartWritingMode(mode.id)}
                  className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all
                    ${
                      isDisabled
                        ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                        : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer"
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                      isDisabled ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {WRITING_MODE_ICONS[mode.id]}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {mode.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{mode.description}</p>
                  <p className="text-[11px] text-gray-500 italic">{mode.example}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nghe và viết từ */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-1">
            Nghe và viết từ
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Gợi ý nghĩa (VI) → nghe loa → viết đáp án; hoặc các biến thể nghe
            Anh/Việt (ngẫu nhiên mỗi câu).
          </p>
          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              disabled={!selectedDeck}
              onClick={() => selectedDeck && handleStartListening()}
              className={`flex flex-col p-5 rounded-xl border-2 text-left transition-all
                ${
                  !selectedDeck
                    ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer"
                }
              `}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Nghe và viết từ</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Trung bình · ~7 phút
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 mb-4">
                <p className="text-[10px] font-semibold text-sky-800 uppercase tracking-wide mb-2">
                  Luồng gợi ý (ví dụ)
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm">
                  <span className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    VI
                  </span>
                  <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 border border-blue-200">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                  </span>
                  <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="px-2 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                    EN
                  </span>
                </div>
                <p className="text-center text-xs text-gray-600 mt-2">
                  Nghĩa tiếng Việt → nghe phát âm → gõ từ tiếng Anh
                </p>
              </div>

              <span
                className={`inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg font-bold text-sm ${
                  !selectedDeck
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow shadow-blue-200/50"
                }`}
              >
                Bắt đầu ngay
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Flashcard */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-1">Ôn nhanh</h3>
          <p className="text-xs text-gray-500 mb-3">
            Lật thẻ xem nghĩa, không gõ đáp án.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAME_MODES.filter((m) => m.id === "flashcard").map((mode) => {
              const isDisabled = !selectedDeck;
              return (
                <div
                  key={mode.id}
                  role="button"
                  tabIndex={isDisabled ? -1 : 0}
                  onClick={() => !isDisabled && handleStartMode(mode)}
                  onKeyDown={(e) => {
                    if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleStartMode(mode);
                    }
                  }}
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
        </section>
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
                    Chọn luyện viết từ (một trong bốn kiểu), nghe và viết từ, hoặc
                    flashcard ôn nhanh, rồi bấm Bắt đầu.
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
