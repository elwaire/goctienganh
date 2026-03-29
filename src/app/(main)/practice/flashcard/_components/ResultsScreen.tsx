import { Check, XCircle, Clock, RotateCcw, Home } from "lucide-react";
import type { CardResult } from "../_types";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface ResultsScreenProps {
  masteredCount: number;
  difficultCount: number;
  totalCount: number;
  elapsedTime: string;
  results: CardResult[];
  onRestart: () => void;
  onExit: () => void;
}

export function ResultsScreen({
  masteredCount,
  difficultCount,
  totalCount,
  elapsedTime,
  results,
  onRestart,
  onExit,
}: ResultsScreenProps) {
  const accuracy = Math.round((masteredCount / totalCount) * 100);
  const [animationData, setAnimationData] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Play sound
    const audio = new Audio("/sounds/level-complete.mp3");
    audio.play().catch(console.error);

    // Fetch lottie
    fetch("/lotties/firework.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(console.error);

    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex justify-center relative bg-gray-50/50">
      {/* Lottie Overlay without dark background */}
      {showOverlay && animationData && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500">
          <Lottie
            animationData={animationData}
            loop={false}
            className="w-full max-w-[600px] aspect-square drop-shadow-2xl scale-125 md:scale-150"
          />
        </div>
      )}

      <div className="max-w-4xl w-full relative z-10 px-4 mt-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Cột trái: Thống kê tổng quan (Box 1) */}
          <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                <Check className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Hoàn thành!
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Bạn đã hoàn thành bộ flashcard
              </p>
            </div>

            {/* Vòng thời gian */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg font-medium text-xs border border-gray-100">
                <Clock className="w-3.5 h-3.5" />
                Thời gian: {elapsedTime}
              </span>
            </div>

            {/* Box thống kê */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-0.5">
                  {masteredCount}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-800/60">
                  Đã thuộc
                </div>
              </div>
              <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-0.5">
                  {difficultCount}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-orange-800/60">
                  Cần ôn
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-4xl font-black text-gray-900 mb-1">
                {accuracy}
                <span className="text-lg text-gray-400 ml-0.5">%</span>
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Độ chính xác
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={onRestart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Học lại
              </button>
              <button
                onClick={onExit}
                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold text-sm py-2.5 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Thoát
              </button>
            </div>
          </div>

          {/* Cột phải: Kết quả chi tiết (Box 2) */}
          <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="mb-3 flex items-center justify-between px-1">
              <h4 className="font-bold text-gray-900 text-base">
                Chi tiết kết quả
              </h4>
              <div className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-wider">
                {results.length} từ
              </div>
            </div>

            <div className="space-y-2.5 overflow-y-auto pr-1.5 custom-scrollbar flex-1 max-h-[420px]">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border ${
                    result.mastered
                      ? "bg-white border-blue-100 shadow-sm"
                      : "bg-gray-50/50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`font-semibold text-sm ${result.mastered ? "text-gray-900" : "text-gray-500"}`}>
                      {result.term}
                    </span>
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${result.mastered ? "bg-blue-50" : "bg-gray-100"}`}
                    >
                      {result.mastered ? (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

