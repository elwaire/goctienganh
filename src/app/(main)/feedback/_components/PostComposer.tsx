"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";
import {
  Bug,
  Lightbulb,
  MessageCircle,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
  {
    value: "bug",
    tKey: "filterBug",
    icon: Bug,
    activeColor: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  {
    value: "feature",
    tKey: "filterFeature",
    icon: Lightbulb,
    activeColor: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  {
    value: "other",
    tKey: "filterOther",
    icon: MessageCircle,
    activeColor: "bg-slate-50 text-slate-700 ring-slate-200",
  },
];

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    if (typeof d?.message === "string" && d.message.trim()) return d.message;
  }
  return fallback;
}

export function PostComposer() {
  const t = useTranslations("feedback");
  const queryClient = useQueryClient();
  const user = useSelector((s: RootState) => s.auth.user);

  const [category, setCategory] = useState<FeedbackType>("feature");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [clientError, setClientError] = useState("");
  const [expanded, setExpanded] = useState(false);

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
      setSubject("");
      setMessage("");
      setClientError("");
      setExpanded(false);
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

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 p-4">
          {user && (
            <AvatarWithFallback
              author={{
                id: user.id ?? "",
                username: user.username ?? "",
                fullname: user.fullname ?? user.username ?? "",
                avatar: user.avatar ?? "",
              }}
              size="md"
            />
          )}
          <div className="flex-1 min-w-0">
            {!expanded ? (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="w-full text-left px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-400 transition-colors"
              >
                {t("composerPlaceholder")}
              </button>
            ) : (
              <div className="space-y-3">
                {/* Category toggle */}
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
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-all ${
                          active
                            ? opt.activeColor
                            : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
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
                  rows={4}
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
            )}
          </div>
        </div>

        {/* Actions row */}
        {expanded && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5">
            <span className="text-xs text-slate-400">
              {message.trim().length}/2000
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  setSubject("");
                  setMessage("");
                  setClientError("");
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
              >
                {t("composerCancel")}
              </button>
              <button
                type="submit"
                disabled={
                  createMutation.isPending || message.trim().length < 10
                }
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
        )}
      </form>
    </div>
  );
}
