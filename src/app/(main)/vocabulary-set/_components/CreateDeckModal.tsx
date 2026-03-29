import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Globe, Loader2 } from "lucide-react";

interface CreateDeckModalProps {
  isOpen: boolean;
  isCreating: boolean; // can also be isSaving
  editingDeck?: { title: string; description?: string; is_public: boolean };
  onClose: () => void;
  onSave: (data: { title: string; description: string; is_public: boolean }) => void;
}

export function CreateDeckModal({
  isOpen,
  isCreating,
  editingDeck,
  onClose,
  onSave,
}: CreateDeckModalProps) {
  const tm = useTranslations("vocabulary.deckModal");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingDeck) {
        setTitle(editingDeck.title);
        setDescription(editingDeck.description || "");
        setIsPublic(editingDeck.is_public);
      } else {
        setTitle("");
        setDescription("");
        setIsPublic(false);
      }
    }
  }, [isOpen, editingDeck]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ title: title.trim(), description, is_public: isPublic });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {editingDeck ? tm("editTitle") : tm("createTitle")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tm("nameLabel")}
            </label>
            <input
              type="text"
              placeholder={tm("namePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tm("descriptionLabel")}
            </label>
            <textarea
              placeholder={tm("descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{tm("publicLabel")}</p>
                <p className="text-sm text-gray-500">{tm("publicHint")}</p>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isPublic ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isPublic ? "translate-x-7" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
            >
              {tm("cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim() || isCreating}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDeck ? tm("save") : tm("create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
