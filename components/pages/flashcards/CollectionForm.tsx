// components/pages/flashcards/CollectionForm.tsx

"use client";

import { ButtonPrimary, FormInput, FormTextarea } from "@/components/ui";
import { COLLECTION_COLORS, COLOR_OPTIONS } from "@/constants";
import { useTranslation } from "@/context";
import { Collection, CollectionColor, CollectionFormData } from "@/types";
import { useEffect, useState } from "react";

type CollectionFormProps = {
  collection?: Collection | null;
  onSave: (data: CollectionFormData) => void;
  onClose: () => void;
};

export function CollectionForm({
  collection,
  onSave,
  onClose,
}: CollectionFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<CollectionColor>("blue");

  const { t } = useTranslation();

  const isEditing = !!collection;

  // Khởi tạo form data
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setDescription(collection.description || "");
      setColor(collection.color);
    }
    // Trigger animation
    setTimeout(() => setIsVisible(true), 50);
  }, [collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });

    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-colors duration-200
        ${isVisible ? "bg-black/50" : "bg-transparent"}
      `}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md bg-white rounded-2xl shadow-xl
          transition-all duration-300
          ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-800">
            {isEditing
              ? t("flashcards.collections.formAdd.titleEdit")
              : t("flashcards.collections.formAdd.title")}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <FormInput
            label={t("flashcards.collections.formAdd.name")}
            placeholder={t("flashcards.collections.formAdd.namePlaceholder")}
            value={name}
            onChange={setName}
            required
            type="text"
            autoFocus
          />

          {/* Description */}
          <FormTextarea
            label={t("flashcards.collections.formAdd.description")}
            placeholder={t(
              "flashcards.collections.formAdd.descriptionPlaceholder",
            )}
            value={description}
            onChange={setDescription}
            rows={3}
          />

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t("flashcards.collections.formAdd.color")}
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => {
                const colors = COLLECTION_COLORS[c];
                const isSelected = color === c;

                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`
                      w-10 h-10 rounded-lg cursor-pointer transition-all
                      ${colors.bg}
                      ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-neutral-400"
                          : "hover:ring-2 hover:ring-offset-2 hover:ring-neutral-400"
                      }
                    `}
                  />
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <ButtonPrimary
              onClick={handleClose}
              variant="gray"
              className="w-full"
            >
              {t("flashcards.collections.formAdd.cancel")}
            </ButtonPrimary>

            <ButtonPrimary
              disabled={!name.trim()}
              type="submit"
              className="w-full"
            >
              {isEditing
                ? t("flashcards.collections.formAdd.saveChange")
                : t("flashcards.collections.formAdd.saveNew")}
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
}
