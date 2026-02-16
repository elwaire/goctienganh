"use client";

import {
  ButtonPrimary,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui";
import { PART_OF_SPEECH_OPTIONS } from "@/constants";
import { useTranslation } from "@/context";
import { FlashcardFormData } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

type AddCardFormProps = {
  onAdd: (data: FlashcardFormData) => boolean;
  onCancel: () => void;
};

const INITIAL_FORM_DATA: FlashcardFormData = {
  word: "",
  phonetic: "",
  partOfSpeech: "",
  definition: "",
  example: "",
  vietnamese: "",
};

export function AddCardForm({ onAdd, onCancel }: AddCardFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] =
    useState<FlashcardFormData>(INITIAL_FORM_DATA);

  const handleSubmit = () => {
    const success = onAdd(formData);
    if (success) {
      setFormData(INITIAL_FORM_DATA);
      onCancel();
    }
  };

  const updateField = (field: keyof FlashcardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = formData.word.trim() && formData.definition.trim();

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col gap-4 shadow-sm border border-neutral-200 p-6 mb-6">
        <h3 className="font-semibold text-lg text-neutral-800">
          {t("flashcards.detailCollection.addCard.title")}
        </h3>

        {/* Form Fields */}
        <div className="flex gap-4">
          <FormInput
            label={t("flashcards.detailCollection.addCard.word")}
            required
            value={formData.word}
            onChange={(v) => updateField("word", v)}
            className="w-full"
          />
          <FormInput
            label={t("flashcards.detailCollection.addCard.phonetic")}
            value={formData.phonetic}
            onChange={(v) => updateField("phonetic", v)}
            placeholder="/ˈeksəmpəl/"
            className="w-full"
          />
        </div>

        <FormSelect
          label={t("flashcards.detailCollection.addCard.partOfSpeech")}
          value={formData.partOfSpeech}
          onChange={(v) => updateField("partOfSpeech", v)}
          options={PART_OF_SPEECH_OPTIONS}
        />
        <FormInput
          label={t("flashcards.detailCollection.addCard.meaning")}
          value={formData.vietnamese}
          onChange={(v) => updateField("vietnamese", v)}
          placeholder={t(
            "flashcards.detailCollection.addCard.meaningPlaceholder",
          )}
        />

        <FormTextarea
          label={t("flashcards.detailCollection.addCard.definition")}
          required
          value={formData.definition}
          onChange={(v) => updateField("definition", v)}
        />

        <FormInput
          label={t("flashcards.detailCollection.addCard.example")}
          value={formData.example}
          onChange={(v) => updateField("example", v)}
          placeholder={t(
            "flashcards.detailCollection.addCard.examplePlaceholder",
          )}
          className="mb-6"
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <ButtonPrimary onClick={onCancel} variant="gray" className="w-full">
            {t("flashcards.detailCollection.addCard.cancel")}
          </ButtonPrimary>
          <ButtonPrimary
            onClick={handleSubmit}
            disabled={!isValid}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full"
          >
            {t("flashcards.detailCollection.addCard.add")}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
