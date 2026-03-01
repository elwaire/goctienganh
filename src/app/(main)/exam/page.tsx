// app/(main)/exam/page.tsx

"use client";

import { ExamCard, StatsCard } from "@/components/pages/exam";
import { EmptyState, Error, FormInput, Loading } from "@/components/ui";
import { examsApi } from "@/api/examsApi";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Loader2, Search, AlertCircle, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

const LIMIT = 12;
const SEARCH_DEBOUNCE_MS = 400;

export default function ExamPage() {
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
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Luyện thi</h1>
        <p className="text-neutral-500">
          Kiểm tra và nâng cao kiến thức của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCard />

      {/* Search */}
      <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <FormInput
            type="text"
            placeholder="Tìm kiếm bài thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-neutral-400" />}
            rounded
          />
        </div>

        {/* Total count */}
        {!isLoading && !isError && (
          <div className="flex  items-center text-sm text-neutral-500">
            {total} bộ đề
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && <Loading message="Đang tải bộ đề..." />}

      {/* Error */}
      {isError && (
        <Error message="Không thể tải danh sách bộ đề. Vui lòng thử lại." />
      )}

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
          title={searchQuery ? "Không tìm thấy bài thi" : "Chưa có bộ đề nào"}
          description={
            searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Hiện chưa có bộ đề nào cho môn học này"
          }
          buttonText={searchQuery ? "Xóa tìm kiếm" : undefined}
          onClick={searchQuery ? () => setSearchQuery("") : undefined}
          icon={
            searchQuery ? (
              <Search className="w-4 h-4" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )
          }
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
            Trước
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
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
