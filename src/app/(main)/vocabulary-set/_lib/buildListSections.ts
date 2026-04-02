import type {
  SetCategoryBrief,
  SetListPayload,
  VocabularySet,
} from "@/types/vocabulary";

export type VocabularyListTabId = "my-sets" | "public";

export type VocabularyListSection = {
  category: SetCategoryBrief | null;
  sets: VocabularySet[];
  order: number;
};

function tabFilter(deck: VocabularySet, tab: VocabularyListTabId): boolean {
  if (tab === "my-sets") return deck.is_owner;
  /** Tab cộng đồng: mọi bộ công khai, kể cả của chính mình. */
  return deck.is_public;
}

/**
 * Gom bộ theo category cho UI (nhóm từ grouped_parents + standalone, hoặc flat).
 */
export function buildVocabularyListSections(
  payload: SetListPayload,
  tab: VocabularyListTabId,
): VocabularyListSection[] {
  const map = new Map<
    string,
    { category: SetCategoryBrief | null; sets: VocabularySet[]; order: number }
  >();

  const add = (category: SetCategoryBrief | null, set: VocabularySet) => {
    if (!tabFilter(set, tab)) return;
    const key = category?.id ?? "__none__";
    const order = category?.order ?? 999_999;
    const cur = map.get(key);
    if (!cur) {
      map.set(key, { category, sets: [set], order });
    } else {
      cur.sets.push(set);
    }
  };

  if (payload.mode === "grouped") {
    for (const g of payload.grouped_parents ?? []) {
      for (const s of g.sets) {
        add(g.category ?? null, s);
      }
    }
    for (const s of payload.standalone ?? []) {
      add(s.category ?? null, s);
    }
  } else {
    for (const s of payload.sets) {
      add(s.category ?? null, s);
    }
  }

  return Array.from(map.values())
    .filter((v) => v.sets.length > 0)
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return (a.category?.name ?? "").localeCompare(b.category?.name ?? "");
    });
}
