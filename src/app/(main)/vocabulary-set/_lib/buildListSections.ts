import type {
  SetCategoryBrief,
  SetListPayload,
  VocabularySet,
} from "@/types/vocabulary";

export type VocabularyListSection = {
  category: SetCategoryBrief | null;
  sets: VocabularySet[];
  order: number;
};

/**
 * Gom bộ theo category cho UI (nhóm từ grouped_parents + standalone, hoặc flat).
 * Không lọc thêm — phạm vi đã do API (`vocabulary=me` | `public`) quyết định.
 */
export function buildVocabularyListSections(
  payload: SetListPayload,
): VocabularyListSection[] {
  const map = new Map<
    string,
    { category: SetCategoryBrief | null; sets: VocabularySet[]; order: number }
  >();

  const add = (category: SetCategoryBrief | null, set: VocabularySet) => {
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
