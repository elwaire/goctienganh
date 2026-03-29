import { useLocale, useTranslations } from "next-intl";
import { BookOpen, Globe, Lock, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import type { VocabularySet } from "@/types/vocabulary";

interface DeckCardProps {
  deck: VocabularySet;
  onEdit?: (deck: VocabularySet) => void;
  onDelete?: (deckId: string) => void;
}

export function DeckCard({ deck }: DeckCardProps) {
  const t = useTranslations("vocabulary.deckCard");
  const locale = useLocale();
  const dateStr = new Date(deck.created_at).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all p-4 group">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1  group-hover:text-blue-600 transition-colors ">
            {deck.title}
          </h3>
          <div className="ml-3 ">
            {deck.is_public ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium whitespace-nowrap">
                <Globe className="w-3 h-3" />
                {t("public")}
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium whitespace-nowrap">
                <Lock className="w-3 h-3" />
                {t("private")}
              </div>
            )}
          </div>
        </div>
        {deck.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {deck.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            {t("wordsCount", { count: deck.word_count })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/vocabulary-set/${deck.id}`} className="flex-1">
          <button className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 h-[40px] bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
            {t("viewDetail")}
          </button>
        </Link>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        {t("createdOn", { date: dateStr })}
      </div>
    </div>
  );
}
