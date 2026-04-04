"use client";

import { useFormatter, useTranslations } from "next-intl";
import { MessageCircle, ChevronRight } from "lucide-react";
import type { FeedbackSummary } from "@/types/feedback";
import { AvatarWithFallback } from "./AvatarWithFallback";
import { TypeBadge } from "./TypeBadge";

interface FeedbackPostCardProps {
  item: FeedbackSummary;
  onPostClick: (id: string) => void;
}

export function FeedbackPostCard({ item, onPostClick }: FeedbackPostCardProps) {
  const t = useTranslations("feedback");
  const format = useFormatter();

  const timeAgo = format.relativeTime(new Date(item.created_at), { now: new Date() });

  return (
    <button
      type="button"
      onClick={() => onPostClick(item.id)}
      className="group w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 rounded-2xl"
    >
      <article className="relative bg-white border border-slate-100 rounded-2xl p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-md hover:-translate-y-px">
        {/* Top row: avatar + meta + chevron */}
        <div className="flex items-start gap-3">
          <AvatarWithFallback author={item.author} size="md" />

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-slate-900 truncate leading-tight">
                {item.author.fullname?.trim() || item.author.username || "—"}
              </span>
              {item.author.username && (
                <span className="text-xs text-slate-400 truncate">
                  @{item.author.username}
                </span>
              )}
              <span className="text-xs text-slate-400">·</span>
              <time
                dateTime={item.created_at}
                className="text-xs text-slate-400 shrink-0"
                title={format.dateTime(new Date(item.created_at), {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              >
                {timeAgo}
              </time>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <TypeBadge type={item.type} label={item.type_label} />
              {item.status_label && (
                <span className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  {item.status_label}
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Content */}
        <div className="mt-3 pl-12">
          {item.title?.trim() && (
            <h3 className="text-sm font-semibold text-slate-900 leading-snug mb-1 group-hover:text-blue-700 transition-colors">
              {item.title}
            </h3>
          )}
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 whitespace-pre-wrap">
            {item.body}
          </p>
        </div>

        {/* Footer: comment count */}
        {item.message_count > 0 && (
          <div className="mt-3 pl-12 flex items-center gap-1.5 text-xs text-slate-400">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{t("commentCount", { count: item.message_count })}</span>
          </div>
        )}
      </article>
    </button>
  );
}
