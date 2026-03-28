import { Check, XCircle, Clock, RotateCcw, Home } from "lucide-react";
import type { WritingResult } from "../_types";
import { WRITING_MODES } from "../_types";
import type { WritingMode } from "@/types/vocabulary";

interface WritingResultsScreenProps {
  mode: WritingMode | null;
  correctCount: number;
  wrongCount: number;
  totalCount: number;
  elapsedTime: string;
  results: WritingResult[];
  onRestart: () => void;
  onExit: () => void;
}

export function WritingResultsScreen({
  mode,
  correctCount,
  wrongCount,
  totalCount,
  elapsedTime,
  results,
  onRestart,
  onExit,
}: WritingResultsScreenProps) {
  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const modeInfo = WRITING_MODES.find((m) => m.id === mode);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hoàn thành!
            </h2>
            <p className="text-gray-600 text-sm">
              Bạn đã hoàn thành: {modeInfo?.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {correctCount}
              </div>
              <div className="text-xs text-gray-600">Đúng</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {wrongCount}
              </div>
              <div className="text-xs text-gray-600">Sai</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {accuracy}%
            </div>
            <div className="text-sm text-gray-600">Độ chính xác</div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6 text-sm">
            <Clock className="w-4 h-4" />
            <span>Thời gian: {elapsedTime}</span>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">
              Kết quả chi tiết:
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    result.correct ? "bg-blue-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        {result.term}
                      </p>
                      {!result.correct && (
                        <div className="text-xs space-y-0.5">
                          <p className="text-red-600">
                            Bạn trả lời: {result.userAnswer}
                          </p>
                          <p className="text-gray-600">
                            Đáp án đúng: {result.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                    {result.correct ? (
                      <Check className="w-5 h-5 text-blue-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Học lại
            </button>
            <button
              onClick={onExit}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Thoát
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
