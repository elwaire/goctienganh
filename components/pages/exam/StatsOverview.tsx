import { colorMap } from "@/constants";
import { Clock, FileText, Star, Trophy } from "lucide-react";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<FileText className="w-5 h-5" />}
        label="Bài đã làm"
        value="24"
        color="blue"
      />
      <StatCard
        icon={<Trophy className="w-5 h-5" />}
        label="Điểm cao nhất"
        value="95"
        color="amber"
      />
      <StatCard
        icon={<Clock className="w-5 h-5" />}
        label="Giờ luyện tập"
        value="12.5"
        color="emerald"
      />
      <StatCard
        icon={<Star className="w-5 h-5" />}
        label="Streak"
        value="7 ngày"
        color="purple"
      />
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-4">
      <div
        className={`w-10 h-10 ${colors.bgLight} rounded-xl flex items-center justify-center mb-3`}
      >
        <span className={colors.text}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-800">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
