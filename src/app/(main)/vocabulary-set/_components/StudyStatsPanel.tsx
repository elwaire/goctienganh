import { Award } from "lucide-react";
import type { DeckStudyStatsResponse } from "@/types/flashcard";

interface StudyStatsPanelProps {
  stats: DeckStudyStatsResponse | undefined;
}

function formatTimeMs(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours} giờ`;
}

export function StudyStatsPanel({ stats }: StudyStatsPanelProps) {
  if (!stats) return null;

  const accuracyPercent = Math.round(stats.accuracy * 100);
  const progressPercent = Math.round(stats.progress * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-900">Thống kê</h3>
      </div>

      <div className="space-y-3">
        <ProgressStat
          label="Độ chính xác"
          value={accuracyPercent}
          color="bg-blue-600"
        />
        <ProgressStat
          label="Tiến độ"
          value={progressPercent}
          color="bg-green-600"
        />

        <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
          <StatRow label="Đã thuộc" value={`${stats.mastered_cards}/${stats.total_cards} từ`} />
          <StatRow label="Tổng lần học" value={`${stats.total_sessions}`} />
          <StatRow label="Thời gian" value={formatTimeMs(stats.total_time_ms)} />
          {stats.last_studied_at && (
            <StatRow
              label="Lần cuối"
              value={new Date(stats.last_studied_at).toLocaleDateString("vi-VN")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}
