"use client";

import { useState, useEffect, useCallback } from "react";
import { Flashcard, FlashcardFormData } from "../types";
import { STORAGE_KEY } from "../constants";

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved cards:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage when cards change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isLoading]);

  const addCard = useCallback((formData: FlashcardFormData) => {
    if (!formData.word.trim() || !formData.definition.trim()) {
      return false;
    }

    const newCard: Flashcard = {
      id: Date.now().toString(),
      word: formData.word.trim(),
      phonetic: formData.phonetic || "",
      partOfSpeech: formData.partOfSpeech || "",
      definition: formData.definition.trim(),
      example: formData.example || "",
      vietnamese: formData.vietnamese || "",
      createdAt: Date.now(),
    };

    setCards((prev) => [newCard, ...prev]);
    return true;
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const updateCard = useCallback((id: string, formData: FlashcardFormData) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              ...formData,
              word: formData.word.trim(),
              definition: formData.definition.trim(),
            }
          : card,
      ),
    );
  }, []);

  return {
    cards,
    isLoading,
    addCard,
    deleteCard,
    updateCard,
  };
}
