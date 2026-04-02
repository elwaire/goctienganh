"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { vocabularyApi } from "@/api/vocabularyApi";
import { DeckCard, CreateDeckModal, DeckListEmptyState } from "./_components";
import { ButtonPrimary, FormInput } from "@/components/ui";
import { useDebounce } from "./_hooks";
import { buildVocabularyListSections } from "./_lib/buildListSections";

const LIST_TAB_VALUES = ["my-sets", "public"] as const;
type VocabularyListTab = (typeof LIST_TAB_VALUES)[number];

function listTabFromParam(value: string | null): VocabularyListTab {
  if (value === "public" || value === "my-sets") return value;
  return "my-sets";
}

/** URL cũ `?folder=` → một trang chi tiết duy nhất */
function useRedirectLegacyFolder(router: ReturnType<typeof useRouter>) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const fid = searchParams.get("folder");
    if (fid) {
      router.replace(`/vocabulary-set/${encodeURIComponent(fid)}`);
    }
  }, [searchParams, router]);
}

export default function VocabularySetPage() {
  const tl = useTranslations("vocabulary.list");
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = listTabFromParam(searchParams.get("tab"));

  useRedirectLegacyFolder(router);

  const setListTab = useCallback(
    (tab: VocabularyListTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      params.delete("folder");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const legacyFolder = searchParams.get("folder");

  const searchParamsApi = debouncedSearch || undefined;

  const mySetsQuery = useQuery({
    queryKey: ["vocabularySets", "list", "mine", { search: searchParamsApi }],
    queryFn: () =>
      vocabularyApi.getSets({
        search: searchParamsApi,
        page: 1,
        limit: 50,
        vocabulary: "me",
      }),
    enabled: !legacyFolder && activeTab === "my-sets",
  });

  const publicSetsQuery = useQuery({
    queryKey: ["vocabularySets", "list", "public", { search: searchParamsApi }],
    queryFn: () =>
      vocabularyApi.getSets({
        search: searchParamsApi,
        page: 1,
        limit: 50,
        vocabulary: "public",
      }),
    enabled: !legacyFolder && activeTab === "public",
  });

  const deckData =
    activeTab === "my-sets" ? mySetsQuery.data : publicSetsQuery.data;
  const isLoading =
    activeTab === "my-sets"
      ? mySetsQuery.isLoading
      : publicSetsQuery.isLoading;
  const isError =
    activeTab === "my-sets" ? mySetsQuery.isError : publicSetsQuery.isError;

  const listSections = useMemo(
    () =>
      deckData ? buildVocabularyListSections(deckData, activeTab) : [],
    [deckData, activeTab],
  );

  /** Cả hai số có trong mọi response list; ưu tiên query đã có data (doc §1.1). */
  const mineTotal =
    mySetsQuery.data?.mine_total ?? publicSetsQuery.data?.mine_total;
  const publicTotal =
    publicSetsQuery.data?.public_total ?? mySetsQuery.data?.public_total;

  const myTabCountSuffix =
    mineTotal !== undefined ? ` (${mineTotal})` : "";
  const publicTabCountSuffix =
    publicTotal !== undefined ? ` (${publicTotal})` : "";

  const createMutation = useMutation({
    mutationFn: vocabularyApi.createSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularySets"] });
      setShowCreateModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vocabularyApi.deleteSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabularySets"] });
    },
  });

  const handleDeleteDeck = (deckId: string) => {
    if (confirm(tl("confirmDelete"))) {
      deleteMutation.mutate(deckId);
    }
  };

  if (legacyFolder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-neutral-400">{tl("loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <p className="text-sm text-neutral-500">{tl("loadError")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                {tl("title")}
              </h1>
              <p className="text-neutral-500">{tl("subtitle")}</p>
            </div>
            <ButtonPrimary
              onClick={() => setShowCreateModal(true)}
              variant="outline"
              rounded="md"
            >
              <Plus className="w-5 h-5" />
              {tl("createNew")}
            </ButtonPrimary>
          </div>

          <FormInput
            type="text"
            placeholder={tl("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-neutral-400" />}
            className="w-full max-w-lg"
          />
        </div>

        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border w-full border-neutral-200 lg:w-fit">
          <button
            type="button"
            onClick={() => setListTab("my-sets")}
            className={`px-6 py-2.5 rounded-lg flex-1 lg:flex-none font-medium transition-all ${
              activeTab === "my-sets"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {tl("tabMy")}
            {myTabCountSuffix}
          </button>
          <button
            type="button"
            onClick={() => setListTab("public")}
            className={`px-6 py-2.5 rounded-lg flex-1 lg:flex-none font-medium transition-all ${
              activeTab === "public"
                ? "bg-primary-500 text-white shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {tl("tabPublic")}
            {publicTabCountSuffix}
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <p className="text-sm text-neutral-400">{tl("loading")}</p>
          </div>
        ) : listSections.length > 0 ? (
          <div className="space-y-14">
            {listSections.map((section) => {
              const catId = section.category?.id ?? "none";
              return (
                <section
                  key={catId}
                  aria-labelledby={`vocab-cat-${catId}`}
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 self-stretch min-h-10 rounded-full bg-primary-500 shrink-0"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <h2
                        id={`vocab-cat-${catId}`}
                        className="text-2xl font-bold text-neutral-900 tracking-tight"
                      >
                        {section.category?.name ?? tl("categoryOther")}
                      </h2>
                      {section.category?.description ? (
                        <p className="text-neutral-600 mt-1 text-sm leading-relaxed">
                          {section.category.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {section.sets.map((deck) => (
                      <DeckCard
                        key={deck.id}
                        deck={deck}
                        onDelete={handleDeleteDeck}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <DeckListEmptyState
            searchQuery={searchQuery}
            activeTab={activeTab}
            onCreateNew={() => setShowCreateModal(true)}
          />
        )}
      </div>

      <CreateDeckModal
        isOpen={showCreateModal}
        isCreating={createMutation.isPending}
        onClose={() => setShowCreateModal(false)}
        onSave={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
