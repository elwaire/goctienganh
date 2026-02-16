"use client";

import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCollections } from "@/hooks";
import { Collection, CollectionFormData } from "@/types";
import { CollectionCard, CollectionForm } from "@/components/pages/flashcards";
import { Loading, TitleScreen } from "@/components/common";
import { Badge, ButtonPrimary, EmptyState } from "@/components/ui";
import { useTranslation } from "@/context";

export default function FlashcardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollections();

  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );

  // Handlers
  const handleCreate = (data: CollectionFormData) => {
    createCollection(data);
    setShowForm(false);
  };

  const handleUpdate = (data: CollectionFormData) => {
    if (editingCollection) {
      updateCollection(editingCollection.id, data);
      setEditingCollection(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t("flashcards.collections.action.deleteConfirm"))) {
      deleteCollection(id);
    }
  };

  const handleOpen = (id: string) => {
    router.push(`/flashcards/${id}`);
  };

  const handleStudy = (id: string) => {
    router.push(`/flashcards/${id}?mode=study`);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCollection(null);
  };

  // Loading
  if (isLoading) {
    return <Loading variants="full" />;
  }

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <TitleScreen title={t("flashcards.collections.title")} />
          <Badge variant="primary" rounded>
            {collections.length} {t("flashcards.collections.badge")}
          </Badge>
        </div>

        <ButtonPrimary
          onClick={() => setShowForm(true)}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          {t("flashcards.collections.addCollection")}
        </ButtonPrimary>
      </div>

      {/* Empty State */}
      {collections.length === 0 && (
        <EmptyState
          onClick={() => setShowForm(true)}
          icon={<FolderOpen className="w-10 h-10 text-blue-500" />}
          title={t("flashcards.collections.emptyState.title")}
          description={t("flashcards.collections.emptyState.description")}
          buttonText={t("flashcards.collections.emptyState.button")}
        />
      )}

      {/* Collections Grid */}
      {collections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onOpen={handleOpen}
              onStudy={handleStudy}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CollectionForm
          collection={editingCollection}
          onSave={editingCollection ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
