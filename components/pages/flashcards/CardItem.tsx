import { Badge, ButtonIcon } from "@/components/ui";
import { speakWord } from "@/services/dictionary";
import { Flashcard } from "@/types";
import { Volume2, Trash2 } from "lucide-react";

type CardItemProps = {
  card: Flashcard;
  onDelete: (id: string) => void;
};

export function CardItem({ card, onDelete }: CardItemProps) {
  return (
    <div className="bg-white rounded-2xl cursor-pointer border border-neutral-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Word Header */}
          <div className="flex items-center gap-4 mb-1">
            <h3 className="font-semibold text-lg text-neutral-800">
              {card.word}
            </h3>
            {card.partOfSpeech && (
              <Badge rounded variant="primary">
                {card.partOfSpeech}
              </Badge>
            )}
            <ButtonIcon
              size="sm"
              icon={<Volume2 className="w-4 h-4" />}
              onClick={() => speakWord(card.word)}
              aria-label="Pronounce word"
              variant="ghost"
            />
          </div>

          {/* Phonetic */}
          {card.phonetic && (
            <p className="text-sm text-neutral-400 mb-2">{card.phonetic}</p>
          )}

          {/* Definition */}
          <p className="text-sm text-neutral-600 mb-2">{card.definition}</p>

          {/* Vietnamese */}
          {card.vietnamese && (
            <p className="text-sm text-blue-600">→ {card.vietnamese}</p>
          )}

          {/* Example */}
          {card.example && (
            <p className="text-sm text-neutral-400 italic mt-2">
              "{card.example}"
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-4">
          <ButtonIcon
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(card.id)}
            aria-label="Delete card"
            variant="danger"
          />
        </div>
      </div>
    </div>
  );
}
