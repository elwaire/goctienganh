import type { PageMeta } from "@/types/api";

type EnvelopeData = {
  data?: unknown;
  metadata?: unknown;
};

function isPageMeta(m: unknown): m is PageMeta {
  if (typeof m !== "object" || m === null) return false;
  const o = m as Record<string, unknown>;
  return (
    typeof o.page === "number" &&
    typeof o.limit === "number" &&
    typeof o.total_items === "number" &&
    typeof o.total_pages === "number"
  );
}

/** Đọc `data` (mảng) + `metadata` (PageMeta) từ envelope chuẩn sau khi unwrap axios `response.data`. */
export function readPagedBody<T>(envelope: EnvelopeData): {
  rows: T[];
  meta?: PageMeta;
} {
  const raw = envelope.data;
  const rows = Array.isArray(raw) ? (raw as T[]) : [];
  const meta = isPageMeta(envelope.metadata) ? envelope.metadata : undefined;
  return { rows, meta };
}
