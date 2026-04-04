"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FeedbackType } from "@/types/feedback";
import type { useFeedbackFeed } from "../_hooks/useFeedbackFeed";
import { FeedbackPostCard } from "./FeedbackPostCard";

type FeedProps = ReturnType<typeof useFeedbackFeed> & {
  onPostClick: (id: string) => void;
};

const FILTER_KEYS: { value: FeedbackType | ""; tKey: string }[] = [
  { value: "", tKey: "filterAll" },
  { value: "bug", tKey: "filterBug" },
  { value: "feature", tKey: "filterFeature" },
  { value: "other", tKey: "filterOther" },
];

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-red-600">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

export function FeedbackFeed(props: FeedProps) {
  const t = useTranslations("feedback");
  const {
    activeTab,
    setActiveTab,
    filterType,
    setFilterType,
    communityItems,
    communityTotal,
    communityLoading,
    communityError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    mineItems,
    mineLoading,
    mineError,
    onPostClick,
  } = props;

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {(
          [
            { key: "community", label: t("tabCommunity") },
            { key: "mine", label: t("tabMine") },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_KEYS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilterType(opt.value)}
            aria-pressed={filterType === opt.value}
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-all ${
              filterType === opt.value
                ? "bg-blue-600 text-white ring-blue-600"
                : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {t(opt.tKey)}
          </button>
        ))}
      </div>

      {/* Community count */}
      {activeTab === "community" && communityTotal > 0 && (
        <p className="text-xs text-slate-400">
          {t("totalPosts", { count: communityTotal })}
        </p>
      )}

      {/* Feed list */}
      {activeTab === "community" ? (
        communityLoading ? (
          <LoadingState />
        ) : communityError ? (
          <ErrorState message={t("errorLoad")} />
        ) : communityItems.length === 0 ? (
          <EmptyState message={t("emptyFeed")} />
        ) : (
          <div className="space-y-2">
            {communityItems.map((item) => (
              <FeedbackPostCard key={item.id} item={item} onPostClick={onPostClick} />
            ))}
            {hasNextPage && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  {isFetchingNextPage && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  )}
                  {t("loadMoreBtn")}
                </button>
              </div>
            )}
          </div>
        )
      ) : mineLoading ? (
        <LoadingState />
      ) : mineError ? (
        <ErrorState message={t("errorLoad")} />
      ) : mineItems.length === 0 ? (
        <EmptyState message={t("emptyMineFeed")} />
      ) : (
        <div className="space-y-2">
          {mineItems.map((item) => (
            <FeedbackPostCard key={item.id} item={item} onPostClick={onPostClick} />
          ))}
        </div>
      )}
    </div>
  );
}
