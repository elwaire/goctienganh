import { useLocale, useTranslations } from "next-intl";
import {
  BookOpen,
  Globe,
  Lock,
  Eye,
  Calendar,
  FolderOpen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { VocabularySet } from "@/types/vocabulary";

interface DeckCardProps {
  deck: VocabularySet;
  onEdit?: (deck: VocabularySet) => void;
  onDelete?: (deckId: string) => void;
}

export function DeckCard({ deck, onDelete }: DeckCardProps) {
  const t = useTranslations("vocabulary.deckCard");
  const tc = useTranslations("vocabulary.card");
  const locale = useLocale();
  const dateStr = new Date(deck.created_at).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
  );

  const childCount = deck.child_count ?? 0;
  const hasChildren = childCount > 0;

  return (
    <Link
      href={`/vocabulary-set/${deck.id}`}
      className="group relative bg-white rounded-2xl border-4 border-primary-100 p-4 hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl" />

      <div className="flex flex-col mb-4 relative">
        <div className="flex items-center flex-col justify-between mb-1 gap-2">
          <div className="flex  items-center gap-1 w-full justify-between shrink-0">
            {deck.is_public ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium whitespace-nowrap ring-1 ring-inset ring-emerald-100">
                <Globe className="w-3 h-3" />
                {t("public")}
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-medium whitespace-nowrap">
                <Lock className="w-3 h-3" />
                {t("private")}
              </div>
            )}
            {deck.is_owner && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(deck.id);
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label={tc("delete")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <h3 className="font-bold text-lg text-neutral-800  w-full  group-hover:text-primary-600 transition-colors">
            {deck.title}
          </h3>
        </div>
        {deck.description && (
          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {deck.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-neutral-50 relative">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-sm font-semibold text-neutral-700">
            {t("wordsCount", { count: deck.word_count })}
          </span>
        </div>
        {hasChildren && (
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <FolderOpen className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-neutral-700">
              {t("sectionsCount", { count: childCount })}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500 relative">
        <Calendar className="w-3 h-3" />
        {t("createdOn", { date: dateStr })}
      </div>
    </Link>
  );
}
