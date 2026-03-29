import type { StudyMode } from "@/types/vocabulary";
import { CreditCard, PenTool, Headphones } from "lucide-react";
import type { ReactNode } from "react";

export interface GameModeConfig {
  id: StudyMode;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
  bgColor: string;
  difficulty: string;
  estimatedTime: string;
  path: string;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: "flashcard",
    name: "Flashcard",
    description: "Lật thẻ để xem nghĩa và ghi nhớ từ vựng",
    icon: <CreditCard className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    difficulty: "Dễ",
    estimatedTime: "5 phút",
    path: "/practice/flashcard",
  },
  {
    id: "writing",
    name: "Luyện viết từ",
    description:
      "Viết nghĩa, viết từ Anh, điền chữ thiếu hoặc trộn lẫn các kiểu",
    icon: <PenTool className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    difficulty: "Trung bình",
    estimatedTime: "8 phút",
    path: "/practice/writing",
  },
  {
    id: "listening",
    name: "Nghe và viết từ",
    description: "Nghe âm thanh (EN/VI) và viết đáp án đúng",
    icon: <Headphones className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    difficulty: "Trung bình",
    estimatedTime: "7 phút",
    path: "/practice/listening",
  },
];
