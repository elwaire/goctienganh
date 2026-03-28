import { Volume2, Edit, Trash2, Check } from "lucide-react";
import type { CardResponse } from "@/types/flashcard";

interface WordCardProps {
  card: CardResponse;
  isOwner: boolean;
  onEdit: (card: CardResponse) => void;
  onDelete: (cardId: string) => void;
  onSpeak: (text: string) => void;
}

export function WordCard({
  card,
  isOwner,
  onEdit,
  onDelete,
  onSpeak,
}: WordCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">{card.term}</h3>
            {card.phonetic && (
              <span className="text-gray-500 italic text-sm">
                /{card.phonetic}/
              </span>
            )}
            <button
              onClick={() => onSpeak(card.term)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
            </button>
            {card.word_type && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                {card.word_type}
              </span>
            )}
          </div>

          <p className="text-gray-900 font-medium mb-2 text-sm">
            {card.definition}
          </p>

          {card.example_sentence && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-gray-700 text-sm mb-1">
                &quot;{card.example_sentence}&quot;
              </p>
              {card.example_translation && (
                <p className="text-xs text-gray-600">
                  {card.example_translation}
                </p>
              )}
            </div>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(card)}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
