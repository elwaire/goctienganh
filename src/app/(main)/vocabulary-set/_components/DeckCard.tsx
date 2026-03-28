import {
  BookOpen,
  Globe,
  Lock,
  Play,
  Edit,
  Trash2,
  Plus,
  Calendar,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import type { DeckResponse } from "@/types/flashcard";

interface DeckCardProps {
  deck: DeckResponse;
  onEdit?: (deck: DeckResponse) => void;
  onDelete?: (deckId: string) => void;
}

export function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
  const isOwner = deck.is_owner;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all p-6 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {deck.title}
          </h3>
          {deck.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {deck.description}
            </p>
          )}
        </div>
        <div className="ml-3">
          {deck.is_public ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
              <Globe className="w-3 h-3" />
              Public
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
              <Lock className="w-3 h-3" />
              Private
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">
            {deck.card_count} từ
          </span>
        </div>
        {deck.accuracy != null && deck.accuracy > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              {Math.round(deck.accuracy * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/vocabulary-set/${deck.id}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            <Play className="w-4 h-4" />
            Học ngay
          </button>
        </Link>

        {isOwner ? (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(deck)}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(deck.id)}
                className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        Tạo ngày {new Date(deck.created_at).toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
}
