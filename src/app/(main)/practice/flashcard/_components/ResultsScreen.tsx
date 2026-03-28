import { Check, XCircle, Clock, RotateCcw, Home } from "lucide-react";
import type { CardResult } from "../_types";

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
  // calculate locally
  const accuracy = Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hoàn thành!
            </h2>
            <p className="text-gray-600">Bạn đã hoàn thành bộ flashcard</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {masteredCount}
              </div>
              <div className="text-sm text-gray-600">Đã thuộc</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {difficultCount}
              </div>
              <div className="text-sm text-gray-600">Cần ôn</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="text-5xl font-bold text-blue-600 mb-1">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Thời gian: {elapsedTime}</span>
          </div>

          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-3">Kết quả:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.mastered ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <span className="font-medium text-gray-900">
                    {result.term}
                  </span>
                  {result.mastered ? (
                    <Check className="w-5 h-5 text-blue-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
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
