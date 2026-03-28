import { Clock, CreditCard, PenTool, Headphones, BookOpen, BarChart3 } from "lucide-react";
import type { StudyHistorySession, StudyMode } from "@/types/flashcard";

interface StudyHistoryPanelProps {
  sessions: StudyHistorySession[];
}

const MODE_CONFIG: Record<StudyMode, { name: string; icon: React.ReactNode }> = {
  flashcard: { name: "Flashcard", icon: <CreditCard className="w-4 h-4" /> },
  writing: { name: "Luyện viết từ", icon: <PenTool className="w-4 h-4" /> },
  listening: { name: "Nghe từ", icon: <Headphones className="w-4 h-4" /> },
};

function formatTimeMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function StudyHistoryPanel({ sessions }: StudyHistoryPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-900">Lịch sử luyện tập</h3>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">
          Chưa có lịch sử luyện tập
        </p>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {sessions.map((session) => {
            const config = MODE_CONFIG[session.mode];
            const accuracyPercent = Math.round(session.accuracy * 100);

            return (
              <div
                key={session.session_id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {config.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {config.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(session.started_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      accuracyPercent >= 80
                        ? "bg-green-100 text-green-700"
                        : accuracyPercent >= 60
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {accuracyPercent}%
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {session.correct_count}/{session.total_cards} đúng
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeMs(session.total_time_ms)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
