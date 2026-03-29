"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight, FileText } from "lucide-react";
import type { VocabularySet } from "@/types/vocabulary";

interface ChildSetGridProps {
  sets: VocabularySet[];
  isLoading?: boolean;
}

/** Lưới bộ con — cùng ngôn ngữ hình với ExamCard (neutral + hover). */
export function ChildSetGrid({
  sets,
  isLoading,
}: ChildSetGridProps) {
  const tc = useTranslations("vocabulary.deckCard");

  if (isLoading && sets.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-neutral-100 bg-white animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (sets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      {sets.map((s) => {
        return (
          <div
            key={s.id}
            className="group relative bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl pointer-events-none" />

            <Link
              href={`/vocabulary-set/${s.id}`}
              className="block p-4 pb-3 flex-1 min-h-0"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-neutral-800 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                    {s.title}
                  </h3>
                  {s.description && (
                    <p className="text-sm text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-neutral-50 mt-auto">
              <span className="text-sm font-semibold text-neutral-600">
                {tc("wordsCount", { count: s.word_count })}
              </span>
              <Link
                href={`/vocabulary-set/${s.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {tc("viewDetail")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
