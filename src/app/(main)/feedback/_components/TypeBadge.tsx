"use client";

import { Bug, Lightbulb, MessageCircle } from "lucide-react";
import type { FeedbackType } from "@/types/feedback";

const CONFIG: Record<
  FeedbackType,
  { icon: typeof Bug; bg: string; text: string; ring: string; label?: string }
> = {
  bug: {
    icon: Bug,
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
  },
  feature: {
    icon: Lightbulb,
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },
  other: {
    icon: MessageCircle,
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-200",
  },
};

interface TypeBadgeProps {
  type: FeedbackType;
  label: string;
}

export function TypeBadge({ type, label }: TypeBadgeProps) {
  const cfg = CONFIG[type] ?? CONFIG.other;
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      <Icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}
