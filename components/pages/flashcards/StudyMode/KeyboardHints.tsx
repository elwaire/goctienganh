import { useTranslation } from "@/context";

type KeyboardHint = {
  keys: string[];
  label: string;
};

type KeyboardHintsProps = {
  isFlipped: boolean;
};

export default function KeyboardHints({ isFlipped }: KeyboardHintsProps) {
  const { t } = useTranslation();

  const baseHints: KeyboardHint[] = [
    {
      keys: ["Space"],
      label: t("flashcards.detailCollection.card.keyboardHint.flip"),
    },
    {
      keys: ["←", "→"],
      label: t("flashcards.detailCollection.card.keyboardHint.navigate"),
    },
  ];

  const flippedHints: KeyboardHint[] = [
    {
      keys: ["1"],
      label: t("flashcards.detailCollection.card.keyboardHint.gotIt"),
    },
    {
      keys: ["2"],
      label: t("flashcards.detailCollection.card.keyboardHint.learning"),
    },
  ];

  const hints = isFlipped ? [...baseHints, ...flippedHints] : baseHints;

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="inline-flex items-center gap-1 px-2 py-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-100">
        {hints.map((hint, index) => (
          <div key={hint.label} className="flex items-center">
            {/* Divider */}
            {index > 0 && <div className="w-px h-4 bg-neutral-200 mx-3" />}

            {/* Hint Item */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {hint.keys.map((key) => (
                  <kbd
                    key={key}
                    className="
                      inline-flex items-center justify-center
                      min-w-[28px] h-7 px-2
                      bg-neutral-100 text-neutral-600
                      text-xs font-medium
                      rounded-lg border border-neutral-200
                      shadow-[0_2px_0_0_rgba(0,0,0,0.05)]
                    "
                  >
                    {key}
                  </kbd>
                ))}
              </div>
              <span className="text-sm text-neutral-500">{hint.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
