"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Bug,
  Lightbulb,
  Loader2,
  MessageCircle,
  Send,
  AlertCircle,
} from "lucide-react";
import { feedbackApi } from "@/api/feedbackApi";
import { AuthorRow } from "../_components/FeedbackThreadCard";
import type { RootState } from "@/store";
import type { FeedbackType, MessageResponse } from "@/types/feedback";

const categoryIcon: Record<FeedbackType, typeof Bug> = {
  bug: Bug,
  feature: Lightbulb,
  other: MessageCircle,
};

const MIN_REPLY = 2;

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    if (typeof d?.message === "string" && d.message.trim()) return d.message;
  }
  return fallback;
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const t = useTranslations("feedback");
  const format = useFormatter();
  const queryClient = useQueryClient();
  const user = useSelector((s: RootState) => s.auth.user);

  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["feedback", "detail", id],
    queryFn: () => feedbackApi.getById(id),
    enabled: Boolean(id),
    retry: (failureCount, err) => {
      if (isAxiosError(err) && err.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  const isOwner = Boolean(user?.id && data?.user_id === user.id);

  const replyMutation = useMutation({
    mutationFn: () => feedbackApi.postReply(id, { body: replyText.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "community"] });
      setReplyText("");
      setReplyError("");
    },
    onError: (err: unknown) => {
      setReplyError(apiErrorMessage(err, t("errorGeneric")));
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError("");
    if (replyText.trim().length < MIN_REPLY) {
      setReplyError(t("replyValidationMin", { min: MIN_REPLY }));
      return;
    }
    replyMutation.mutate();
  };

  const formatDt = (iso: string) =>
    format.dateTime(new Date(iso), {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (!id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-slate-500">
        {t("notFoundFeedback")}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-[#155dfc]" aria-hidden />
        <p className="text-sm">{t("loadingWall")}</p>
      </div>
    );
  }

  if (isError || !data) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-red-700">
          {notFound ? t("notFoundFeedback") : t("loadError")}
        </p>
        <Link
          href="/feedback"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#155dfc] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const CatIcon = categoryIcon[data.type] ?? MessageCircle;
  const badgeTone =
    data.type === "bug"
      ? "bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-100"
      : data.type === "feature"
        ? "bg-[#eff6ff] text-[#155dfc] ring-1 ring-inset ring-blue-100/80"
        : "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200/80";

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-4 sm:px-6">
      <Link
        href="/feedback"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#155dfc]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("backToList")}
      </Link>

      <header className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 rounded px-1.5 py-px text-[10px] font-medium uppercase tracking-wide ${badgeTone}`}
        >
          <CatIcon className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
          {data.type_label}
        </span>
        {data.status_label ? (
          <span className="inline-flex rounded bg-slate-100 px-1.5 py-px text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200/70">
            {data.status_label}
          </span>
        ) : null}
        <time className="text-[11px] text-slate-400" dateTime={data.created_at}>
          {formatDt(data.created_at)}
        </time>
      </header>

      <div className="mb-6 rounded-lg border border-slate-200/80 bg-white px-3 py-2.5">
        <AuthorRow author={data.author} />
        {data.title?.trim() ? (
          <h1 className="mt-3 text-base font-semibold text-[#000f31]">{data.title}</h1>
        ) : null}
        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
          {data.body}
        </p>
      </div>

      <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
        {t("threadDiscussion")}
      </h2>

      <ul className="space-y-3">
        {data.messages.map((m: MessageResponse) => (
          <li
            key={m.id}
            className={`flex max-w-[95%] flex-col gap-1.5 rounded-lg border px-3 py-2 text-xs ${
              m.is_staff
                ? "ml-auto border-[#155dfc]/20 bg-[#eff6ff]/80"
                : "mr-auto border-slate-200/80 bg-slate-50/80"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {m.is_staff ? (
                <span className="rounded bg-[#155dfc] px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {t("staffBadge")}
                </span>
              ) : null}
              <span className="font-medium text-[#000f31]">{m.author.fullname}</span>
              <span className="text-[10px] text-slate-400">{formatDt(m.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{m.body}</p>
          </li>
        ))}
      </ul>

      {isOwner ? (
        <form
          onSubmit={handleReply}
          className="mt-6 rounded-lg border border-slate-200/90 bg-white p-3"
        >
          <label htmlFor="feedback-reply" className="mb-2 block text-xs font-medium text-slate-600">
            {t("followUpLabel")}
          </label>
          <textarea
            id="feedback-reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            placeholder={t("replyPlaceholder")}
            className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#155dfc] focus:outline-none focus:ring-1 focus:ring-[#155dfc]/25"
          />
          {replyError ? (
            <p className="mb-2 flex items-center gap-1.5 text-xs text-red-600" role="alert">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {replyError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={replyMutation.isPending || replyText.trim().length < MIN_REPLY}
            className="inline-flex items-center gap-2 rounded-lg bg-[#155dfc] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1248c9] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {replyMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Send className="h-4 w-4" aria-hidden />
            )}
            {t("sendFollowUp")}
          </button>
        </form>
      ) : null}
    </div>
  );
}
