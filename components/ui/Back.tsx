import { useTranslation } from "@/context";
import { ArrowLeft } from "lucide-react";

interface BackProps {
  onExit: () => void;
  title?: string;
  className?: string;
}

export default function Back({ onExit, title, className }: BackProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onExit}
      className={`flex items-center cursor-pointer gap-2 text-neutral-600 hover:text-neutral-800 transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{title || t("common.back")}</span>
    </button>
  );
}
