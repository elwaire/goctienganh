"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Trophy,
  Shuffle,
  BookOpen,
  Target,
  Zap,
  BarChart2,
  X,
} from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Card = {
  id: string;
  term: string;
  phonetic: string;
  definition: string;
  example: string;
};
type CardStatus = "unseen" | "known" | "unknown";

const DECK: Card[] = [
  {
    id: "1",
    term: "Serendipity",
    phonetic: "/ˌserənˈdɪpɪti/",
    definition:
      "Sự tình cờ may mắn, khám phá ra điều tốt đẹp một cách bất ngờ.",
    example: "It was pure serendipity that we met at the conference.",
  },
  {
    id: "2",
    term: "Ephemeral",
    phonetic: "/ɪˈfemərəl/",
    definition: "Tồn tại trong thời gian rất ngắn; mau qua, thoáng qua.",
    example: "The ephemeral beauty of cherry blossoms makes them precious.",
  },
  {
    id: "3",
    term: "Ubiquitous",
    phonetic: "/juːˈbɪkwɪtəs/",
    definition: "Hiện diện, xuất hiện hoặc tìm thấy ở khắp mọi nơi.",
    example: "Smartphones have become ubiquitous in modern life.",
  },
  {
    id: "4",
    term: "Resilience",
    phonetic: "/rɪˈzɪliəns/",
    definition: "Khả năng phục hồi nhanh chóng sau khó khăn; tính kiên cường.",
    example: "Her resilience helped her overcome many obstacles.",
  },
  {
    id: "5",
    term: "Ambiguous",
    phonetic: "/æmˈbɪɡjuəs/",
    definition: "Có thể hiểu theo nhiều cách; không rõ ràng, mơ hồ.",
    example: "The instructions were ambiguous and caused confusion.",
  },
  {
    id: "6",
    term: "Eloquent",
    phonetic: "/ˈeləkwənt/",
    definition: "Diễn đạt trôi chảy, hùng hồn và thuyết phục.",
    example: "She gave an eloquent speech at the graduation ceremony.",
  },
  {
    id: "7",
    term: "Pragmatic",
    phonetic: "/præɡˈmætɪk/",
    definition: "Thực tế, thực dụng; đặt ra kết quả thực tế lên hàng đầu.",
    example: "We need a pragmatic approach to solve this problem.",
  },
  {
    id: "8",
    term: "Meticulous",
    phonetic: "/məˈtɪkjʊləs/",
    definition: "Rất cẩn thận và chú ý đến từng chi tiết nhỏ.",
    example:
      "She was meticulous in her research and double-checked every fact.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({
  total,
  known,
  onRestart,
  onReview,
}: {
  total: number;
  known: number;
  onRestart: () => void;
  onReview: () => void;
}) {
  const pct = Math.round((known / total) * 100);
  const grade =
    pct >= 80 ? "Xuất sắc! 🎉" : pct >= 60 ? "Khá tốt! 💪" : "Cần ôn thêm 📚";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fefcff] px-6 gap-8">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Trophy */}
        <div className="w-20 h-20 rounded-3xl bg-primary-50 border border-primary-100 flex items-center justify-center">
          <Trophy size={36} className="text-primary-500" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-neutral-900">
            Hoàn thành!
          </h2>
          <p className="text-neutral-500 mt-1 text-sm">{grade}</p>
        </div>

        {/* Score ring */}
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#eef2ff"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#2855f7"
              strokeWidth="8"
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

        {/* Stats */}
        <div className="w-full grid grid-cols-3 gap-3">
          {[
            {
              icon: <Target size={15} />,
              label: "Tổng thẻ",
              value: total,
              color: "text-neutral-700",
            },
            {
              icon: <ThumbsUp size={15} />,
              label: "Đã thuộc",
              value: known,
              color: "text-emerald-600",
            },
            {
              icon: <ThumbsDown size={15} />,
              label: "Cần ôn",
              value: total - known,
              color: "text-red-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-neutral-100 py-3 flex flex-col items-center gap-1"
            >
              <span className={s.color}>{s.icon}</span>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          {total - known > 0 && (
            <button
              onClick={onReview}
              className="w-full py-3.5 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={15} />
              Ôn lại {total - known} thẻ chưa thuộc
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl border border-neutral-200 text-neutral-600 text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            Học lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlashcardsStartPage() {
  const [deck, setDeck] = useState<Card[]>(DECK);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.85;
    utter.pitch = 1;
    // Prefer a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      ["Samantha", "Google US English", "Alex", "Karen"].includes(v.name),
    );
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);

  const card = deck[index];
  const total = deck.length;
  const knownIds = Object.entries(statuses)
    .filter(([, v]) => v === "known")
    .map(([k]) => k);
  const unknownIds = Object.entries(statuses)
    .filter(([, v]) => v === "unknown")
    .map(([k]) => k);
  const seenCount = Object.keys(statuses).length;

  // Navigate with animation
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
      }, 260);
    },
    [isAnimating],
  );

  const prev = () => {
    if (index > 0) goTo("right", index - 1);
  };
  const next = () => {
    if (index < total - 1) goTo("left", index + 1);
    else setIsFinished(true);
  };

  const markCard = (status: "known" | "unknown") => {
    setStatuses((prev) => ({ ...prev, [card.id]: status }));
    if (index < total - 1)
      goTo(status === "known" ? "left" : "left", index + 1);
    else setIsFinished(true);
  };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "1") markCard("known");
      if (e.key === "2") markCard("unknown");
      if (e.key === "p" || e.key === "P") speak(deck[index].term);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, flipped, isAnimating]);

  const handleShuffle = () => {
    setDeck(shuffle(DECK));
    setIndex(0);
    setFlipped(false);
    setStatuses({});
    setIsFinished(false);
    setIsShuffled(true);
  };

  const handleRestart = () => {
    setDeck(DECK);
    setIndex(0);
    setFlipped(false);
    setStatuses({});
    setIsFinished(false);
    setIsShuffled(false);
  };

  const handleReviewUnknown = () => {
    const unknownCards = DECK.filter((c) => statuses[c.id] === "unknown");
    setDeck(unknownCards);
    setIndex(0);
    setFlipped(false);
    setStatuses({});
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <ResultScreen
        total={total}
        known={knownIds.length}
        onRestart={handleRestart}
        onReview={handleReviewUnknown}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcff] flex flex-col">
      {/* ── Header ── */}
      <header className="px-6 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors group">
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="hidden sm:block">IELTS Academic Word List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className={`p-2 rounded-xl border transition-all text-sm ${
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-10 max-w-2xl mx-auto w-full gap-8">
        {/* Progress */}
        <div className="w-full flex flex-col gap-2">
          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {deck.map((c, i) => {
              const status = statuses[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setIndex(i);
                    setFlipped(false);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-5 h-2 bg-primary-500"
                      : status === "known"
                        ? "w-2 h-2 bg-emerald-400"
                        : status === "unknown"
                          ? "w-2 h-2 bg-red-400"
                          : "w-2 h-2 bg-neutral-200 hover:bg-neutral-300"
                  }`}
                />
              );
            })}
          </div>

          {/* Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-500"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-neutral-400 tabular-nums w-14 text-right">
              {index + 1} / {total}
            </span>
          </div>

          {/* Known/unknown counts */}
          {seenCount > 0 && (
            <div className="flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ThumbsUp size={11} /> {knownIds.length} thuộc
              </span>
              <span className="flex items-center gap-1 text-red-500 font-semibold">
                <ThumbsDown size={11} /> {unknownIds.length} chưa thuộc
              </span>
            </div>
          )}
        </div>

        {/* ── Flashcard ── */}
        <div className="w-full" style={{ perspective: "1200px" }}>
          <div
            onClick={() => !isAnimating && setFlipped((f) => !f)}
            style={{
              height: "340px",
              transformStyle: "preserve-3d",
              transform: `${exitDir === "left" ? "translateX(-40px)" : exitDir === "right" ? "translateX(40px)" : "translateX(0)"} ${flipped ? "rotateY(180deg)" : "rotateY(0deg)"}`,
              opacity: exitDir ? 0 : 1,
              transition: exitDir
                ? "opacity 0.25s ease, transform 0.25s ease"
                : "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className="relative cursor-pointer select-none"
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-3xl bg-white border border-neutral-200 shadow-lg shadow-neutral-100 flex flex-col items-center justify-center p-10 gap-4"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary-400 bg-primary-50 px-3 py-1 rounded-full">
                Thuật ngữ
              </span>
              <h2 className="text-4xl font-black text-neutral-900 text-center tracking-tight">
                {card.term}
              </h2>

              {/* Phonetic + Speak button */}
              <div className="flex items-center gap-2">
                {card.phonetic && (
                  <span className="text-sm font-mono text-primary-400">
                    {card.phonetic}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(card.term);
                  }}
                  title="Phát âm (P)"
                  className={`group/speak flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-semibold
                    ${
                      isSpeaking
                        ? "bg-primary-500 border-primary-500 text-white shadow-sm shadow-primary-200"
                        : "bg-primary-50 border-primary-200 text-primary-500 hover:bg-primary-500 hover:border-primary-500 hover:text-white hover:shadow-sm hover:shadow-primary-200"
                    }`}
                >
                  <Volume2
                    size={13}
                    className={
                      isSpeaking
                        ? "animate-pulse"
                        : "group-hover/speak:scale-110 transition-transform"
                    }
                  />
                  <span>{isSpeaking ? "Đang phát..." : "Nghe"}</span>
                  {!isSpeaking && (
                    <kbd className="ml-0.5 px-1 py-0.5 rounded bg-primary-100 group-hover/speak:bg-primary-400 font-mono text-[9px] text-primary-400 group-hover/speak:text-white transition-colors">
                      P
                    </kbd>
                  )}
                </button>
              </div>

              <p className="text-xs text-neutral-300">Nhấn để lật</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-3xl bg-primary-500 shadow-xl shadow-primary-200 flex flex-col items-start justify-center p-10 gap-5"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary-200 bg-primary-600 px-3 py-1 rounded-full">
                Định nghĩa
              </span>
              <p className="text-xl font-bold text-white leading-snug">
                {card.definition}
              </p>
              {card.example && (
                <div className="border-l-2 border-primary-300 pl-4">
                  <p className="text-sm text-primary-100 italic leading-relaxed">
                    "{card.example}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        {flipped ? (
          /* Rating buttons — only show when flipped */
          <div className="w-full flex flex-col gap-3">
            <p className="text-center text-xs text-neutral-400 font-medium">
              Bạn nhớ từ này không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => markCard("unknown")}
                className="flex-1 py-3.5 rounded-2xl border-2 border-red-200 bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 hover:border-red-300 transition-all flex items-center justify-center gap-2 group"
              >
                <ThumbsDown
                  size={15}
                  className="group-hover:scale-110 transition-transform"
                />
                Chưa thuộc
              </button>
              <button
                onClick={() => markCard("known")}
                className="flex-1 py-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-600 text-sm font-bold hover:bg-emerald-100 hover:border-emerald-300 transition-all flex items-center justify-center gap-2 group"
              >
                <ThumbsUp
                  size={15}
                  className="group-hover:scale-110 transition-transform"
                />
                Đã thuộc
              </button>
            </div>
          </div>
        ) : (
          /* Navigation */
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={prev}
              disabled={index === 0}
              className="p-3 rounded-2xl border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setFlipped(true)}
              className="flex-1 py-3.5 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition-colors shadow-sm shadow-primary-100 flex items-center justify-center gap-2"
            >
              <Zap size={15} />
              Lật thẻ
            </button>

            <button
              onClick={next}
              className="p-3 rounded-2xl border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="flex items-center gap-4 text-[11px] text-neutral-300">
          {[
            { key: "Space", label: "Lật" },
            { key: "← →", label: "Chuyển" },
            { key: "1 / 2", label: "Thuộc / Chưa" },
            { key: "P", label: "Phát âm" },
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
