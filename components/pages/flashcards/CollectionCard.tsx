// components/pages/flashcards/CollectionCard.tsx

"use client";

import { ButtonPrimary } from "@/components/ui";
import { COLLECTION_COLORS } from "@/constants";
import { useTranslation } from "@/context";
import { Collection } from "@/types";
import {
  BookOpen,
  Clock,
  Edit,
  MoreHorizontal,
  Play,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CollectionCardProps = {
  collection: Collection;
  onOpen: (id: string) => void;
  onStudy: (id: string) => void;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
};

export function CollectionCard({
  collection,
  onOpen,
  onStudy,
  onEdit,
  onDelete,
}: CollectionCardProps) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const colors = COLLECTION_COLORS[collection.color];
  const cardCount = collection.cards.length;

  // Format thời gian học gần nhất
  const formatLastStudied = (timestamp?: number) => {
    if (!timestamp) return t("flashcards.collections.card.time.notStudied");

    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t("flashcards.collections.card.time.today");
    if (days === 1) return t("flashcards.collections.card.time.yesterday");
    if (days < 7)
      return t("flashcards.collections.card.time.daysAgo", { days });
    if (days < 30)
      return t("flashcards.collections.card.time.weeksAgo", {
        weeks: Math.floor(days / 7),
      });
    return t("flashcards.collections.card.time.monthsAgo", {
      months: Math.floor(days / 30),
    });
  };

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative group flex flex-col bg-white rounded-2xl border border-neutral-200 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 overflow-hidden">
      {/* Banner */}
      <div className="w-full h-30 relative flex justify-end items-start p-2">
        <img
          className="w-full absolute top-0 left-0 h-full object-cover"
          src={
            collection.color === "blue"
              ? "https://i.pinimg.com/736x/03/07/7f/03077f7da17d2522b339bebba69e0010.jpg"
              : collection.color === "emerald"
                ? "https://i.pinimg.com/736x/a9/ba/48/a9ba4832d583f07c033886e598080b7f.jpg"
                : collection.color === "purple"
                  ? "https://i.pinimg.com/736x/c9/4e/cf/c94ecf520e900cbc48a4c59837b79940.jpg"
                  : collection.color === "rose"
                    ? "https://i.pinimg.com/1200x/73/5e/61/735e612f5e8a2c2e0b0a0b6f2d9f46a4.jpg"
                    : collection.color === "amber"
                      ? "https://i.pinimg.com/736x/ee/60/99/ee609910df3e9460046578a069eec075.jpg"
                      : collection.color === "cyan"
                        ? "https://i.pinimg.com/736x/2e/0d/04/2e0d04ec6b46412e033942c1948d68b6.jpg"
                        : "https://i.pinimg.com/736x/2c/a1/2f/2ca12fd9dd5ea5653cc788e840458f08.jpg"
          }
          alt="Banner"
        />

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className=" p-2 cursor-pointer bg-black/50 hover:bg-black/70 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden bg-white border border-neutral-200 rounded-xl shadow-lg z-10">
              <button
                onClick={() => {
                  onEdit(collection);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                <Edit className="w-4 h-4" />
                {t("flashcards.collections.card.time.edit")}
              </button>
              <button
                onClick={() => {
                  onDelete(collection.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
                {t("flashcards.collections.card.time.delete")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4  flex-1 flex flex-col">
        {/* Header */}
        <div className=" flex-1">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bgLight}`}
            >
              <BookOpen className={`w-6 h-6 ${colors.text}`} />
            </div>
          </div>

          {/* Title & Description */}
          <h3
            onClick={() => onOpen(collection.id)}
            className="font-semibold text-lg text-neutral-800 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
          >
            {collection.name}
          </h3>

          {collection.description && (
            <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
              {collection.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
            <span className={`font-medium ${colors.text}`}>{cardCount} từ</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatLastStudied(collection.lastStudied)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ButtonPrimary
            onClick={() => onOpen(collection.id)}
            variant="gray"
            className="flex-1"
          >
            {t("flashcards.collections.card.time.view")}
          </ButtonPrimary>
          <ButtonPrimary
            onClick={() => onStudy(collection.id)}
            disabled={cardCount === 0}
            className={` flex-1`}
            leftIcon={<Play className="w-4 h-4" />}
          >
            {t("flashcards.collections.card.time.study")}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
