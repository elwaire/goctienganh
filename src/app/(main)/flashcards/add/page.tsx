"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Volume2,
  AlignLeft,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Keyboard,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type WordCard = {
  id: string;
  term: string;
  phonetic: string;
  definition: string;
  example: string;
};

const uid = () => Math.random().toString(36).slice(2, 8);
const EMPTY_CARD = (): WordCard => ({
  id: uid(),
  term: "",
  phonetic: "",
  definition: "",
  example: "",
});

// ─── Card Row ─────────────────────────────────────────────────────────────────

function CardRow({
  card,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  autoFocus,
}: {
  card: WordCard;
  index: number;
  total: number;
  onChange: (id: string, field: keyof WordCard, value: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  autoFocus?: boolean;
}) {
  const isFilled = card.term.trim() && card.definition.trim();

  return (
    <div
      className={`group relative rounded-2xl border bg-white transition-all duration-200 overflow-hidden
        ${
          isFilled
            ? "border-neutral-200 hover:border-primary-200 hover:shadow-md"
            : "border-neutral-150 hover:border-neutral-200"
        }`}
    >
      {/* Colored left accent */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-300
          ${isFilled ? "bg-primary-500" : "bg-neutral-200"}`}
      />

      {/* Header row */}
      <div className="flex items-center justify-between pl-5 pr-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <GripVertical
            size={14}
            className="text-neutral-300 cursor-grab active:cursor-grabbing"
          />
          <span className="text-xs font-bold text-neutral-400 tabular-nums select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          {isFilled && <CheckCircle2 size={13} className="text-primary-400" />}
        </div>

        <div className="flex items-center gap-1">
          {/* Move up/down */}
          <button
            onClick={() => onMoveUp(card.id)}
            disabled={index === 0}
            className="p-1 rounded text-neutral-300 hover:text-neutral-500 disabled:opacity-0 transition-all"
          >
            <ChevronUp size={13} />
          </button>
          <button
            onClick={() => onMoveDown(card.id)}
            disabled={index === total - 1}
            className="p-1 rounded text-neutral-300 hover:text-neutral-500 disabled:opacity-0 transition-all"
          >
            <ChevronDown size={13} />
          </button>

          <div className="w-px h-4 bg-neutral-100 mx-1" />

          <button
            onClick={() => onDelete(card.id)}
            disabled={total <= 1}
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
            Từ / Cụm từ
          </label>
          <input
            autoFocus={autoFocus}
            type="text"
            value={card.term}
            onChange={(e) => onChange(card.id, "term", e.target.value)}
            placeholder="e.g. Serendipity"
            className="w-full text-sm font-semibold text-neutral-800 bg-transparent placeholder:text-neutral-300 placeholder:font-normal border-b-2 border-neutral-150 focus:border-primary-500 outline-none py-1.5 transition-colors"
          />
          <span className="text-[10px] text-neutral-300">Tiếng Anh</span>
        </div>

        {/* Phonetic */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            <Volume2 size={9} />
            Phiên âm IPA
          </label>
          <input
            type="text"
            value={card.phonetic}
            onChange={(e) => onChange(card.id, "phonetic", e.target.value)}
            placeholder="/ˌserənˈdɪpɪti/"
            className="w-full text-sm text-primary-500 bg-transparent placeholder:text-neutral-300 border-b-2 border-neutral-150 focus:border-primary-400 outline-none py-1.5 transition-colors font-mono"
          />
          <span className="text-[10px] text-neutral-300">Không bắt buộc</span>
        </div>

        {/* Definition */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            Định nghĩa / Nghĩa
          </label>
          <textarea
            value={card.definition}
            onChange={(e) => onChange(card.id, "definition", e.target.value)}
            placeholder="e.g. Sự tình cờ may mắn, phát hiện điều tốt đẹp một cách bất ngờ"
            rows={2}
            className="w-full text-sm text-neutral-700 bg-transparent placeholder:text-neutral-300 border-b-2 border-neutral-150 focus:border-primary-500 outline-none py-1.5 resize-none transition-colors leading-relaxed"
          />
          <span className="text-[10px] text-neutral-300">Tiếng Việt</span>
        </div>

        {/* Example */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[10px] font-extrabold tracking-widest uppercase text-neutral-400">
            <AlignLeft size={9} />
            Câu ví dụ
          </label>
          <textarea
            value={card.example}
            onChange={(e) => onChange(card.id, "example", e.target.value)}
            placeholder="e.g. It was pure serendipity that we met."
            rows={2}
            className="w-full text-sm text-neutral-500 italic bg-transparent placeholder:text-neutral-300 placeholder:not-italic border-b-2 border-neutral-150 focus:border-primary-400 outline-none py-1.5 resize-none transition-colors leading-relaxed"
          />
          <span className="text-[10px] text-neutral-300">Không bắt buộc</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Mock: tên bộ thẻ đang được thêm vào (thực tế lấy từ params/context)
const SET_NAME = "IELTS Academic Word List";

export default function AddFlashcardsPage() {
  const [cards, setCards] = useState<WordCard[]>([EMPTY_CARD(), EMPTY_CARD()]);
  const [saved, setSaved] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const filledCount = cards.filter(
    (c) => c.term.trim() && c.definition.trim(),
  ).length;
  const canSave = filledCount >= 1;

  const addCard = useCallback(() => {
    const newCard = EMPTY_CARD();
    setCards((prev) => [...prev, newCard]);
    setLastAddedId(newCard.id);
    setTimeout(
      () =>
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      80,
    );
  }, []);

  const updateCard = useCallback(
    (id: string, field: keyof WordCard, value: string) =>
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      ),
    [],
  );

  const deleteCard = useCallback(
    (id: string) => setCards((prev) => prev.filter((c) => c.id !== id)),
    [],
  );

  const moveCard = useCallback((id: string, dir: "up" | "down") => {
    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const handleSave = () => {
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fefcff]">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: back + breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all shrink-0">
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              <span className="text-neutral-400 shrink-0">Flashcards</span>
              <span className="text-neutral-300 shrink-0">/</span>
              <span className="text-neutral-600 font-medium truncate">
                {SET_NAME}
              </span>
              <span className="text-neutral-300 shrink-0">/</span>
              <span className="text-primary-600 font-semibold shrink-0">
                Thêm thẻ
              </span>
            </div>
          </div>

          {/* Right: counter + save */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-neutral-400 hidden sm:block">
              <span className="font-semibold text-primary-600">
                {filledCount}
              </span>{" "}
              / {cards.length} thẻ
            </span>

            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                saved
                  ? "bg-emerald-500 text-white scale-95"
                  : canSave
                    ? "bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-100"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={14} /> Đã lưu!
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Lưu{" "}
                  {filledCount > 0 ? `(${filledCount})` : ""}
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-5">
        {/* ── Info bar ── */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold text-neutral-800">
              Thêm từ vựng mới
            </h1>
            <p className="text-xs text-neutral-400">
              Điền đầy đủ <span className="font-semibold">Từ</span> và{" "}
              <span className="font-semibold">Định nghĩa</span> để thẻ được tính
              hợp lệ
            </p>
          </div>

          {/* Keyboard shortcut hint */}
          <button
            onClick={() => setShowShortcuts((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-all"
          >
            <Keyboard size={12} />
            Phím tắt
          </button>
        </div>

        {/* Shortcut tooltip */}
        {showShortcuts && (
          <div className="flex gap-6 px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-500">
            {[
              { key: "Tab", desc: "Chuyển trường" },
              { key: "Ctrl + Enter", desc: "Thêm thẻ mới" },
              { key: "Ctrl + S", desc: "Lưu tất cả" },
            ].map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 font-mono text-[10px] font-semibold text-neutral-600">
                  {key}
                </kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Progress bar ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-500"
              style={{
                width: `${cards.length > 0 ? (filledCount / cards.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-[11px] text-neutral-400 shrink-0 w-20 text-right">
            {filledCount === cards.length && cards.length > 0
              ? "✓ Hoàn tất"
              : `${cards.length - filledCount} thẻ còn trống`}
          </span>
        </div>

        {/* ── Card list ── */}
        <div className="flex flex-col gap-3">
          {cards.map((card, i) => (
            <CardRow
              key={card.id}
              card={card}
              index={i}
              total={cards.length}
              onChange={updateCard}
              onDelete={deleteCard}
              onMoveUp={(id) => moveCard(id, "up")}
              onMoveDown={(id) => moveCard(id, "down")}
              autoFocus={card.id === lastAddedId}
            />
          ))}
        </div>

        {/* ── Add card button ── */}
        <button
          onClick={addCard}
          className="flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-dashed border-neutral-200 text-sm font-semibold text-neutral-400 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/50 transition-all duration-200 group"
        >
          <div className="w-6 h-6 rounded-full bg-neutral-200 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
            <Plus
              size={13}
              className="group-hover:scale-110 transition-transform text-neutral-500 group-hover:text-primary-500"
            />
          </div>
          Thêm thẻ mới
        </button>

        <div ref={bottomRef} className="h-6" />
      </main>

      {/* ── Floating save (mobile) ── */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 sm:hidden">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full max-w-sm py-3.5 rounded-2xl text-sm font-bold shadow-xl transition-all duration-200 ${
            saved
              ? "bg-emerald-500 text-white"
              : canSave
                ? "bg-primary-500 text-white shadow-primary-200"
                : "bg-neutral-200 text-neutral-400"
          }`}
        >
          {saved
            ? "✓ Đã lưu thành công!"
            : `Lưu ${filledCount > 0 ? `${filledCount} thẻ` : ""}`}
        </button>
      </div>
    </div>
  );
}
