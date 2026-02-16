import { Back, Badge, Streak } from "@/components/ui";
import { BookOpen } from "lucide-react";

// Sub-components
type StudyHeaderProps = {
  currentIndex: number;
  total: number;
  streak: number;
  onExit: () => void;
};

export default function StudyHeader({
  currentIndex,
  total,
  streak,
  onExit,
}: StudyHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Back onExit={onExit} />

      <div className="flex items-center gap-4">
        <Badge
          icon={<BookOpen className="w-4 h-4" />}
          size="lg"
          rounded
          variant="primary"
        >
          {currentIndex + 1} / {total}
        </Badge>
        {streak >= 2 && <Streak streak={streak} />}
      </div>
    </div>
  );
}
