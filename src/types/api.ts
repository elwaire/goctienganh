/** Theo `docs/API_RESPONSE_FE_MIGRATION.md` — metadata cho API list phân trang */

export interface PageMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}
