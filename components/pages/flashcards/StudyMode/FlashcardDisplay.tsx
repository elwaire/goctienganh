import { Badge, ButtonIcon } from "@/components/ui";
import { useTranslation } from "@/context";
import { Flashcard } from "@/types";
import { Lightbulb, Volume2 } from "lucide-react";

type FlashcardDisplayProps = {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: (word: string) => void;
};

interface CardFrontProps {
  card: Flashcard;
  onSpeak: (word: string) => void;
}

interface CardBackProps {
  card: Flashcard;
  onSpeak: (word: string) => void;
}

export default function FlashcardDisplay({
  card,
  isFlipped,
  onFlip,
  onSpeak,
}: FlashcardDisplayProps) {
  return (
    <div className="relative h-[400px]  cursor-pointer" onClick={onFlip}>
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <CardFront card={card} onSpeak={onSpeak} />

        {/* Back */}
        <CardBack card={card} onSpeak={onSpeak} />
      </div>
    </div>
  );
}

function CardFront({ card, onSpeak }: CardFrontProps) {
  const { t } = useTranslation();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSpeak(card.word);
  };

  return (
    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
      <div className="h-full bg-white rounded-3xl shadow-xs border border-slate-200 p-8 flex flex-col items-center justify-center">
        {card.partOfSpeech && (
          <Badge variant="primary" rounded className="mb-4">
            {card.partOfSpeech}
          </Badge>
        )}

        <h2 className="text-4xl font-bold text-neutral-800 mb-3">
          {card.word}
        </h2>

        {card.phonetic && (
          <button
            onClick={handleSpeak}
            className="flex items-center gap-2 text-neutral-400 hover:text-blue-500 transition-colors mb-6"
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-lg">{card.phonetic}</span>
          </button>
        )}

        <div className="flex items-center gap-2 text-neutral-400 mt-auto">
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm">
            {t("flashcards.detailCollection.card.tap")}
          </span>
        </div>
      </div>
    </div>
  );
}

function CardBack({ card, onSpeak }: CardBackProps) {
  const { t } = useTranslation();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSpeak(card.word);
  };

  return (
    <div
      className="absolute inset-0"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      <div className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl p-8 flex flex-col text-white">
        <div className="flex items-center justify-between mb-4">
          {card.partOfSpeech && (
            <Badge variant="primary" rounded>
              {card.partOfSpeech}
            </Badge>
          )}

          <ButtonIcon
            icon={<Volume2 />}
            onClick={handleSpeak}
            variant="secondary"
          />
        </div>

        <h2 className="text-3xl font-bold mb-2">{card.word}</h2>
        {card.vietnamese && (
          <p className="text-blue-100  mb-6">{card.vietnamese}</p>
        )}

        <div className="flex-1">
          <p className="text-white/90 mb-4">{card.definition}</p>

          {card.example && (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm text-blue-100 mb-1">
                {t("flashcards.detailCollection.card.example")}:
              </p>
              <p className="text-white italic">"{card.example}"</p>
            </div>
          )}
        </div>

        <p className="text-center text-blue-200 text-sm mt-4">
          {t("flashcards.detailCollection.card.howWell")}
        </p>
      </div>
    </div>
  );
}
