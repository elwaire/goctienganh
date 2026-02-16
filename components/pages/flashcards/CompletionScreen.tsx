import { ButtonPrimary } from "@/components/ui";
import { useTranslation } from "@/context";
import { StudyStats } from "@/types";
import { Trophy } from "lucide-react";

type CompletionScreenProps = {
  stats: StudyStats;
  onStudyAgain: () => void;
  onBackToList: () => void;
};

export function CompletionScreen({
  stats,
  onStudyAgain,
  onBackToList,
}: CompletionScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex justify-center items-center bg-black/50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center ">
        {/* Trophy Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
          {t("flashcards.detailCollection.complete.title")}
        </h2>
        <p className="text-neutral-500 mb-8">
          {t("flashcards.detailCollection.complete.description")}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-50 rounded-2xl p-4">
            <div className="text-3xl font-bold text-emerald-600">
              {stats.known}
            </div>
            <div className="text-sm text-emerald-600">
              {t("flashcards.detailCollection.complete.mastered")}
            </div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4">
            <div className="text-3xl font-bold text-amber-600">
              {stats.learning}
            </div>
            <div className="text-sm text-amber-600">
              {t("flashcards.detailCollection.complete.learning")}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <ButtonPrimary onClick={onStudyAgain} className="w-full">
            {t("flashcards.detailCollection.complete.studyAgain")}
          </ButtonPrimary>
          <ButtonPrimary
            onClick={onBackToList}
            className="w-full"
            variant="outline"
          >
            {t("flashcards.detailCollection.complete.back")}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
