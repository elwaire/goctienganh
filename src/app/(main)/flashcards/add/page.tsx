"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  AlignLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Volume2,
  ChevronRight,
} from "lucide-react";
import { flashcardApi } from "@/lib/flashcard-api";
import type { CreateCardRequest, DeckStatus } from "@/types/flashcard";

// ─── Constants ────────────────────────────────────────────────────────────────

const TARGET_LANGUAGES = [
  { value: "en", label: "Tiếng Anh (en)" },
  { value: "ja", label: "Tiếng Nhật (ja)" },
  { value: "ko", label: "Tiếng Hàn (ko)" },
  { value: "zh", label: "Tiếng Trung (zh)" },
  { value: "fr", label: "Tiếng Pháp (fr)" },
  { value: "vi", label: "Tiếng Việt (vi)" },
  { value: "ar", label: "Tiếng Ả Rập (ar)" },
];

const NATIVE_LANGUAGES = [
  { value: "vi", label: "Tiếng Việt (vi)" },
  { value: "en", label: "Tiếng Anh (en)" },
];

const READING_LANGS = ["ja", "zh", "ko"];
const PHONETIC_LANGS = ["en", "fr"];

const READING_LABELS: Record<string, string> = {
  ja: "Cách đọc (furigana)",
  zh: "Pinyin",
  ko: "Romanization",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type CardRow = {
  localId: string;
  serverId?: string;   // set for cards already saved to the server
  term: string;
  reading: string;
  phonetic: string;
  definition: string;
  example_sentence: string;
  example_translation: string;
  isDeleted: boolean;
};

type DeckForm = {
  title: string;
  description: string;
  target_language: string;
  native_language: string;
  tags: string[];
  is_public: boolean;
  status: DeckStatus;
};

const uid = () => Math.random().toString(36).slice(2, 8);

const EMPTY_CARD = (): CardRow => ({
  localId: uid(),
  term: "",
  reading: "",
  phonetic: "",
  definition: "",
  example_sentence: "",
  example_translation: "",
  isDeleted: false,
});

const DEFAULT_DECK_FORM: DeckForm = {
  title: "",
  description: "",
  target_language: "",
  native_language: "vi",
  tags: [],
  is_public: false,
  status: "draft",
};

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Deck meta form ───────────────────────────────────────────────────────────

function DeckMetaForm({
  form,
  onChange,
}: {
  form: DeckForm;
  onChange: (field: keyof DeckForm, value: unknown) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) onChange("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    onChange("tags", form.tags.filter((t) => t !== tag));

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
          Tên bộ thẻ <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="VD: JLPT N3 Vocabulary"
          maxLength={255}
          className="w-full text-sm font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors placeholder:font-normal placeholder:text-neutral-300"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
          Mô tả
        </label>
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Mô tả ngắn về bộ thẻ..."
          rows={2}
          className="w-full text-sm text-neutral-700 bg-white border border-neutral-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none resize-none transition-colors placeholder:text-neutral-300 leading-relaxed"
        />
      </div>

      {/* Languages */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Ngôn ngữ học <span className="text-red-400">*</span>
          </label>
          <select
            value={form.target_language}
            onChange={(e) => onChange("target_language", e.target.value)}
            className="w-full text-sm text-neutral-800 bg-white border border-neutral-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
          >
            <option value="">Chọn ngôn ngữ...</option>
            {TARGET_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Tiếng mẹ đẻ <span className="text-red-400">*</span>
          </label>
          <select
            value={form.native_language}
            onChange={(e) => onChange("native_language", e.target.value)}
            className="w-full text-sm text-neutral-800 bg-white border border-neutral-200 rounded-xl px-4 py-3 focus:border-primary-500 focus:outline-none transition-colors"
          >
            <option value="">Chọn ngôn ngữ...</option>
            {NATIVE_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Thêm tag rồi nhấn Enter..."
            className="flex-1 text-sm text-neutral-700 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 focus:border-primary-500 focus:outline-none transition-colors placeholder:text-neutral-300"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-500 text-sm font-semibold hover:bg-neutral-200 transition-colors"
          >
            Thêm
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-[11px] bg-primary-50 text-primary-600 border border-primary-200 px-2.5 py-1 rounded-lg"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-primary-400 hover:text-primary-600 transition-colors leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visibility + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Quyền truy cập
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => onChange("is_public", !form.is_public)}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                form.is_public ? "bg-primary-500" : "bg-neutral-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.is_public ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-neutral-700">
              {form.is_public ? "Công khai" : "Riêng tư"}
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Trạng thái
          </label>
          <div className="flex gap-2">
            {(["draft", "published"] as DeckStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange("status", s)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  form.status === s
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-neutral-500 border-neutral-200 hover:border-primary-300"
                }`}
              >
                {s === "draft" ? "Nháp" : "Xuất bản"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card row ─────────────────────────────────────────────────────────────────

function CardRowItem({
  card,
  index,
  visibleTotal,
  targetLang,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  autoFocus,
}: {
  card: CardRow;
  index: number;
  visibleTotal: number;
  targetLang: string;
  onChange: (localId: string, field: keyof CardRow, value: string) => void;
  onDelete: (localId: string) => void;
  onMoveUp: (localId: string) => void;
  onMoveDown: (localId: string) => void;
  autoFocus?: boolean;
}) {
  const isFilled = card.term.trim() && card.definition.trim();
  const showReading = READING_LANGS.includes(targetLang);
  const showPhonetic = PHONETIC_LANGS.includes(targetLang);

  return (
    <div
      className={`group relative rounded-2xl border bg-white transition-all duration-200 overflow-hidden ${
        isFilled
          ? "border-neutral-200 hover:border-primary-200 hover:shadow-md"
          : "border-neutral-150 hover:border-neutral-200"
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-300 ${
          isFilled ? "bg-primary-500" : "bg-neutral-200"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between pl-5 pr-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <GripVertical size={14} className="text-neutral-300 cursor-grab" />
          <span className="text-xs font-bold text-neutral-400 tabular-nums select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          {!!card.serverId && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-400 font-semibold">
              đã lưu
            </span>
          )}
          {isFilled && !card.serverId && (
            <CheckCircle2 size={13} className="text-primary-400" />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveUp(card.localId)}
            disabled={index === 0}
            className="p-1 rounded text-neutral-300 hover:text-neutral-500 disabled:opacity-0 transition-all"
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={() => onMoveDown(card.localId)}
            disabled={index === visibleTotal - 1}
            className="p-1 rounded text-neutral-300 hover:text-neutral-500 disabled:opacity-0 transition-all"
          >
            <ChevronDown size={13} />
          </button>
          <div className="w-px h-4 bg-neutral-100 mx-1" />
          <button
            onClick={() => onDelete(card.localId)}
            disabled={visibleTotal <= 1}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-0 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="pl-5 pr-4 py-4 grid grid-cols-2 gap-x-8 gap-y-5">
        {/* Term */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Từ / Cụm từ <span className="text-red-400">*</span>
          </label>
          <input
            autoFocus={autoFocus}
            type="text"
            value={card.term}
            onChange={(e) => onChange(card.localId, "term", e.target.value)}
            placeholder="VD: Serendipity"
            className="w-full text-sm font-semibold text-neutral-800 bg-transparent placeholder:text-neutral-300 placeholder:font-normal border-b-2 border-neutral-150 focus:border-primary-500 outline-none py-1.5 transition-colors"
          />
        </div>

        {/* Reading (ja/zh/ko) */}
        {showReading && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
              {READING_LABELS[targetLang] ?? "Cách đọc"}
            </label>
            <input
              type="text"
              value={card.reading}
              onChange={(e) => onChange(card.localId, "reading", e.target.value)}
              placeholder={targetLang === "ja" ? "かんしゃ" : ""}
              className="w-full text-sm text-primary-500 bg-transparent placeholder:text-neutral-300 border-b-2 border-neutral-150 focus:border-primary-400 outline-none py-1.5 transition-colors font-mono"
            />
            <span className="text-[10px] text-neutral-300">Không bắt buộc</span>
          </div>
        )}

        {/* Phonetic (en/fr) */}
        {showPhonetic && (
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1 text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
              <Volume2 size={9} />
              Phiên âm IPA
            </label>
            <input
              type="text"
              value={card.phonetic}
              onChange={(e) => onChange(card.localId, "phonetic", e.target.value)}
              placeholder="/ˌserənˈdɪpɪti/"
              className="w-full text-sm text-primary-500 bg-transparent placeholder:text-neutral-300 border-b-2 border-neutral-150 focus:border-primary-400 outline-none py-1.5 transition-colors font-mono"
            />
            <span className="text-[10px] text-neutral-300">Không bắt buộc</span>
          </div>
        )}

        {!showReading && !showPhonetic && <div />}

        {/* Definition */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Định nghĩa <span className="text-red-400">*</span>
          </label>
          <textarea
            value={card.definition}
            onChange={(e) => onChange(card.localId, "definition", e.target.value)}
            placeholder="VD: Sự tình cờ may mắn..."
            rows={2}
            className="w-full text-sm text-neutral-700 bg-transparent placeholder:text-neutral-300 border-b-2 border-neutral-150 focus:border-primary-500 outline-none py-1.5 resize-none transition-colors leading-relaxed"
          />
        </div>

        {/* Example sentence */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            <AlignLeft size={9} />
            Câu ví dụ
          </label>
          <textarea
            value={card.example_sentence}
            onChange={(e) =>
              onChange(card.localId, "example_sentence", e.target.value)
            }
            placeholder="VD: It was pure serendipity..."
            rows={2}
            className="w-full text-sm text-neutral-500 italic bg-transparent placeholder:text-neutral-300 placeholder:not-italic border-b-2 border-neutral-150 focus:border-primary-400 outline-none py-1.5 resize-none transition-colors leading-relaxed"
          />
          <span className="text-[10px] text-neutral-300">Không bắt buộc</span>
        </div>

        {/* Example translation */}
        {card.example_sentence && (
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
              Dịch câu ví dụ
            </label>
            <input
              type="text"
              value={card.example_translation}
              onChange={(e) =>
                onChange(card.localId, "example_translation", e.target.value)
              }
              placeholder="VD: Thật tình cờ khi chúng ta gặp nhau."
              className="w-full text-sm text-neutral-500 bg-transparent placeholder:text-neutral-300 border-b-2 border-neutral-150 focus:border-primary-400 outline-none py-1.5 transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main content (needs Suspense for useSearchParams) ────────────────────────

function AddFlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");
  const isEditMode = !!deckId;

  const [step, setStep] = useState<1 | 2>(isEditMode ? 2 : 1);
  const [loadingDeck, setLoadingDeck] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deckForm, setDeckForm] = useState<DeckForm>(DEFAULT_DECK_FORM);
  const [cards, setCards] = useState<CardRow[]>([EMPTY_CARD(), EMPTY_CARD()]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Load existing deck in edit mode ───────────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !deckId) return;

    const load = async () => {
      setLoadingDeck(true);
      setError(null);
      try {
        const res = await flashcardApi.getDeck(deckId);
        const deck = res.data.data;

        setDeckForm({
          title: deck.title,
          description: deck.description ?? "",
          target_language: deck.target_language,
          native_language: deck.native_language,
          tags: deck.tags ?? [],
          is_public: deck.is_public,
          status: deck.status,
        });

        const existingCards: CardRow[] =
          deck.cards && deck.cards.length > 0
            ? deck.cards.map((c) => ({
                localId: uid(),
                serverId: c.id,
                term: c.term,
                reading: c.reading ?? "",
                phonetic: c.phonetic ?? "",
                definition: c.definition,
                example_sentence: c.example_sentence ?? "",
                example_translation: c.example_translation ?? "",
                isDeleted: false,
              }))
            : [EMPTY_CARD()];

        setCards(existingCards);
      } catch {
        setError("Không thể tải thông tin bộ thẻ. Vui lòng thử lại.");
      } finally {
        setLoadingDeck(false);
      }
    };

    load();
  }, [deckId, isEditMode]);

  // ── Save (create or update) ────────────────────────────────────────────────
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      let finalDeckId = deckId;

      if (isEditMode && deckId) {
        // Update existing deck metadata
        await flashcardApi.updateDeck(deckId, {
          title: deckForm.title.trim(),
          description: deckForm.description.trim() || undefined,
          target_language: deckForm.target_language,
          native_language: deckForm.native_language,
          tags: deckForm.tags,
          is_public: deckForm.is_public,
          status: deckForm.status,
        });
      } else {
        // Create new deck
        const deckRes = await flashcardApi.createDeck({
          title: deckForm.title.trim(),
          description: deckForm.description.trim() || undefined,
          target_language: deckForm.target_language,
          native_language: deckForm.native_language,
          tags: deckForm.tags,
          is_public: deckForm.is_public,
          status: deckForm.status,
        });
        finalDeckId = deckRes.data.data.id;
      }

      if (!finalDeckId) throw new Error("Missing deck ID");

      const visibleCards = cards.filter((c) => !c.isDeleted);

      if (isEditMode) {
        // Delete removed existing cards
        const toDelete = cards.filter((c) => c.serverId && c.isDeleted);
        await Promise.all(
          toDelete.map((c) => flashcardApi.deleteCard(finalDeckId!, c.serverId!)),
        );

        // Update existing cards (PUT each one)
        const toUpdate = visibleCards.filter((c) => c.serverId);
        await Promise.all(
          toUpdate.map((c, i) =>
            flashcardApi.updateCard(finalDeckId!, c.serverId!, {
              term: c.term.trim(),
              reading: c.reading.trim() || undefined,
              phonetic: c.phonetic.trim() || undefined,
              definition: c.definition.trim(),
              example_sentence: c.example_sentence.trim() || undefined,
              example_translation: c.example_translation.trim() || undefined,
              order: i + 1,
            }),
          ),
        );

        // Bulk add brand-new cards
        const toAdd = visibleCards.filter(
          (c) => !c.serverId && c.term.trim() && c.definition.trim(),
        );
        if (toAdd.length > 0) {
          await flashcardApi.bulkAddCards(finalDeckId, {
            cards: toAdd.map((c, i) => ({
              term: c.term.trim(),
              reading: c.reading.trim() || undefined,
              phonetic: c.phonetic.trim() || undefined,
              definition: c.definition.trim(),
              example_sentence: c.example_sentence.trim() || undefined,
              example_translation: c.example_translation.trim() || undefined,
              order: toUpdate.length + i + 1,
            })),
          });
        }
      } else {
        // New deck: bulk add all filled cards
        const toAdd: CreateCardRequest[] = visibleCards
          .filter((c) => c.term.trim() && c.definition.trim())
          .map((c, i) => ({
            term: c.term.trim(),
            reading: c.reading.trim() || undefined,
            phonetic: c.phonetic.trim() || undefined,
            definition: c.definition.trim(),
            example_sentence: c.example_sentence.trim() || undefined,
            example_translation: c.example_translation.trim() || undefined,
            order: i + 1,
          }));

        if (toAdd.length > 0) {
          await flashcardApi.bulkAddCards(finalDeckId, { cards: toAdd });
        }
      }

      router.push("/flashcards");
    } catch {
      setError("Không thể lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // ── Card management ────────────────────────────────────────────────────────
  const updateDeckForm = (field: keyof DeckForm, value: unknown) =>
    setDeckForm((prev) => ({ ...prev, [field]: value }));

  const addCard = useCallback(() => {
    const newCard = EMPTY_CARD();
    setCards((prev) => [...prev, newCard]);
    setLastAddedId(newCard.localId);
    setTimeout(
      () =>
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      80,
    );
  }, []);

  const updateCard = useCallback(
    (localId: string, field: keyof CardRow, value: string) =>
      setCards((prev) =>
        prev.map((c) => (c.localId === localId ? { ...c, [field]: value } : c)),
      ),
    [],
  );

  // Soft-delete: keep server cards marked as deleted so we can DELETE on save
  const deleteCard = useCallback((localId: string) => {
    setCards((prev) => {
      const card = prev.find((c) => c.localId === localId);
      if (!card) return prev;
      if (card.serverId) {
        // Mark for deletion on save
        return prev.map((c) =>
          c.localId === localId ? { ...c, isDeleted: true } : c,
        );
      }
      // New card: remove entirely
      return prev.filter((c) => c.localId !== localId);
    });
  }, []);

  const moveCard = useCallback((localId: string, dir: "up" | "down") => {
    setCards((prev) => {
      const visible = prev.filter((c) => !c.isDeleted);
      const idx = visible.findIndex((c) => c.localId === localId);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === visible.length - 1) return prev;
      // Rebuild full array with swapped visible items
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      const newVisible = [...visible];
      [newVisible[idx], newVisible[swapIdx]] = [newVisible[swapIdx], newVisible[idx]];
      // Re-merge with deleted cards (they stay at their relative position)
      const deleted = prev.filter((c) => c.isDeleted);
      return [...newVisible, ...deleted];
    });
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const visibleCards = cards.filter((c) => !c.isDeleted);
  const filledCount = visibleCards.filter(
    (c) => c.term.trim() && c.definition.trim(),
  ).length;
  const canProceed =
    deckForm.title.trim() && deckForm.target_language && deckForm.native_language;
  const canSave = isEditMode ? deckForm.title.trim() && deckForm.target_language : filledCount > 0;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loadingDeck) return <LoadingScreen />;

  // ── Header title ───────────────────────────────────────────────────────────
  const headerTitle = isEditMode
    ? `Chỉnh sửa — ${deckForm.title || "Bộ thẻ"}`
    : step === 1
      ? "Tạo bộ thẻ mới"
      : `Thêm thẻ — ${deckForm.title}`;

  return (
    <div className="min-h-screen bg-background-main">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => {
                if (isEditMode) {
                  router.push("/flashcards");
                } else if (step === 2) {
                  setStep(1);
                } else {
                  router.push("/flashcards");
                }
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              <span className="text-neutral-400 shrink-0">Flashcards</span>
              <span className="text-neutral-300 shrink-0">/</span>
              <span className="text-primary-600 font-semibold truncate">
                {headerTitle}
              </span>
            </div>
          </div>

          {/* Right: step indicator (create mode only) */}
          {!isEditMode && (
            <div className="flex items-center gap-2 shrink-0">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                      s === step
                        ? "bg-primary-500 text-white"
                        : s < step
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  {s < 2 && <div className="w-8 h-px bg-neutral-200" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-3xl mx-auto px-6">
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ── STEP 1 / Edit metadata ── */}
        {(step === 1 || isEditMode) && (
          <div className={`py-8 ${isEditMode ? "" : ""}`}>
            {isEditMode && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-neutral-800">Thông tin bộ thẻ</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Thay đổi thông tin bộ thẻ bên dưới
                </p>
              </div>
            )}

            <DeckMetaForm form={deckForm} onChange={updateDeckForm} />

            {!isEditMode && (
              <button
                type="button"
                onClick={() => canProceed && setStep(2)}
                disabled={!canProceed}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  canProceed
                    ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-100"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Tiếp theo
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2 / Cards ── */}
        {(step === 2 || isEditMode) && (
          <div className={`flex flex-col gap-5 ${isEditMode ? "" : "py-8"}`}>
            {isEditMode && (
              <div className="border-t border-neutral-100 pt-8">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-neutral-800">Thẻ trong bộ</h2>
                  <span className="text-xs text-neutral-400">
                    <span className="font-semibold text-primary-600">
                      {filledCount}
                    </span>{" "}
                    / {visibleCards.length} thẻ hợp lệ
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Sửa, xóa hoặc thêm thẻ mới vào bộ thẻ này
                </p>
              </div>
            )}

            {!isEditMode && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-800">Thêm thẻ</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Điền <span className="font-semibold">Từ</span> và{" "}
                    <span className="font-semibold">Định nghĩa</span> để thẻ hợp lệ
                  </p>
                </div>
                <span className="text-xs text-neutral-400">
                  <span className="font-semibold text-primary-600">{filledCount}</span>{" "}
                  / {visibleCards.length} hợp lệ
                </span>
              </div>
            )}

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-500"
                  style={{
                    width: `${
                      visibleCards.length > 0
                        ? (filledCount / visibleCards.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-[11px] text-neutral-400 shrink-0 w-28 text-right">
                {filledCount === visibleCards.length && visibleCards.length > 0
                  ? "✓ Hoàn tất"
                  : `${visibleCards.length - filledCount} thẻ còn trống`}
              </span>
            </div>

            {/* Card list */}
            <div className="flex flex-col gap-3">
              {visibleCards.map((card, i) => (
                <CardRowItem
                  key={card.localId}
                  card={card}
                  index={i}
                  visibleTotal={visibleCards.length}
                  targetLang={deckForm.target_language}
                  onChange={updateCard}
                  onDelete={deleteCard}
                  onMoveUp={(id) => moveCard(id, "up")}
                  onMoveDown={(id) => moveCard(id, "down")}
                  autoFocus={card.localId === lastAddedId}
                />
              ))}
            </div>

            {/* Add card button */}
            <button
              onClick={addCard}
              className="flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-dashed border-neutral-200 text-sm font-semibold text-neutral-400 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/50 transition-all duration-200 group"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-200 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                <Plus
                  size={13}
                  className="text-neutral-500 group-hover:text-primary-500 transition-colors"
                />
              </div>
              Thêm thẻ mới
            </button>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className={`py-3.5 rounded-2xl text-sm font-bold transition-all ${
                canSave && !saving
                  ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-100"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </span>
              ) : isEditMode ? (
                "Lưu thay đổi"
              ) : (
                `Lưu bộ thẻ${filledCount > 0 ? ` (${filledCount} thẻ)` : ""}`
              )}
            </button>

            <div ref={bottomRef} className="h-6" />
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Page (Suspense wrapper for useSearchParams) ──────────────────────────────

export default function AddFlashcardsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AddFlashcardsContent />
    </Suspense>
  );
}
