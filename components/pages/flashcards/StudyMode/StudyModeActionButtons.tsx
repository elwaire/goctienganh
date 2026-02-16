import { ButtonIcon, ButtonPrimary } from "@/components/ui";
import { useTranslation } from "@/context";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

type ActionButtonsProps = {
  isFlipped: boolean;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onFlip: () => void;
  onKnown: () => void;
  onLearning: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function StudyModeActionButtons({
  isFlipped,
  canGoPrevious,
  canGoNext,
  onFlip,
  onKnown,
  onLearning,
  onNext,
  onPrevious,
}: ActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <ButtonIcon
        icon={<ChevronLeft className="w-5 h-5 text-neutral-600" />}
        onClick={onPrevious}
        disabled={!canGoPrevious}
      />

      {isFlipped ? (
        <>
          <ButtonPrimary
            onClick={onLearning}
            variant="danger"
            leftIcon={<X className="w-5 h-5" />}
          >
            <span>{t("flashcards.detailCollection.card.action.learning")}</span>
          </ButtonPrimary>
          <ButtonPrimary
            onClick={onKnown}
            variant="success"
            leftIcon={<Check className="w-5 h-5" />}
          >
            <span>{t("flashcards.detailCollection.card.action.gotIt")}</span>
          </ButtonPrimary>
        </>
      ) : (
        <ButtonPrimary onClick={onFlip}>
          {t("flashcards.detailCollection.card.action.showAnswer")}
        </ButtonPrimary>
      )}

      <ButtonIcon
        icon={<ChevronRight className="w-5 h-5 text-neutral-600" />}
        onClick={onNext}
        disabled={!canGoNext}
      />
    </div>
  );
}
