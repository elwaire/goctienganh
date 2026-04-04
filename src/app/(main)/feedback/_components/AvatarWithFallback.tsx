"use client";

import { useState } from "react";
import type { AuthorInfo } from "@/types/feedback";

interface AvatarWithFallbackProps {
  author: AuthorInfo;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
};

export function AvatarWithFallback({
  author,
  size = "md",
}: AvatarWithFallbackProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const avatarUrl = author.avatar?.trim();
  const showImg = Boolean(avatarUrl) && !imgFailed;
  const initial = (author.fullname || author.username || "?")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const cls = `${sizeMap[size]} shrink-0 rounded-full object-cover`;

  if (showImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className={`${cls} ring-2 ring-white shadow-sm`}
        onError={() => setImgFailed(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${cls} flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 font-semibold text-white ring-2 ring-white shadow-sm`}
      aria-hidden
    >
      {initial}
    </div>
  );
}
