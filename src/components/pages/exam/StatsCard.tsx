import { colorMap } from "@/constants";
import { FileText, Star, Trophy, Zap } from "lucide-react";

export default function StatsCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<FileText className="w-5 h-5" />}
        value="12"
        label="Bài đã làm"
        color="blue"
      />
      <StatCard
        icon={<Trophy className="w-5 h-5" />}
        value="92"
        label="Điểm cao nhất"
        color="amber"
      />
      <StatCard
        icon={<Zap className="w-5 h-5" />}
        value="85%"
        label="Tỷ lệ đúng"
        color="emerald"
      />
      <StatCard
        icon={<Star className="w-5 h-5" />}
        value="5"
        label="Ngày streak"
        color="purple"
      />
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-4 hover:shadow-md transition-shadow">
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
