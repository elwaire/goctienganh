"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useFormatter } from "next-intl";
import { Bug, Lightbulb, MessageCircle } from "lucide-react";
import type { AuthorInfo, FeedbackSummary, FeedbackType } from "@/types/feedback";

export function AuthorRow({ author }: { author: AuthorInfo }) {
  const [imgFailed, setImgFailed] = useState(false);
  const avatarUrl = author.avatar?.trim();
  const showImg = Boolean(avatarUrl) && !imgFailed;
  const initial = (author.fullname || author.username || "?").trim().slice(0, 1).toUpperCase();
  const handle = author.username?.trim()
    ? author.username.startsWith("@")
      ? author.username
      : `@${author.username}`
    : "";

  return (
    <div className="flex gap-2">
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL từ API (domain động)
        <img
          src={avatarUrl}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200/80"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/80"
          aria-hidden
        >
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold leading-tight text-[#000f31]">
          {author.fullname?.trim() || author.username || "—"}
        </p>
        {handle ? (
          <p className="truncate text-[11px] leading-tight text-slate-500">{handle}</p>
        ) : null}
      </div>
    </div>
  );
}

const categoryIcon: Record<FeedbackType, typeof Bug> = {
  bug: Bug,
  feature: Lightbulb,
  other: MessageCircle,
};

export function FeedbackThreadCard({
  item,
  href,
}: {
  item: FeedbackSummary;
  /** Có thì bọc Link tới chi tiết (doc: click item → GET /feedbacks/{id}) */
  href?: string;
}) {
  const t = useTranslations("feedback");
  const format = useFormatter();

  const CatIcon = categoryIcon[item.type] ?? MessageCircle;

  const badgeTone =
    item.type === "bug"
      ? "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-100"
      : item.type === "feature"
        ? "bg-[#eff6ff] text-[#155dfc] ring-1 ring-inset ring-blue-100/80"
        : "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200/80";

  const formatDt = (iso: string) =>
    format.dateTime(new Date(iso), {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const card = (
    <article className="overflow-hidden rounded-lg border border-slate-200/80 bg-white transition-colors hover:border-slate-300/90">
      <div className="px-3 py-2.5">
        <div className="mb-2">
          <AuthorRow author={item.author} />
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-px text-[10px] font-medium uppercase tracking-wide ${badgeTone}`}
          >
            <CatIcon className="h-2.5 w-2.5 shrink-0" strokeWidth={2} aria-hidden />
            {item.type_label}
          </span>
          {item.status_label ? (
            <span className="inline-flex rounded bg-slate-100 px-1.5 py-px text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200/70">
              {item.status_label}
            </span>
          ) : null}
          <span
            className="text-[11px] leading-none text-slate-400"
            title={formatDt(item.created_at)}
          >
            {formatDt(item.created_at)}
          </span>
        </div>

        {item.title?.trim() ? (
          <h3 className="mb-1 text-sm font-semibold leading-snug text-[#000f31]">
            {item.title}
          </h3>
        ) : null}

        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
          {item.body}
        </p>

        {item.message_count > 0 ? (
          <p className="mt-2 text-[10px] text-slate-400">
            {t("messageCount", { count: item.message_count })}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]/35"
      >
        {card}
      </Link>
    );
  }

  return card;
}
