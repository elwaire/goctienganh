"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Trophy,
  Shuffle,
  Target,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";
import { flashcardApi } from "@/lib/flashcard-api";
import type {
  FlashcardCard,
  StudySession,
  CompleteStudySessionResponse,
} from "@/types/flashcard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Confidence config ────────────────────────────────────────────────────────

const CONFIDENCE_BUTTONS = [
  {
    level: 1 as const,
    label: "Lại",
    meaning: "Không nhớ gì",
    reviewAfter: "10 phút",
    is_correct: false,
    btnClass: "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 active:scale-95",
    dotClass: "bg-red-400",
    badgeClass: "bg-red-100 text-red-500",
  },
  {
    level: 2 as const,
    label: "Khó",
    meaning: "Nhớ nhưng lâu",
    reviewAfter: "1 ngày",
    is_correct: false,
    btnClass: "border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:border-orange-300 active:scale-95",
    dotClass: "bg-orange-400",
    badgeClass: "bg-orange-100 text-orange-500",
  },
  {
    level: 3 as const,
    label: "Được",
    meaning: "Còn ngập ngừng",
    reviewAfter: "3 ngày",
    is_correct: true,
    btnClass: "border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:border-sky-300 active:scale-95",
    dotClass: "bg-sky-400",
    badgeClass: "bg-sky-100 text-sky-600",
  },
  {
    level: 4 as const,
    label: "Dễ",
    meaning: "Nhớ khá tốt",
    reviewAfter: "7 ngày",
    is_correct: true,
    btnClass: "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 active:scale-95",
    dotClass: "bg-emerald-400",
    badgeClass: "bg-emerald-100 text-emerald-600",
  },
] as const;

type ConfidenceLevel = 1 | 2 | 3 | 4;

// ─── Card front ────────────────────────────────────────────────────────────────

function CardFront({
  card,
  targetLang,
  isSpeaking,
  onSpeak,
}: {
  card: FlashcardCard;
  targetLang: string;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center w-full">
      <span className="text-[10px] font-bold tracking-widest uppercase text-primary-400 bg-primary-50 px-3 py-1 rounded-full">
        Thuật ngữ
      </span>

      <h2 className="text-4xl font-black text-neutral-900 tracking-tight leading-tight">
        {card.term}
      </h2>

      {["ja", "zh"].includes(targetLang) && card.reading && (
        <p className="text-lg text-gray-500 font-medium">{card.reading}</p>
      )}
      {targetLang === "ko" && card.reading && (
        <p className="text-base text-gray-500">{card.reading}</p>
      )}
      {["en", "fr"].includes(targetLang) && card.phonetic && (
        <p className="text-base text-gray-400 italic font-mono">{card.phonetic}</p>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (card.audio_url) {
            new Audio(card.audio_url).play().catch(() => onSpeak(card.term));
          } else {
            onSpeak(card.term);
          }
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
          isSpeaking
            ? "bg-primary-500 border-primary-500 text-white"
            : "bg-primary-50 border-primary-200 text-primary-500 hover:bg-primary-500 hover:border-primary-500 hover:text-white"
        }`}
      >
        <Volume2 size={12} className={isSpeaking ? "animate-pulse" : ""} />
        {isSpeaking ? "Đang phát..." : "Nghe"}
      </button>

      <p className="text-xs text-neutral-300 mt-2">Nhấn để lật</p>
    </div>
  );
}

// ─── Card back ─────────────────────────────────────────────────────────────────

function CardBack({
  card,
  targetLang,
}: {
  card: FlashcardCard;
  targetLang: string;
}) {
  const extra = card.extra as Record<string, unknown> | undefined;

  return (
    <div className="flex flex-col items-start gap-4 w-full h-full justify-center">
      <span className="text-[10px] font-bold tracking-widest uppercase text-primary-200 bg-primary-600 px-3 py-1 rounded-full">
        Định nghĩa
      </span>

      <p className="text-xl font-bold text-white leading-snug">{card.definition}</p>

      {card.example_sentence && (
        <div className="border-l-4 border-primary-300 pl-4">
          <p className="text-sm text-primary-100 italic leading-relaxed">
            {card.example_sentence}
          </p>
          {card.example_translation && (
            <p className="text-xs text-primary-200 mt-1">{card.example_translation}</p>
          )}
        </div>
      )}

      {targetLang === "ja" && extra && (
        <div className="flex flex-wrap gap-2 text-xs">
          {!!extra.jlpt_level && (
            <span className="px-2 py-0.5 rounded-md bg-primary-600 text-primary-100 font-bold">
              JLPT {String(extra.jlpt_level)}
            </span>
          )}
          {!!extra.stroke_count && (
            <span className="px-2 py-0.5 rounded-md bg-primary-600 text-primary-200">
              {String(extra.stroke_count)} nét
            </span>
          )}
          {!!extra.onyomi && (
            <span className="px-2 py-0.5 rounded-md bg-primary-600 text-primary-200">
              On: {String(extra.onyomi)}
            </span>
          )}
          {!!extra.kunyomi && (
            <span className="px-2 py-0.5 rounded-md bg-primary-600 text-primary-200">
              Kun: {String(extra.kunyomi)}
            </span>
          )}
        </div>
      )}

      {targetLang === "zh" && extra && (
        <div className="flex flex-wrap gap-2 text-xs">
          {!!extra.traditional && (
            <span className="px-2 py-0.5 rounded-md bg-primary-600 text-primary-200">
              Phồn thể: {String(extra.traditional)}
            </span>
          )}
          {!!extra.hsk_level && (
            <span className="px-2 py-0.5 rounded-md bg-primary-600 text-primary-100 font-bold">
              {String(extra.hsk_level)}
            </span>
          )}
        </div>
      )}

      {card.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image_url}
          alt={card.term}
          className="rounded-xl max-h-28 object-cover"
        />
      )}
    </div>
  );
}

// ─── Result screen ─────────────────────────────────────────────────────────────

function ResultScreen({
  result,
  cardRatings,
  hardCardCount,
  onRestart,
  onReviewHard,
}: {
  result: CompleteStudySessionResponse;
  cardRatings: Record<string, ConfidenceLevel>;
  hardCardCount: number;
  onRestart: () => void;
  onReviewHard: () => void;
}) {
  const pct = Math.round(result.accuracy * 100);
  const grade =
    pct >= 80 ? "Xuất sắc! 🎉" : pct >= 60 ? "Khá tốt! 💪" : "Cần ôn thêm 📚";

  const countByLevel = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<ConfidenceLevel, number>;
  Object.values(cardRatings).forEach((lvl) => { countByLevel[lvl]++; });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-main px-6">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 border border-primary-100 flex items-center justify-center">
          <Trophy size={36} className="text-primary-500" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-neutral-900">Hoàn thành!</h2>
          <p className="text-neutral-500 mt-1 text-sm">{grade}</p>
        </div>

        {/* Score ring */}
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#eef2ff" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42" fill="none" stroke="#2855f7" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="text-center z-10">
            <p className="text-3xl font-black text-primary-600">{pct}%</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">chính xác</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { icon: <Target size={15} />, label: "Tổng thẻ", value: result.total_cards, color: "text-neutral-700" },
            { icon: <CheckCircle2 size={15} />, label: "Đúng", value: result.correct_count, color: "text-emerald-600" },
            { icon: <XCircle size={15} />, label: "Cần ôn", value: result.total_cards - result.correct_count, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 py-3 flex flex-col items-center gap-1">
              <span className={s.color}>{s.icon}</span>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Rating breakdown */}
        {Object.keys(cardRatings).length > 0 && (
          <div className="w-full bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col gap-2.5">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Chi tiết đánh giá
            </p>
            {([4, 3, 2, 1] as ConfidenceLevel[]).map((lvl) => {
              const btn = CONFIDENCE_BUTTONS.find((b) => b.level === lvl)!;
              const count = countByLevel[lvl];
              const barPct = result.total_cards > 0 ? (count / result.total_cards) * 100 : 0;
              return (
                <div key={lvl} className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold w-12 text-center px-2 py-0.5 rounded-md ${btn.badgeClass}`}>
                    {btn.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${btn.dotClass}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-neutral-500 w-5 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          {hardCardCount > 0 && (
            <button
              onClick={onReviewHard}
              className="w-full py-3.5 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen size={15} />
              Ôn lại {hardCardCount} thẻ Lại &amp; Khó
            </button>
          )}
          <button
            onClick={onRestart}
            className={`w-full py-3 rounded-2xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              hardCardCount > 0
                ? "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            <RotateCcw size={14} />
            Học lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Loading ───────────────────────────────────────────────────────────────────

function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      {message && <p className="text-sm text-neutral-400">{message}</p>}
    </div>
  );
}

// ─── Study session ─────────────────────────────────────────────────────────────

function StudySession() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = searchParams.get("deckId");

  const [session, setSession] = useState<StudySession | null>(null);
  const [deck, setDeck] = useState<{ title: string; target_language: string } | null>(null);
  const [cards, setCards] = useState<FlashcardCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState<CompleteStudySessionResponse | null>(null);
  const [completing, setCompleting] = useState(false);
  const [cardRatings, setCardRatings] = useState<Record<string, ConfidenceLevel>>({});

  const cardStartTimeRef = useRef<number>(Date.now());
  const originalCardsRef = useRef<FlashcardCard[]>([]);

  // ── Speak ────────────────────────────────────────────────────────────────────
  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = deck?.target_language === "ja" ? "ja-JP" : "en-US";
      utter.rate = 0.85;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        ["Samantha", "Google US English", "Alex"].includes(v.name),
      );
      if (preferred) utter.voice = preferred;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [deck?.target_language],
  );

  // ── Start session ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!deckId) {
      setError("Không tìm thấy bộ thẻ.");
      setLoading(false);
      return;
    }
    const start = async () => {
      try {
        const [deckRes, sessionRes] = await Promise.all([
          flashcardApi.getDeck(deckId),
          flashcardApi.startSession(deckId, "flashcard"),
        ]);
        const deckData = deckRes.data.data;
        const sessionData = sessionRes.data.data;
        setDeck({ title: deckData.title, target_language: deckData.target_language });
        setSession(sessionData);
        const sessionCards = sessionData.cards ?? deckData.cards ?? [];
        originalCardsRef.current = sessionCards;
        setCards([...sessionCards]);
        cardStartTimeRef.current = Date.now();
      } catch {
        setError("Không thể bắt đầu phiên học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    start();
  }, [deckId]);

  // ── Navigate ──────────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (dir: "left" | "right", nextIdx: number) => {
      if (isAnimating) return;
      setExitDir(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setIndex(nextIdx);
        setFlipped(false);
        setExitDir(null);
        setIsAnimating(false);
        cardStartTimeRef.current = Date.now();
      }, 220);
    },
    [isAnimating],
  );

  const prev = useCallback(() => {
    if (index > 0) goTo("right", index - 1);
  }, [index, goTo]);

  // ── Rate card ─────────────────────────────────────────────────────────────────
  const rateCard = useCallback(
    async (confidenceLevel: ConfidenceLevel, isCorrect: boolean) => {
      if (!session || !deckId || isAnimating) return;

      const card = cards[index];
      const timeSpentMs = Date.now() - cardStartTimeRef.current;

      // Update dot color immediately
      setCardRatings((prev) => ({ ...prev, [card.id]: confidenceLevel }));

      // Fire-and-forget API call
      flashcardApi
        .recordCard(deckId, session.id, {
          card_id: card.id,
          is_correct: isCorrect,
          confidence_level: confidenceLevel,
          time_spent_ms: timeSpentMs,
        })
        .catch(() => {});

      if (index < cards.length - 1) {
        goTo("left", index + 1);
      } else {
        setCompleting(true);
        try {
          const res = await flashcardApi.completeSession(deckId, session.id);
          setResult(res.data.data);
        } catch {
          const finalRatings = { ...cardRatings, [card.id]: confidenceLevel };
          const correctCount = Object.values(finalRatings).filter((l) => l >= 3).length;
          setResult({
            session_id: session.id,
            deck_id: deckId,
            mode: "flashcard",
            total_cards: cards.length,
            correct_count: correctCount,
            accuracy: correctCount / cards.length,
            status: "completed",
            started_at: session.started_at,
          });
        } finally {
          setCompleting(false);
        }
      }
    },
    [session, deckId, index, cards, isAnimating, goTo, cardRatings],
  );

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isAnimating) setFlipped((f) => !f);
      }
      if (e.key === "ArrowRight" && !flipped && index < cards.length - 1)
        goTo("left", index + 1);
      if (e.key === "ArrowLeft") prev();
      if (flipped) {
        if (e.key === "1") rateCard(1, false);
        if (e.key === "2") rateCard(2, false);
        if (e.key === "3") rateCard(3, true);
        if (e.key === "4") rateCard(4, true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, flipped, isAnimating, cards.length, goTo, prev, rateCard]);

  // ── Controls ──────────────────────────────────────────────────────────────────
  const handleShuffle = () => {
    setCards(shuffle([...originalCardsRef.current]));
    setIndex(0); setFlipped(false); setIsShuffled(true);
    setCardRatings({}); cardStartTimeRef.current = Date.now();
  };

  const handleRestart = () => {
    setCards([...originalCardsRef.current]);
    setIndex(0); setFlipped(false); setIsShuffled(false);
    setResult(null); setCardRatings({}); cardStartTimeRef.current = Date.now();
  };

  const handleReviewHard = () => {
    const hardIds = Object.entries(cardRatings)
      .filter(([, lvl]) => lvl <= 2).map(([id]) => id);
    const hardCards = originalCardsRef.current.filter((c) => hardIds.includes(c.id));
    if (!hardCards.length) return;
    setCards(hardCards); setIndex(0); setFlipped(false);
    setResult(null); setCardRatings({}); cardStartTimeRef.current = Date.now();
  };

  const hardCardCount = Object.values(cardRatings).filter((l) => l <= 2).length;

  // ── Render guards ─────────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen message="Đang bắt đầu phiên học..." />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <p className="text-sm text-neutral-500">{error}</p>
        <button onClick={() => router.push("/flashcards")} className="text-sm text-primary-500 font-semibold underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }
  if (completing) return <LoadingScreen message="Đang hoàn thành..." />;
  if (result) {
    return (
      <ResultScreen
        result={result}
        cardRatings={cardRatings}
        hardCardCount={hardCardCount}
        onRestart={handleRestart}
        onReviewHard={handleReviewHard}
      />
    );
  }
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <p className="text-sm text-neutral-500">Bộ thẻ chưa có thẻ nào.</p>
        <button onClick={() => router.push("/flashcards")} className="text-sm text-primary-500 font-semibold underline">
          Quay lại
        </button>
      </div>
    );
  }

  const card = cards[index];
  const total = cards.length;
  const ratedCount = Object.keys(cardRatings).length;

  return (
    <div className="min-h-screen bg-background-main flex flex-col">
      {/* ── Header ── */}
      <header className="px-6 py-4 flex items-center justify-between max-w-2xl mx-auto w-full shrink-0">
        <button
          onClick={() => router.push("/flashcards")}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:block truncate max-w-[180px] font-medium">
            {deck?.title ?? "Flashcards"}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className={`p-2 rounded-xl border transition-all ${
              isShuffled
                ? "border-primary-200 bg-primary-50 text-primary-500"
                : "border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
            }`}
            title="Xáo bài"
          >
            <Shuffle size={14} />
          </button>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-all"
            title="Bắt đầu lại"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center px-6 pb-8 max-w-2xl mx-auto w-full">

        {/* ── Progress ── */}
        <div className="w-full flex flex-col gap-2 mb-6 shrink-0">
          {/* Dot row */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {cards.map((c, i) => {
              const rating = cardRatings[c.id];
              const btn = rating ? CONFIDENCE_BUTTONS.find((b) => b.level === rating) : null;
              return (
                <button
                  key={c.id}
                  onClick={() => { setIndex(i); setFlipped(false); cardStartTimeRef.current = Date.now(); }}
                  title={c.term}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-5 h-2 bg-primary-500"
                      : btn
                        ? `w-2 h-2 ${btn.dotClass}`
                        : "w-2 h-2 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                />
              );
            })}
          </div>

          {/* Bar + counter */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-neutral-400 tabular-nums shrink-0">
              {index + 1} / {total}
            </span>
          </div>

          {/* Live rating mini-badges */}
          <div
            className={`flex justify-center gap-2 transition-all duration-300 ${
              ratedCount > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {([4, 3, 2, 1] as ConfidenceLevel[]).map((lvl) => {
              const btn = CONFIDENCE_BUTTONS.find((b) => b.level === lvl)!;
              const count = Object.values(cardRatings).filter((l) => l === lvl).length;
              if (count === 0) return null;
              return (
                <span
                  key={lvl}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${btn.badgeClass}`}
                >
                  {btn.label} {count}
                </span>
              );
            })}
          </div>
        </div>

        {/* ── Card (fixed height) ── */}
        <div className="w-full shrink-0 mb-6" style={{ perspective: "1400px" }}>
          <div
            onClick={() => !isAnimating && setFlipped((f) => !f)}
            style={{
              height: "300px",
              transformStyle: "preserve-3d",
              transform: `${
                exitDir === "left" ? "translateX(-48px)" : exitDir === "right" ? "translateX(48px)" : "translateX(0)"
              } ${flipped ? "rotateY(180deg)" : "rotateY(0deg)"}`,
              opacity: exitDir ? 0 : 1,
              transition: exitDir
                ? "opacity 0.2s ease, transform 0.2s ease"
                : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            className="relative cursor-pointer select-none"
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-3xl bg-white border border-neutral-200 shadow-lg flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: "hidden" }}
            >
              <CardFront
                card={card}
                targetLang={deck?.target_language ?? "en"}
                isSpeaking={isSpeaking}
                onSpeak={speak}
              />
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl bg-primary-500 shadow-xl shadow-primary-200 flex flex-col justify-center p-8 overflow-y-auto"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <CardBack card={card} targetLang={deck?.target_language ?? "en"} />
            </div>
          </div>
        </div>

        {/* ── Action zone (FIXED height — no layout shift) ── */}
        <div className="w-full relative shrink-0" style={{ height: "120px" }}>

          {/* State A: Navigation (shown when NOT flipped) */}
          <div
            className={`absolute inset-0 flex items-center gap-3 transition-all duration-200 ${
              flipped ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
            }`}
          >
            <button
              onClick={prev}
              disabled={index === 0}
              className="p-3 rounded-2xl border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setFlipped(true)}
              className="flex-1 h-full rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-sm shadow-primary-200"
            >
              Lật thẻ
            </button>

            <button
              onClick={() => index < total - 1 && goTo("left", index + 1)}
              disabled={index === total - 1}
              className="p-3 rounded-2xl border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* State B: Confidence rating (shown when flipped) */}
          <div
            className={`absolute inset-0 flex flex-col justify-between transition-all duration-200 ${
              flipped ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"
            }`}
          >
            <p className="text-center text-[11px] text-neutral-400 font-medium">
              Bạn nhớ từ này ở mức nào?
            </p>

            <div className="grid grid-cols-4 gap-2 flex-1 mt-2">
              {CONFIDENCE_BUTTONS.map((btn) => (
                <button
                  key={btn.level}
                  onClick={() => rateCard(btn.level, btn.is_correct)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl border-2 transition-all ${btn.btnClass}`}
                >
                  <span className="text-sm font-bold leading-none">{btn.label}</span>
                  <span className="text-[9px] text-neutral-400 leading-none mt-1">
                    ↻ {btn.reviewAfter}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Keyboard hints ── */}
        <div className="flex items-center gap-4 mt-5 text-[11px] text-neutral-300 shrink-0">
          {[
            { key: "Space", label: "Lật" },
            { key: "← →", label: "Chuyển" },
            { key: "1–4", label: "Đánh giá" },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px] text-neutral-400">
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlashcardsStartPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Đang tải..." />}>
      <StudySession />
    </Suspense>
  );
}
