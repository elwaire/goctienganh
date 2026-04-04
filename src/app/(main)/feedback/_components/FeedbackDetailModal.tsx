"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { X, Send, Loader2, AlertCircle, MessageCircle } from "lucide-react";
import { feedbackApi } from "@/api/feedbackApi";
import type { RootState } from "@/store";
import type { MessageResponse } from "@/types/feedback";
import { AvatarWithFallback } from "./AvatarWithFallback";
import { TypeBadge } from "./TypeBadge";

const MIN_REPLY = 2;

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    if (typeof d?.message === "string" && d.message.trim()) return d.message;
  }
  return fallback;
}

interface FeedbackDetailModalProps {
  postId: string | null;
  onClose: () => void;
}

export function FeedbackDetailModal({ postId, onClose }: FeedbackDetailModalProps) {
  const t = useTranslations("feedback");
  const format = useFormatter();
  const queryClient = useQueryClient();
  const user = useSelector((s: RootState) => s.auth.user);

  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedback", "detail", postId],
    queryFn: () => feedbackApi.getById(postId!),
    enabled: Boolean(postId),
  });

  const isOwner = Boolean(user?.id && data?.user_id === user.id);

  const replyMutation = useMutation({
    mutationFn: () => feedbackApi.postReply(postId!, { body: replyText.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "detail", postId] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "community"] });
      setReplyText("");
      setReplyError("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    },
    onError: (err: unknown) => {
      setReplyError(apiErrorMessage(err, t("errorGeneric")));
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    setReplyError("");
    if (replyText.trim().length < MIN_REPLY) {
      setReplyError(t("replyMinError", { min: MIN_REPLY }));
      return;
    }
    replyMutation.mutate();
  };

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!postId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("threadDiscussion")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-slate-700">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold">{t("threadDiscussion")}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
            aria-label={t("closeModal")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : isError || !data ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-sm text-red-600">
              <AlertCircle className="h-5 w-5" />
              {t("errorLoadPost")}
            </div>
          ) : (
            <>
              {/* Original post – "zoomed in" */}
              <div className="px-5 pt-5 pb-5 border-b border-slate-100 bg-gradient-to-b from-blue-50/30 to-white">
                <div className="flex items-start gap-3">
                  <AvatarWithFallback author={data.author} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        {data.author.fullname?.trim() || data.author.username || "—"}
                      </span>
                      {data.author.username && (
                        <span className="text-xs text-slate-400">@{data.author.username}</span>
                      )}
                      <span className="text-xs text-slate-400">·</span>
                      <time dateTime={data.created_at} className="text-xs text-slate-400">
                        {format.relativeTime(new Date(data.created_at), { now: new Date() })}
                      </time>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <TypeBadge type={data.type} label={data.type_label} />
                      {data.status_label && (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          {data.status_label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pl-[3.25rem]">
                  {data.title?.trim() && (
                    <h2 className="text-base font-bold text-slate-900 leading-snug mb-2">
                      {data.title}
                    </h2>
                  )}
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.body}
                  </p>
                </div>
              </div>

              {/* Comments section */}
              <div className="px-5 py-4 space-y-4">
                {data.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                    <MessageCircle className="h-8 w-8" strokeWidth={1.5} />
                    <p className="text-sm">{t("noComments")}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {t("discussionCount", { count: data.messages.length })}
                    </p>
                    {data.messages.map((m: MessageResponse) => (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${m.is_staff ? "flex-row-reverse" : ""}`}
                      >
                        <AvatarWithFallback author={m.author} size="sm" />
                        <div
                          className={`max-w-[80%] space-y-1 ${m.is_staff ? "items-end flex flex-col" : ""}`}
                        >
                          <div
                            className={`flex items-center gap-1.5 flex-wrap ${m.is_staff ? "justify-end" : ""}`}
                          >
                            {m.is_staff && (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                                {t("staffLabel")}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-800">
                              {m.author.fullname || m.author.username}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {format.relativeTime(new Date(m.created_at), { now: new Date() })}
                            </span>
                          </div>
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                              m.is_staff
                                ? "bg-blue-600 text-white rounded-tr-sm"
                                : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm"
                            }`}
                          >
                            {m.body}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Reply footer (owner only) */}
        {isOwner && data && (
          <form
            onSubmit={handleReply}
            className="px-4 py-3 border-t border-slate-100 bg-white shrink-0"
          >
            {replyError && (
              <div
                role="alert"
                className="flex items-center gap-2 mb-2 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-xs text-red-700"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {replyError}
              </div>
            )}
            <div className="flex items-center gap-2">
              {user && (
                <AvatarWithFallback
                  author={{ id: user.id, username: user.username, fullname: user.fullname, avatar: user.avatar }}
                  size="sm"
                />
              )}
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("replyPlaceholderDetail")}
                className="flex-1 text-sm text-slate-700 placeholder:text-slate-300 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    (e.currentTarget.closest("form") as HTMLFormElement)?.requestSubmit();
                  }
                }}
              />
              <button
                type="submit"
                disabled={replyMutation.isPending || replyText.trim().length < MIN_REPLY}
                className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replyMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
