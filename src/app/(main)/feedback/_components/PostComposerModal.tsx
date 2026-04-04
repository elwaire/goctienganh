"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { Bug, Lightbulb, MessageCircle, Send, Loader2, AlertCircle, X } from "lucide-react";
import { feedbackApi } from "@/api/feedbackApi";
import type { FeedbackType } from "@/types/feedback";
import type { RootState } from "@/store";
import { AvatarWithFallback } from "./AvatarWithFallback";

const CATEGORY_OPTIONS: {
  value: FeedbackType;
  tKey: string;
  icon: typeof Bug;
  activeColor: string;
}[] = [
  { value: "bug", tKey: "filterBug", icon: Bug, activeColor: "bg-rose-50 text-rose-700 ring-rose-200" },
  { value: "feature", tKey: "filterFeature", icon: Lightbulb, activeColor: "bg-blue-50 text-blue-700 ring-blue-200" },
  { value: "other", tKey: "filterOther", icon: MessageCircle, activeColor: "bg-slate-50 text-slate-700 ring-slate-200" },
];

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    if (typeof d?.message === "string" && d.message.trim()) return d.message;
  }
  return fallback;
}

interface PostComposerModalProps {
  onClose: () => void;
}

export function PostComposerModal({ onClose }: PostComposerModalProps) {
  const t = useTranslations("feedback");
  const queryClient = useQueryClient();
  const user = useSelector((s: RootState) => s.auth.user);

  const [category, setCategory] = useState<FeedbackType>("feature");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [clientError, setClientError] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      feedbackApi.create({
        type: category,
        title: subject.trim() || undefined,
        body: message.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "community"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "meta"] });
      onClose();
    },
    onError: (err: unknown) => {
      setClientError(apiErrorMessage(err, t("errorGeneric")));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");
    if (message.trim().length < 10) {
      setClientError(t("validationMessageMin", { min: 10 }));
      return;
    }
    createMutation.mutate();
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t("composerModalTitle")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">{t("composerModalTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
            aria-label={t("closeModal")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 pt-4 pb-2 space-y-4">
            {/* Author */}
            {user && (
              <div className="flex items-center gap-2.5">
                <AvatarWithFallback
                  author={{ id: user.id, username: user.username, fullname: user.fullname, avatar: user.avatar }}
                  size="md"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user.fullname || user.username}
                  </p>
                  {user.username && (
                    <p className="text-xs text-slate-400">@{user.username}</p>
                  )}
                </div>
              </div>
            )}

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = category === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-all ${
                      active ? opt.activeColor : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
                    {t(opt.tKey)}
                  </button>
                );
              })}
            </div>

            {/* Subject */}
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("composerSubjectPlaceholder")}
              maxLength={500}
              autoComplete="off"
              className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-300 placeholder:font-normal bg-transparent border-b border-slate-100 pb-2 focus:outline-none focus:border-blue-400 transition-colors"
            />

            {/* Body */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("composerBodyPlaceholder")}
              rows={5}
              autoFocus
              className="w-full resize-none text-sm text-slate-700 placeholder:text-slate-300 bg-transparent focus:outline-none"
            />

            {/* Error */}
            {clientError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {clientError}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <span className="text-xs text-slate-400">{message.trim().length}/2000</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t("composerCancel")}
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || message.trim().length < 10}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {t("composerPost")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
