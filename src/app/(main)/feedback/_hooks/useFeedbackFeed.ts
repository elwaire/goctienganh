"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { feedbackApi } from "@/api/feedbackApi";
import type { FeedbackType } from "@/types/feedback";

const COMMUNITY_PAGE_SIZE = 20;
const LIST_LIMIT = 50;

type TabKey = "community" | "mine";

export function useFeedbackFeed(isAuthenticated: boolean) {
  const [activeTab, setActiveTab] = useState<TabKey>("community");
  const [filterType, setFilterType] = useState<FeedbackType | "">("");

  // ── Meta (for type labels) ──
  const { data: meta } = useQuery({
    queryKey: ["feedback", "meta"],
    queryFn: feedbackApi.getMeta,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });

  const typeLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of meta?.types ?? []) map.set(row.value, row.label);
    return map;
  }, [meta?.types]);

  // ── Mine ──
  const mineQuery = useQuery({
    queryKey: ["feedback", "mine", filterType],
    queryFn: () =>
      feedbackApi.listMine({
        page: 1,
        limit: LIST_LIMIT,
        type: filterType || undefined,
      }),
    enabled: isAuthenticated && activeTab === "mine",
    staleTime: 15_000,
  });

  // ── Community ──
  const communityQuery = useInfiniteQuery({
    queryKey: ["feedback", "community", filterType],
    queryFn: ({ pageParam }) =>
      feedbackApi.listCommunity({
        page: pageParam,
        limit: COMMUNITY_PAGE_SIZE,
        type: filterType || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((n, p) => n + p.items.length, 0);
      if (loaded >= lastPage.total) return undefined;
      return allPages.length + 1;
    },
    enabled: isAuthenticated && activeTab === "community",
    staleTime: 15_000,
  });

  const communityItems =
    communityQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const communityTotal = communityQuery.data?.pages[0]?.total ?? 0;
  const mineItems = mineQuery.data?.items ?? [];

  return {
    // Tab
    activeTab,
    setActiveTab,
    // Filter
    filterType,
    setFilterType,
    // Meta
    typeLabels,
    // Community
    communityItems,
    communityTotal,
    communityLoading: communityQuery.isLoading,
    communityError: communityQuery.isError,
    fetchNextPage: communityQuery.fetchNextPage,
    hasNextPage: communityQuery.hasNextPage,
    isFetchingNextPage: communityQuery.isFetchingNextPage,
    // Mine
    mineItems,
    mineLoading: mineQuery.isLoading,
    mineError: mineQuery.isError,
  };
}
