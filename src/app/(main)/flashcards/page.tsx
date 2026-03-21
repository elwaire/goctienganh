"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Globe,
  BookOpen,
  Pencil,
  Trash2,
  Play,
  Lock,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import { flashcardApi } from "@/lib/flashcard-api";
import type { FlashcardDeck } from "@/types/flashcard";

// ─── Constants ────────────────────────────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  en: "Tiếng Anh",
  ja: "Tiếng Nhật",
  ko: "Tiếng Hàn",
  zh: "Tiếng Trung",
  fr: "Tiếng Pháp",
  vi: "Tiếng Việt",
  ar: "Tiếng Ả Rập",
};

const STATUS_CONFIG = {
  draft: {
    label: "Nháp",
    className: "bg-neutral-50 text-neutral-500 border-neutral-200",
  },
  published: {
    label: "Đã xuất bản",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  archived: {
    label: "Lưu trữ",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
};

const LIMIT = 12;

// ─── DeckCard ─────────────────────────────────────────────────────────────────

function DeckCard({
  deck,
  onDelete,
}: {
  deck: FlashcardDeck;
  onDelete: (id: string) => void;
}) {
  const status = STATUS_CONFIG[deck.status] ?? STATUS_CONFIG.draft;

  return (
    <div className="group bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="px-5 pt-5 flex items-start gap-2 flex-wrap">
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${status.className}`}
        >
          {status.label}
        </span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-primary-200 bg-primary-50 text-primary-600">
          {LANG_LABELS[deck.target_language] ?? deck.target_language}
        </span>
        {deck.is_public ? (
          <span className="text-[11px] px-2.5 py-1 rounded-lg border border-sky-200 bg-sky-50 text-sky-600 flex items-center gap-1">
            <Unlock size={9} />
            Công khai
          </span>
        ) : (
          <span className="text-[11px] px-2.5 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-400 flex items-center gap-1">
            <Lock size={9} />
            Riêng tư
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-3 pb-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold text-neutral-800 leading-snug group-hover:text-primary-600 transition-colors">
            {deck.title}
          </h3>
          {deck.description && (
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
              {deck.description}
            </p>
          )}
        </div>

        {/* Card count */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
            <BookOpen size={13} className="text-primary-500" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 leading-none">Số thẻ</p>
            <p className="text-xs font-bold text-neutral-700 mt-0.5">
              {deck.card_count} thẻ
            </p>
          </div>
        </div>

        {/* Tags */}
        {deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {deck.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-neutral-400 border border-neutral-150 bg-neutral-50 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          href={`/flashcards/start?deckId=${deck.id}`}
          className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          <Play size={13} />
          Học ngay
        </Link>
        {deck.is_owner && (
          <>
            <Link
              href={`/flashcards/add?deckId=${deck.id}`}
              className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-primary-500 hover:border-primary-200 transition-colors"
              title="Chỉnh sửa bộ thẻ"
            >
              <Pencil size={14} />
            </Link>
            <button
              onClick={() => onDelete(deck.id)}
              className="p-2.5 rounded-xl border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
              title="Xóa bộ thẻ"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlashcardsPage() {
  const [search, setSearch] = useState("");
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await flashcardApi.getDecks({
          page,
          limit: LIMIT,
          search: search || undefined,
        });
        if (!cancelled) {
          setDecks(res.data.data.decks);
          setTotal(res.data.data.total);
        }
      } catch {
        if (!cancelled)
          setError("Không thể tải danh sách bộ thẻ. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(load, search ? 400 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bộ thẻ này?")) return;
    try {
      await flashcardApi.deleteDeck(id);
      setDecks((prev) => prev.filter((d) => d.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert("Không thể xóa bộ thẻ. Vui lòng thử lại.");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-background-main">
      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Bộ thẻ Flashcard
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              {loading ? "Đang tải..." : total > 0 ? `${total} bộ thẻ` : "Chưa có bộ thẻ nào"}
            </p>
          </div>
          <Link
            href="/flashcards/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition-colors shadow-sm shadow-primary-100"
          >
            <Plus size={15} />
            Tạo bộ thẻ mới
          </Link>
        </div>

        {/* ── Search ── */}
        <div className="relative max-w-sm mb-6">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm bộ thẻ..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-700 placeholder:text-neutral-300 focus:border-primary-400 focus:outline-none transition-colors"
          />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-sm font-medium text-neutral-500">{error}</p>
            <button
              onClick={() => setPage((p) => p)}
              className="text-sm text-primary-500 underline"
            >
              Thử lại
            </button>
          </div>
        ) : decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <Globe size={22} className="text-neutral-300" />
            </div>
            <p className="text-sm font-medium text-neutral-500">
              {search ? "Không tìm thấy bộ thẻ nào" : "Chưa có bộ thẻ nào"}
            </p>
            {!search && (
              <Link
                href="/flashcards/add"
                className="text-sm text-primary-500 font-semibold"
              >
                Tạo bộ thẻ đầu tiên →
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {decks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                        p === page
                          ? "bg-primary-500 text-white"
                          : "bg-white border border-neutral-200 text-neutral-500 hover:border-primary-300 hover:text-primary-500"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
