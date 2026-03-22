// app/(main)/exam/page.tsx

"use client";

import { examsApi } from "@/api/examsApi";
import { ExamCard } from "@/components/pages/exam";
import { EmptyState, Error, FormInput, Loading } from "@/components/ui";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const LIMIT = 12;
const SEARCH_DEBOUNCE_MS = 400;

export default function ExamPage() {
  const t = useTranslations("exam.page");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const subjectId = Cookies.get("x-subject-id") || "";

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch exams from API
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.exams.list({
      page,
      limit: LIMIT,
      subject_id: subjectId,
      search: debouncedSearch || undefined,
    }),
    queryFn: () =>
      examsApi.getAll({
        page,
        limit: LIMIT,
        subject_id: subjectId || undefined,
        search: debouncedSearch || undefined,
      }),
  });

  const examSets = data?.exam_sets ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          {t("title")}
        </h1>
        <p className="text-neutral-500">{t("description")}</p>
      </div>

      {/* Search */}
      <div className="flex flex-col items-start gap-2 mb-6">
        <FormInput
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-5 h-5 text-neutral-400 " />}
          className="w-full max-w-lg"
        />
        {/* Total count */}
        {!isLoading && !isError && (
          <div className="flex  items-center text-sm text-neutral-500">
            {total} {t("totalCount")}
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && <Loading message={t("loading")} />}

      {/* Error */}
      {isError && <Error message={t("error")} />}

      {/* Exam Grid */}
      {!isLoading && !isError && examSets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {examSets.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && examSets.length === 0 && (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          image="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-eP5KQCJDDuVeP72aHPCoeYD7Z9qWzZ.png&w=1000&q=75"
        />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t("previous")}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 text-sm font-medium rounded-xl transition-colors ${
                p === page
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-200"
                  : "border border-neutral-200 hover:bg-neutral-50 text-neutral-600"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}
