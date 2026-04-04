"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { MessageSquarePlus, PenSquare } from "lucide-react";
import type { RootState } from "@/store";
import { FeedbackFeed, FeedbackDetailModal, PostComposerModal } from "./_components";
import { useFeedbackFeed } from "./_hooks";

function UnauthenticatedView() {
  const t = useTranslations("feedback");
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center gap-5">
      <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center">
        <MessageSquarePlus className="h-8 w-8 text-blue-600" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-slate-900">{t("loginTitle")}</h1>
        <p className="text-sm text-slate-500 max-w-xs">{t("loginDescription")}</p>
      </div>
      <Link
        href="/login"
        className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {t("loginBtn")}
      </Link>
    </div>
  );
}

export default function FeedbackPage() {
  const t = useTranslations("feedback");
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const feedProps = useFeedbackFeed(isAuthenticated);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const handlePostClick = useCallback((id: string) => setSelectedPostId(id), []);
  const handleCloseDetail = useCallback(() => setSelectedPostId(null), []);
  const handleCloseComposer = useCallback(() => setComposerOpen(false), []);

  if (!isAuthenticated) return <UnauthenticatedView />;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 space-y-4">

        {/* Page header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <MessageSquarePlus className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                {t("pageTitle")}
              </h1>
              <p className="text-xs text-slate-500">{t("pageSubtitle")}</p>
            </div>
          </div>

          {/* New Post button */}
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <PenSquare className="h-3.5 w-3.5" />
            {t("newPostBtn")}
          </button>
        </div>

        {/* Feed */}
        <FeedbackFeed {...feedProps} onPostClick={handlePostClick} />
      </div>

      {/* Detail modal */}
      {selectedPostId && (
        <FeedbackDetailModal postId={selectedPostId} onClose={handleCloseDetail} />
      )}

      {/* Composer modal */}
      {composerOpen && (
        <PostComposerModal onClose={handleCloseComposer} />
      )}
    </div>
  );
}
