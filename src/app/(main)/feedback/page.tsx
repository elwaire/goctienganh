"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSelector } from "react-redux";
import { isAxiosError } from "axios";
import { MessageSquarePlus, Loader2, AlertCircle } from "lucide-react";
import { feedbackApi } from "@/api/feedbackApi";
import type { RootState } from "@/store";
import type { FeedbackType } from "@/types/feedback";
import { FeedbackThreadCard } from "./_components/FeedbackThreadCard";

const LIST_LIMIT = 50;
const COMMUNITY_PAGE_SIZE = 20;

const accent = "bg-[#155dfc] hover:bg-[#1248c9] focus-visible:ring-[#155dfc]";
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#155dfc] focus:outline-none focus:ring-1 focus:ring-[#155dfc]/25";
const filterBtn =
  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]/40";
const filterBtnActive = `${accent} text-white`;
const filterBtnIdle =
  "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50";

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    if (typeof d?.message === "string" && d.message.trim()) return d.message;
  }
  return fallback;
}

export default function FeedbackPage() {
  const t = useTranslations("feedback");
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const [category, setCategory] = useState<FeedbackType>("feature");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [clientError, setClientError] = useState("");

  const [mineType, setMineType] = useState<FeedbackType | "">("");
  const [communityType, setCommunityType] = useState<FeedbackType | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: meta } = useQuery({
    queryKey: ["feedback", "meta"],
    queryFn: () => feedbackApi.getMeta(),
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });

  const typeLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of meta?.types ?? []) {
      map.set(row.value, row.label);
    }
    return map;
  }, [meta?.types]);

  const {
    data: minePayload,
    isLoading: mineLoading,
    isError: mineError,
  } = useQuery({
    queryKey: ["feedback", "mine", mineType],
    queryFn: () =>
      feedbackApi.listMine({
        page: 1,
        limit: LIST_LIMIT,
        type: mineType || undefined,
      }),
    enabled: isAuthenticated,
    staleTime: 15_000,
  });

  const {
    data: communityData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: communityLoading,
    isError: communityError,
  } = useInfiniteQuery({
    queryKey: ["feedback", "community", debouncedSearch, communityType],
    queryFn: ({ pageParam }) =>
      feedbackApi.listCommunity({
        page: pageParam,
        limit: COMMUNITY_PAGE_SIZE,
        search: debouncedSearch || undefined,
        type: communityType || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((n, p) => n + p.items.length, 0);
      if (loaded >= lastPage.total) return undefined;
      return allPages.length + 1;
    },
    enabled: isAuthenticated,
    staleTime: 15_000,
  });

  const mineItems = minePayload?.items ?? [];
  const communityItems = communityData?.pages.flatMap((p) => p.items) ?? [];
  const communityTotal = communityData?.pages[0]?.total ?? 0;

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
    },
    onError: (err: unknown) => {
      setClientError(apiErrorMessage(err, t("errorGeneric")));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError("");

    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setClientError(t("validationMessageMin", { min: 10 }));
      return;
    }

    createMutation.mutate();
  };

  const categoryOptions = (
    [
      ["bug", "categoryBug"],
      ["feature", "categoryFeature"],
      ["other", "categoryOther"],
    ] as const
  ).map(([value, key]) => ({
    value: value as FeedbackType,
    label: typeLabels.get(value) ?? t(key),
  }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] max-w-lg mx-auto flex flex-col items-center justify-center px-4 pb-16 pt-12 text-center">
        <MessageSquarePlus
          className="mb-4 h-10 w-10 text-[#155dfc]"
          strokeWidth={1.5}
          aria-hidden
        />
        <h1 className="mb-2 text-xl font-semibold text-[#000f31]">{t("title")}</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">{t("loginRequired")}</p>
        <Link
          href="/login"
          className="rounded-lg bg-[#155dfc] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1248c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] focus-visible:ring-offset-2"
        >
          {t("goToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 pt-1">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#155dfc]">
            <MessageSquarePlus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 space-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight text-[#000f31] sm:text-2xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </header>

      <div className="mb-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
        <section className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
              {t("newPostTitle")}
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6"
          >
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-slate-600">
                {t("categoryLabel")}
              </legend>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map(({ value, label }) => {
                  const active = category === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCategory(value)}
                      aria-pressed={active}
                      className={`rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc]/40 ${
                        active
                          ? `${accent} text-white`
                          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-1.5">
              <label
                htmlFor="feedback-subject"
                className="text-xs font-medium text-slate-600"
              >
                {t("subjectLabel")}
              </label>
              <input
                id="feedback-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subjectPlaceholder")}
                className={inputClass}
                maxLength={500}
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="feedback-message"
                className="text-xs font-medium text-slate-600"
              >
                {t("messageLabel")}{" "}
                <span className="text-red-500" aria-hidden>
                  *
                </span>
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={5}
                className={`${inputClass} min-h-[120px] resize-y`}
                required
              />
            </div>

            {clientError && (
              <div
                role="alert"
                className="flex gap-2 rounded-lg border border-red-100 bg-red-50/90 px-3 py-2.5 text-sm text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                <span>{clientError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending || message.trim().length < 10}
              className={`w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 ${accent} focus-visible:ring-[#155dfc]`}
            >
              {createMutation.isPending ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("submitting")}
                </span>
              ) : (
                t("submit")
              )}
            </button>
          </form>
        </section>

        <section className="min-h-0 min-w-0 space-y-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
            {t("yourFeedbackTitle")}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setMineType("")}
              aria-pressed={mineType === ""}
              className={`${filterBtn} ${mineType === "" ? filterBtnActive : filterBtnIdle}`}
            >
              {t("filterTypeAll")}
            </button>
            {categoryOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMineType(value)}
                aria-pressed={mineType === value}
                className={`${filterBtn} ${mineType === value ? filterBtnActive : filterBtnIdle}`}
              >
                {label}
              </button>
            ))}
          </div>

          {mineLoading ? (
            <div
              className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200/90 bg-white text-slate-500 sm:h-[440px]"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-7 w-7 animate-spin text-[#155dfc]" aria-hidden />
              <p className="text-sm">{t("loadingWall")}</p>
            </div>
          ) : mineError ? (
            <p className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-6 text-center text-sm text-red-800">
              {t("loadError")}
            </p>
          ) : !mineItems.length ? (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 text-center text-sm text-slate-500 sm:h-[440px]">
              {t("emptyYourFeedback")}
            </div>
          ) : (
            <ul
              className="flex h-[400px] flex-col gap-3 overflow-y-auto overflow-x-hidden pr-2 [scrollbar-gutter:stable] sm:h-[440px]"
            >
              {mineItems.map((thread) => (
                <li key={thread.id} className="min-h-0 shrink-0">
                  <FeedbackThreadCard item={thread} href={`/feedback/${thread.id}`} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="space-y-4 border-t border-slate-100 pt-14">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
          {t("communitySectionTitle")}
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-0 flex-1 sm:max-w-sm">
            <label
              htmlFor="feedback-community-search"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              {t("searchLabel")}
            </label>
            <input
              id="feedback-community-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className={inputClass}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setCommunityType("")}
              aria-pressed={communityType === ""}
              className={`${filterBtn} ${communityType === "" ? filterBtnActive : filterBtnIdle}`}
            >
              {t("filterTypeAll")}
            </button>
            {categoryOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCommunityType(value)}
                aria-pressed={communityType === value}
                className={`${filterBtn} ${communityType === value ? filterBtnActive : filterBtnIdle}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {communityTotal > 0 ? (
          <p className="text-[11px] text-slate-400">
            {t("listTotalHint", { count: communityTotal })}
          </p>
        ) : null}

        {communityLoading ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200/90 bg-white py-20 text-slate-500"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-7 w-7 animate-spin text-[#155dfc]" aria-hidden />
            <p className="text-sm">{t("loadingWall")}</p>
          </div>
        ) : communityError ? (
          <p className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-6 text-center text-sm text-red-800">
            {t("loadError")}
          </p>
        ) : !communityItems.length ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-16 text-center text-sm text-slate-500">
            {t("emptyWall")}
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {communityItems.map((thread) => (
                <li key={thread.id}>
                  <FeedbackThreadCard item={thread} href={`/feedback/${thread.id}`} />
                </li>
              ))}
            </ul>
            {hasNextPage ? (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#155dfc]" aria-hidden />
                  ) : null}
                  {t("loadMore")}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
