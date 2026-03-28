import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Play,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { DeckWithCardsResponse, DeckStudyStatsResponse } from "@/types/flashcard";

interface DeckHeaderProps {
  deck: DeckWithCardsResponse;
  stats?: DeckStudyStatsResponse;
  onStartGame: () => void;
}

export function DeckHeader({ deck, stats, onStartGame }: DeckHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <button
        onClick={() => router.push("/vocabulary-set")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Quay lại</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {deck.title}
            </h1>
            {deck.description && (
              <p className="text-gray-600 text-sm mb-4">{deck.description}</p>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <QuickStat
                icon={<BookOpen className="w-4 h-4 text-blue-600" />}
                value={`${deck.cards.length}`}
                label="Từ vựng"
              />
              <QuickStat
                icon={<TrendingUp className="w-4 h-4 text-green-600" />}
                value={`${stats ? Math.round(stats.progress * 100) : 0}%`}
                label="Hoàn thành"
              />
              <QuickStat
                icon={<Award className="w-4 h-4 text-yellow-600" />}
                value={`${stats ? Math.round(stats.accuracy * 100) : 0}%`}
                label="Chính xác"
              />
              <QuickStat
                icon={<Clock className="w-4 h-4 text-purple-600" />}
                value={`${stats?.total_sessions ?? 0}`}
                label="Lần học"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onStartGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Học ngay
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  );
}
