"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { vocabularyApi } from "@/api/vocabularyApi";
import { DeckCard, CreateDeckModal, DeckListEmptyState } from "./_components";
import { ButtonPrimary, FormInput } from "@/components/ui";
import { useDebounce } from "./_hooks";
import { buildVocabularyListSections } from "./_lib/buildListSections";

export default function VocabularySetPage() {
  const tl = useTranslations("vocabulary.list");
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const searchParamsApi = debouncedSearch || undefined;

  const setsQuery = useQuery({
    queryKey: [
      "vocabularySets",
      "list",
      "my-sets",
      { search: searchParamsApi },
    ],
    queryFn: () =>
      vocabularyApi.getSets({
        search: searchParamsApi,
        page: 1,
        limit: 50,
        vocabulary: "me",
      }),
  });

  const deckData = setsQuery.data;
  const isLoading = setsQuery.isLoading;
  const isError = setsQuery.isError;

  const listSections = useMemo(
    () => (deckData ? buildVocabularyListSections(deckData) : []),
    [deckData],
  );

  const mineTotal = deckData?.mine_total;
  const countSuffix = mineTotal !== undefined ? ` (${mineTotal})` : "";

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
                {tl("mySetTitle")}
                {countSuffix}
              </h1>
              <p className="text-neutral-500">{tl("mySetSubtitle")}</p>
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
                  {listSections.length > 1 && (
                    <div className="flex items-start gap-3">
                      <div
                        className="w-1 self-stretch min-h-10 rounded-full bg-primary-500 shrink-0"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <h2
                          id={`vocab-cat-${catId}`}
                          className="text-xl font-bold text-neutral-900 tracking-tight"
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
                  )}
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
            activeTab="my-sets"
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
