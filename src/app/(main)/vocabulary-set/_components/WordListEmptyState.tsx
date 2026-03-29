import { useTranslations } from "next-intl";
import { Search, Plus, BookOpen } from "lucide-react";

interface WordListEmptyStateProps {
  searchQuery: string;
  onAddWord: () => void;
}

export function WordListEmptyState({
  searchQuery,
  onAddWord,
}: WordListEmptyStateProps) {
  const t = useTranslations("vocabulary.detail");
  const tForm = useTranslations("vocabulary.form");

  if (searchQuery) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("noResults")}
        </h3>
        <p className="text-gray-600 text-sm">{t("searchWait") || "Try another keyword"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {t("noWords") || "No vocabulary yet"}
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        {t("noWordsDesc") || "Start building your vocabulary by adding your first word!"}
      </p>
      <button
        onClick={onAddWord}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
      >
        <Plus className="w-5 h-5" />
        {t("addWord")}
      </button>
    </div>

  );
}
