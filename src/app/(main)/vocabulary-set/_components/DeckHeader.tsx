import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Clock,
  MoreVertical,
  Globe,
  Lock,
  Edit,
  Trash2,
  Copy,
  Loader2,
  Plus,
} from "lucide-react";
import type { VocabularySetWithWords } from "@/types/vocabulary";

interface DeckHeaderProps {
  deck: VocabularySetWithWords;
  stats?: any; // Temporarily any until we have stats in new API
  /** Dòng phụ dưới mô tả (vd: số bài học trong bộ cha). */
  subtitle?: string;
  onEditDeck?: () => void;
  onDeleteDeck?: () => void;
  /** Bộ public của người khác — sao chép về tài khoản */
  onCopyToMyAccount?: () => void;
  copyLoading?: boolean;
  /** Chủ bộ — tạo bộ con (bộ có nhánh). */
  onCreateChild?: () => void;
  layout?: "default" | "sidebar";
}

export function DeckHeader({
  deck,
  stats: _stats,
  subtitle,
  onEditDeck,
  onDeleteDeck,
  onCopyToMyAccount,
  copyLoading,
  onCreateChild,
  layout = "default",
}: DeckHeaderProps) {
  const t = useTranslations("vocabulary");
  const tl = useTranslations("vocabulary.list");
  const locale = useLocale();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSidebar = layout === "sidebar";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={isSidebar ? "" : "mb-6"}>
      <div
        className={`bg-white rounded-2xl border-4 border-neutral-100 p-6 shadow-sm ${isSidebar ? "sticky top-4" : ""}`}
      >
        {/* Title & Meta */}
        <div
          className={`flex items-start justify-between ${isSidebar ? "flex-col gap-4 mb-6" : "mb-5"}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <h1
                className={`${isSidebar ? "text-xl" : "text-2xl"} font-bold text-neutral-800 leading-tight`}
              >
                {deck.title}
              </h1>
              {deck.is_public ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider font-bold rounded-lg border border-blue-100">
                  <Globe className="w-3 h-3" />
                  {t("visibility.public")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 text-neutral-600 text-[10px] uppercase tracking-wider font-bold rounded-lg border border-neutral-100">
                  <Lock className="w-3 h-3" />
                  {t("visibility.private")}
                </span>
              )}
            </div>
            {deck.description && (
              <p className="text-neutral-500 text-sm line-clamp-3 leading-relaxed">
                {deck.description}
              </p>
            )}
            {subtitle && (
              <p className="text-sm text-primary-600 font-medium mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            className={`flex items-center gap-2 ${isSidebar ? "w-full" : "ml-4 flex-shrink-0"}`}
          >
            {deck.is_owner && onCreateChild && (
              <button
                type="button"
                onClick={onCreateChild}
                className={`inline-flex items-center justify-center gap-2 h-10 px-4 cursor-pointer rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-sm font-semibold text-neutral-700 transition-all flex-1`}
              >
                <Plus className="w-4 h-4" />
                {tl("createChild")}
              </button>
            )}
            {!deck.is_owner && deck.is_public && onCopyToMyAccount && (
              <button
                type="button"
                onClick={onCopyToMyAccount}
                disabled={copyLoading}
                className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-all shadow-md shadow-blue-200/50 flex-1"
              >
                {copyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {t("copyToAccount")}
              </button>
            )}
            {deck.is_owner && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`h-10 w-10 rounded-lg cursor-pointer justify-center items-center flex transition-all border border-neutral-200 ${
                    showDropdown
                      ? "bg-neutral-100"
                      : "bg-white hover:bg-neutral-50"
                  }`}
                >
                  <MoreVertical className="w-4 h-4 text-neutral-600" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-20 p-1.5 animate-in fade-in zoom-in duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        onEditDeck?.();
                      }}
                      className="w-full text-left px-3  py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Edit className="w-3.5 h-3.5" />
                      </div>
                      {t("card.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDropdown(false);
                        onDeleteDeck?.();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer mt-0.5"
                    >
                      <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </div>
                      {t("card.delete")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className={`grid ${isSidebar ? "grid-cols-1 " : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"} gap-4`}
        >
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-blue-500" />}
            value={deck.word_count}
            label={t("detail.words")}
            bgColor="bg-blue-50/50"
            borderColor="border-blue-100"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-purple-500" />}
            value={new Date(deck.created_at).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-US",
            )}
            label={t("card.createdOn")}
            bgColor="bg-purple-50/50"
            borderColor="border-purple-100"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className={`${bgColor} border-2 ${borderColor} rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-sm`}
    >
      <div className="p-2.5 bg-white rounded-lg border border-inherit">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-semibold text-neutral-800 truncate leading-none">
          {value}
        </p>
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}
