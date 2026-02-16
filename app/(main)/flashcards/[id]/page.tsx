// app/flashcards/[id]/page.tsx

"use client";

import { use } from "react";
import { CollectionDetailPage } from "@/components/pages/flashcards";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const { id } = use(params);

  return <CollectionDetailPage collectionId={id} />;
}
