"use client";

import { WRITING_MODES } from "@/app/(main)/practice/writing/_types";
import { vocabularyApi } from "@/api/vocabularyApi";
import { GAME_MODES, type GameModeConfig } from "@/constants/gameModes";
import type {
  VocabularySet,
  WritingMode,
  SetParentBrief,
  SetListPayload,
} from "@/types/vocabulary";
import { useQuery } from "@tanstack/react-query";
import {
  Folder,
  Library,
  ChevronDown,
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
import { ButtonPrimary } from "@/components/ui";

const EMPTY_VOCAB_SET_LIST: SetListPayload = {
  mode: "flat",
  sets: [],
  total: 0,
};

const WRITING_MODE_ICONS: Record<WritingMode, ReactNode> = {
  en_to_vi: <FileText className="w-5 h-5" />,
  vi_to_en: <Languages className="w-5 h-5" />,
  fill_blank: <Type className="w-5 h-5" />,
  random: <Shuffle className="w-5 h-5" />,
};

export default function ActiveLearningPage() {
  const router = useRouter();
  const t = useTranslations("vocabulary.activeLearning");
  const [selectedDeck, setSelectedDeck] = useState<VocabularySet | null>(null);
  const [selectedParentDeck, setSelectedParentDeck] = useState<
    VocabularySet | SetParentBrief | null
  >(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

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
        : Promise.resolve(EMPTY_VOCAB_SET_LIST),
    enabled: !!parentIdForChildren,
  });

  const { data: selectedDeckData, isLoading: isLoadingWords } = useQuery({
    queryKey: ["vocabularySets", "detail", selectedDeck?.id],
    queryFn: () => vocabularyApi.getSet(selectedDeck!.id),
    enabled: !!selectedDeck?.id,
  });

  const allDecks = deckData?.sets ?? [];
  const rootDecks = allDecks.filter((d) => !d.parent_id);
  const parentDecks = rootDecks.filter((d) => (d.child_count ?? 0) > 0);
  const standaloneDecks = rootDecks.filter((d) => (d.child_count ?? 0) === 0);
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
      setShowFolderModal(true);
      return;
    }

    // If selecting a leaf deck directly (common or from modal)
    setSelectedParentDeck(deck.parent_id ? (deck.parent ?? null) : null);
    setSelectedDeck(deck);
    setShowFolderModal(false);

    // Scroll down to the preview section
    setTimeout(() => {
      document
        .getElementById("preview-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 w-full space-y-12">
      {/* Header Section */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-2">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              {t("title")}
            </h1>
            <p className="text-neutral-500">
              {t("description")}
            </p>
          </div>

          <ButtonPrimary
            variant="outline"
            onClick={() => setShowTutorial(true)}
            rounded="md"
          >
            <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {t("tutorialButton")}
          </ButtonPrimary>
        </div>
      </section>

      {/* STEP 1: CHOOSE SET */}
      <section id="step-1-sets" className="scroll-mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-200">
            1
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t("step1.title")}</h2>
            <p className="text-sm text-gray-500">
              {t("step1.description")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Section 1: Folder Sets */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-4 border-neutral-100 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[100px] max-h-[480px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center py-12 text-gray-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">{t("step1.loading") || "Loading..."}</p>
                </div>
              ) : parentDecks.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {t("step1.noFoldersFound")}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-6 px-1">
                    <Folder className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold">{t("step1.foldersTitle")}</h3>
                    <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-200 ml-auto">
                      {t("step1.foldersCount", { count: parentDecks.length })}
                    </span>
                  </div>

                  {parentDecks.map((deck) => {
                    const isParentSelected = selectedParentDeck?.id === deck.id;
                    const isAnyChildSelected =
                      selectedDeck?.parent_id === deck.id;
                    return (
                      <div key={deck.id} className="space-y-2">
                        <div
                          role="button"
                          onClick={() => handleSelectDeck(deck)}
                          className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                            isAnyChildSelected
                              ? "border-blue-200 bg-blue-50/50 ring-1 ring-blue-100"
                              : "border-gray-200 bg-gray-50/30 hover:border-primary-300 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${isAnyChildSelected ? "bg-blue-100 text-blue-600" : "bg-white text-amber-500 "}`}
                            >
                              <Folder className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-bold text-sm truncate ${isAnyChildSelected ? "text-blue-700" : "text-gray-900"}`}
                              >
                                {deck.title}
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                {t("step1.childCount", { count: deck.child_count || 0 })} · {t("step1.wordCount", { count: deck.word_count || 0 })}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Standalone Sets */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[100px] max-h-[480px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center py-12 text-gray-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">{t("step1.loading") || "Loading..."}</p>
                </div>
              ) : standaloneDecks.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {t("step1.noStandaloneFound")}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-6  px-1">
                    <Library className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">{t("step1.standaloneTitle")}</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200 ml-auto">
                      {t("step1.standaloneCount", { count: standaloneDecks.length })}
                    </span>
                  </div>

                  {standaloneDecks.map((deck) => {
                    const isSelected = selectedDeck?.id === deck.id;
                    return (
                      <div
                        key={deck.id}
                        role="button"
                        onClick={() => handleSelectDeck(deck)}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100"
                            : "border-gray-100 bg-gray-50/30 hover:border-primary-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${isSelected ? "bg-white/20 text-white" : "bg-white text-blue-500"}`}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-bold text-sm truncate ${isSelected ? "text-white" : "text-gray-900"}`}
                            >
                              {deck.title}
                            </h4>
                            <p
                              className={`text-[11px] ${isSelected ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {t("step1.wordCount", { count: deck.word_count || 0 })}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2: PREVIEW */}
      <section
        id="preview-section"
        className={`scroll-mt-8 transition-all duration-700 ${selectedDeck ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200">
            2
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("step2.title")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("step2.description")}
            </p>
          </div>
        </div>

        {selectedDeck && (
          <div className="bg-white rounded-2xl border-4 border-neutral-100 p-6 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedDeck.title}
                </h3>
                <p className="text-sm text-blue-600 font-medium">
                  {t("step2.count", { count: selectedDeck.word_count || 0 })}
                </p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {isLoadingWords ? (
              <div className="flex flex-col items-center py-12 text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">{t("step2.loading")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedWords.map((word) => (
                  <div
                    key={word.id}
                    className="group p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-white transition-all"
                  >
                    <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">
                      {word.term}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {word.definition}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* STEP 3: CHOOSE METHODS */}
      <section
        id="modes-section"
        className={`scroll-mt-8 pb-12 transition-all duration-700 delay-100 ${selectedDeck ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-200">
            3
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("step3.title")}
            </h2>
            <p className="text-sm text-gray-500">
              {t("step3.description")}
            </p>
          </div>
        </div>

        {selectedDeck && (
          <div className="space-y-12">
            {/* Luyện viết Group */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase text-gray-800  tracking-widest">
                  {t("step3.writingGroup")}
                </h3>
                <div className="h-[2px] flex-1 bg-neutral-200 mx-4" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WRITING_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleStartWritingMode(mode.id)}
                    className="flex flex-col text-left p-5 rounded-2xl border-2 border-neutral-200 cursor-pointer bg-white hover:border-blue-500 hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform" />
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 ">
                      {WRITING_MODE_ICONS[mode.id]}
                    </div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">
                      {mode.name}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {mode.description}
                    </p>
                    <div className="mt-auto flex items-center gap-1.5 text-blue-600 font-bold text-[11px] uppercase tracking-wider">
                      {t("step3.startNow")}
                      <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nghe Group */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">
                  {t("step3.listeningGroup")}
                </h3>
                <div className="h-[2px] flex-1 bg-neutral-200 mx-4" />
              </div>
              <button
                type="button"
                onClick={() => handleStartListening()}
                className="w-full flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border-2 border-neutral-200 cursor-pointer bg-white hover:border-indigo-500 hover:shadow-xl transition-all group"
              >
                <div className="w-20 h-20 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0  group-hover:scale-105 transition-transform">
                  <Headphones className="w-10 h-10" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-semibold text-gray-900 text-xl mb-1">
                    {t("step3.listeningMethodTitle")}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("step3.listeningMethodDesc")}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-semibold uppercase">
                      {t("step3.fastReflex")}
                    </span>
                    <span className="px-3 py-2 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-semibold uppercase">
                      {t("step3.ipaStandard")}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium text-sm   group-hover:bg-primary-600 transition-colors">
                  {t("step3.learnNow")}
                </div>
              </button>
            </div>

            {/* Flashcard Group */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">
                  {t("step3.quickReviewGroup")}
                </h3>
                <div className="h-[2px] flex-1 bg-neutral-200 mx-4" />
              </div>
              {GAME_MODES.filter((m) => m.id === "flashcard").map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleStartMode(mode)}
                  className="w-full flex flex-col md:flex-row items-center gap-6 p-8 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-white hover:border-primary-500 hover:shadow-xl transition-all group"
                >
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-12 transition-transform ${mode.bgColor} ${mode.color}`}
                  >
                    {mode.icon}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h3 className="font-semibold text-2xl text-gray-900">
                        {mode.name}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${mode.bgColor} ${mode.color}`}
                      >
                        {mode.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 max-w-lg">
                      {mode.description}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> {t("step3.relaxing")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-red-400" /> {t("step3.noPressure")}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-10 h-10 text-gray-200 group-hover:text-primary-500 transition-all hidden md:block" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Folder Selection Modal */}
      {showFolderModal && selectedParentDeck && (
        <div
          className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setShowFolderModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="  text-amber-500 flex items-center justify-center">
                  <Folder className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                    {selectedParentDeck.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("folderModal.description")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFolderModal(false)}
                className="p-3 hover:bg-gray-100 rounded-xl cursor-pointer text-gray-400 transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
              {isLoadingChildren ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                    {t("folderModal.loading")}
                  </p>
                </div>
              ) : childDecks.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-400 font-medium italic">
                    {t("folderModal.empty")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {childDecks.map((child) => {
                    const isSelected = selectedDeck?.id === child.id;
                    return (
                      <div
                        key={child.id}
                        role="button"
                        onClick={() => handleSelectDeck(child)}
                        className={`group p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 shadow-blue-100"
                            : "border-gray-100 bg-white hover:border-primary-500  hover:shadow-lg  "
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`p-2 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-neutral-200"}`}
                          >
                            <BookOpen className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <h4
                          className={`font-semibold text-sm leading-tight line-clamp-2 ${isSelected ? "text-blue-700" : "text-gray-900"}`}
                        >
                          {child.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-auto font-semibold uppercase tracking-wider">
                          {t("step1.wordCount", { count: child.word_count || 0 })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-8 pt-0 mt-2">
              <ButtonPrimary
                onClick={() => setShowFolderModal(false)}
                rounded="md"
                className="w-full mt-4"
              >
                {t("folderModal.close")}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div
          className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setShowTutorial(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-[500px] w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Library className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  {t("tutorial.title")}
                </h3>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: t("tutorial.step1Title"),
                  desc: t("tutorial.step1Desc"),
                },
                {
                  step: 2,
                  title: t("tutorial.step2Title"),
                  desc: t("tutorial.step2Desc"),
                },
                {
                  step: 3,
                  title: t("tutorial.step3Title"),
                  desc: t("tutorial.step3Desc"),
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0 border border-blue-100 shadow-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 text-base">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all text-sm shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
              >
                {t("tutorial.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
