// hooks/useCollections.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Collection,
  CollectionFormData,
  Flashcard,
  FlashcardFormData,
} from "@/types";

const STORAGE_KEY = "learneng_collections";

// Helper để save localStorage
const saveToStorage = (collections: Collection[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
};

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCollections(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse collections:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Tạo collection mới
  const createCollection = useCallback(
    (data: CollectionFormData): Collection => {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: data.name.trim(),
        description: data.description?.trim(),
        color: data.color,
        cards: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setCollections((prev) => {
        const updated = [newCollection, ...prev];
        saveToStorage(updated); // Save ngay lập tức
        return updated;
      });

      return newCollection;
    },
    [],
  );

  // Cập nhật collection
  const updateCollection = useCallback(
    (id: string, data: Partial<CollectionFormData>) => {
      setCollections((prev) => {
        const updated = prev.map((col) =>
          col.id === id
            ? {
                ...col,
                ...data,
                name: data.name?.trim() || col.name,
                updatedAt: Date.now(),
              }
            : col,
        );
        saveToStorage(updated); // Save ngay lập tức
        return updated;
      });
    },
    [],
  );

  // Xóa collection
  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => {
      const updated = prev.filter((col) => col.id !== id);
      saveToStorage(updated); // Save ngay lập tức
      return updated;
    });
  }, []);

  // Lấy collection theo ID
  const getCollection = useCallback(
    (id: string): Collection | undefined => {
      return collections.find((col) => col.id === id);
    },
    [collections],
  );

  // Thêm card vào collection
  const addCard = useCallback(
    (collectionId: string, data: FlashcardFormData): boolean => {
      if (!data.word.trim() || !data.definition.trim()) return false;

      const newCard: Flashcard = {
        id: Date.now().toString(),
        word: data.word.trim(),
        phonetic: data.phonetic || "",
        partOfSpeech: data.partOfSpeech || "",
        definition: data.definition.trim(),
        example: data.example || "",
        vietnamese: data.vietnamese || "",
        createdAt: Date.now(),
      };

      setCollections((prev) => {
        const updated = prev.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                cards: [newCard, ...col.cards],
                updatedAt: Date.now(),
              }
            : col,
        );
        saveToStorage(updated); // Save ngay lập tức
        return updated;
      });

      return true;
    },
    [],
  );

  // Xóa card khỏi collection
  const deleteCard = useCallback((collectionId: string, cardId: string) => {
    setCollections((prev) => {
      const updated = prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              cards: col.cards.filter((card) => card.id !== cardId),
              updatedAt: Date.now(),
            }
          : col,
      );
      saveToStorage(updated); // Save ngay lập tức
      return updated;
    });
  }, []);

  // Cập nhật thời gian học gần nhất
  const updateLastStudied = useCallback((collectionId: string) => {
    setCollections((prev) => {
      const updated = prev.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              lastStudied: Date.now(),
              updatedAt: Date.now(),
            }
          : col,
      );
      saveToStorage(updated); // Save ngay lập tức
      return updated;
    });
  }, []);

  return {
    collections,
    isLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    getCollection,
    addCard,
    deleteCard,
    updateLastStudied,
  };
}
