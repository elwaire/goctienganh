import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  MoreVertical,
  Globe,
  Lock,
  Edit,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  VocabularySetWithWords,
} from "@/types/vocabulary";


interface DeckHeaderProps {
  deck: VocabularySetWithWords;
  stats?: any; // Temporarily any until we have stats in new API
  onEditDeck?: () => void;
  onDeleteDeck?: () => void;
  /** Bộ public của người khác — sao chép về tài khoản */
  onCopyToMyAccount?: () => void;
  copyLoading?: boolean;
}

export function DeckHeader({
  deck,
  stats,
  onEditDeck,
  onDeleteDeck,
  onCopyToMyAccount,
  copyLoading,
}: DeckHeaderProps) {
  const t = useTranslations("vocabulary");
  const locale = useLocale();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const progress = stats ? Math.round(stats.progress * 100) : 0;
  const accuracy = stats ? Math.round(stats.accuracy * 100) : 0;

  return (
    <div className="mb-6">
      <button
        onClick={() => router.push("/vocabulary-set")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">{t("back")}</span>
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Title & Meta */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
              {deck.is_public ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  <Globe className="w-3 h-3" />
                  {t("visibility.public")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  <Lock className="w-3 h-3" />
                  {t("visibility.private")}
                </span>
              )}
            </div>
            {deck.description && (
              <p className="text-gray-600 text-sm">{deck.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {!deck.is_owner && deck.is_public && onCopyToMyAccount && (
              <button
                type="button"
                onClick={onCopyToMyAccount}
                disabled={copyLoading}
                className="inline-flex items-center gap-2 h-[44px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
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
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`h-[44px] w-[44px] rounded-full justify-center items-center flex transition-colors ${
                    showDropdown ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <MoreVertical className="w-4 h-4 text-gray-700" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onEditDeck?.();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      {t("card.edit")}
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onDeleteDeck?.();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("card.delete")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-blue-600" />}
            value={deck.words.length}
            label={t("detail.words")}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-purple-600" />}
            value={new Date(deck.created_at).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-US",
            )}
            label={t("card.createdOn")}
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
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
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
          <p className="text-xs text-gray-600 truncate">{label}</p>
        </div>
      </div>
    </div>
  );
}
