import { Flame } from "lucide-react";

interface StreakProps {
  streak: number;
}

export default function Streak({ streak }: StreakProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full">
      <Flame className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-medium text-orange-600">
        {streak} streak!
      </span>
    </div>
  );
}
