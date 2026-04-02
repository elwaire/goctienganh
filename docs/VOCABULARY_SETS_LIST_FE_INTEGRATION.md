# Tích hợp FE: `GET /api/v1/vocabulary-sets` (danh sách bộ từ)

Tài liệu mô tả **thay đổi breaking** và **hợp đồng response mới** cho endpoint danh sách bộ từ của user (cần JWT). Dùng để cập nhật client (query, parse `data`, UI nhóm theo category).

**Tham chiếu envelope & phân trang:** [API_RESPONSE_FE_MIGRATION.md](./API_RESPONSE_FE_MIGRATION.md) (`data`, `metadata.page`, `metadata.total_items`, …).

---

## 1. Query bắt buộc: `vocabulary` (chọn một trong hai loại)

Mọi request **`GET /vocabulary-sets`** phải kèm **`vocabulary`** — giá trị **chuỗi** (không phân biệt hoa thường):

| Giá trị | Ý nghĩa | Filter DB (tóm tắt) |
|---------|---------|---------------------|
| `me` | Chỉ bộ **của user đang đăng nhập** | `user_id = <current>` |
| `public` | Chỉ bộ **công khai** | `is_public = true` |

**Validation**

- Thiếu `vocabulary` hoặc giá trị không phải `me` / `public` → **400** — `"query param vocabulary is required (me|public)"`.

**Hai màn / hai tab:** FE chọn loại list bằng cách đổi `vocabulary` (ví dụ tab “Của tôi” → `me`, tab “Cộng đồng” → `public`). **Mỗi response** (dù đang gọi `me` hay `public`) đều kèm trong `metadata` hai số đếm tổng để hiển thị badge trên tab — xem mục 1.1.

### 1.1. Thống kê tab: `mine_total` và `public_total`

Trong **`metadata`** của mọi response `GET /vocabulary-sets` thành công có thêm:

| Field | Kiểu | Ý nghĩa |
|-------|------|---------|
| `mine_total` | `int64` | Tổng số bộ thỏa **`user_id` = user đang đăng nhập** (toàn bộ phạm vi đếm, không bị giới hạn bởi trang hiện tại). |
| `public_total` | `int64` | Tổng số bộ thỏa **`is_public = true`** (cùng ý nghĩa phạm vi như trên). |

**Phạm vi đếm (quan trọng cho FE):**

- Cùng **cấu trúc cây** với list: mặc định chỉ đếm **bộ gốc** (`parent_id` null); có `parent_id` thì đếm **con trực tiếp** của bộ đó; `flat=true` thì đếm **mọi** bộ (không giới hạn tầng).
- **Không** áp `search`, `subject_id`, `category_id` lên hai tổng này — số trên tab **ổn định** khi user gõ search hoặc lọc môn/category trên list.
- `metadata.total_items` vẫn là tổng số bản ghi **của list hiện tại** (có áp search / subject / category / `vocabulary`), dùng cho phân trang list.

Các field phân trang chuẩn (`page`, `limit`, `total_items`, `total_pages`) vẫn có trong `metadata` như [API_RESPONSE_FE_MIGRATION.md](./API_RESPONSE_FE_MIGRATION.md).

**Ví dụ**

```http
GET /api/v1/vocabulary-sets?page=1&limit=50&vocabulary=me
Authorization: Bearer <access_token>
```

```http
GET /api/v1/vocabulary-sets?page=1&limit=50&vocabulary=public
Authorization: Bearer <access_token>
```

Các query khác **không đổi ý nghĩa** (nếu có): `search`, `subject_id`, `category_id`, `parent_id`, `flat`.

---

## 2. Field mới trên mỗi bộ: `category`

Trong mỗi object bộ (`SetResponse`), khi có `category_id` và category tồn tại trong DB, server populate thêm:

```json
"category": {
  "id": "uuid",
  "subject_id": "uuid",
  "name": "string",
  "description": "string",
  "thumbnail": "string",
  "order": 0
}
```

- Nếu không có category hoặc không tìm thấy bản ghi → **không có key** `category` (hoặc coi là `null` tùy parser).

---

## 3. Hai dạng `data`: nhóm (mặc định) vs phẳng (`flat=true`)

### 3.1. Mặc định — `flat` không gửi hoặc `flat=false`

**Không** dùng cùng lúc `parent_id` và `flat=true` (400).

Khi **`flat` không bật**, `data` là **object** (không phải mảng):

```json
{
  "success": true,
  "message": "",
  "data": {
    "grouped_parents": [
      {
        "category": { "id": "…", "subject_id": "…", "name": "…", "description": "…", "thumbnail": "…", "order": 0 },
        "sets": [ { …SetResponse… }, … ]
      }
    ],
    "standalone": [ { …SetResponse… }, … ]
  },
  "metadata": {
    "page": 1,
    "limit": 50,
    "total_items": 120,
    "total_pages": 3,
    "mine_total": 10,
    "public_total": 200
  }
}
```

| Key | Ý nghĩa |
|-----|---------|
| `grouped_parents` | Các bộ **có ít nhất một bộ con** mà viewer được xem (`child_count > 0`), gom theo **category**. Mỗi phần tử: `category` (có thể `null` nếu bộ không gắn category) + `sets`. |
| `standalone` | Các bộ **`child_count === 0`** (bộ “lẻ”, không có nhánh con hiển thị được). |

**Thứ tự nhóm trong `grouped_parents`:** theo thứ tự **lần đầu xuất hiện** của từng category trong danh sách đã sort `created_at DESC` (sau filter & phân trang).

**Pagination:** `metadata.total_items` vẫn là **tổng số bộ** thỏa điều kiện list (cùng `parent_id` / filter như request). Trên **một trang**, tổng số phần tử trong `grouped_parents[].sets` + `standalone` ≤ `limit`, nhưng UI cần dùng `total_items` / `total_pages` để phân trang, không giả định một mảng phẳng duy nhất.

**Trường hợp drill-down** (`parent_id=<uuid>`): logic tách **bộ có con** / **bộ lẻ** và group theo category **giống trên**, nhưng áp cho **danh sách con trực tiếp** của bộ cha đó.

### 3.2. Danh sách phẳng — `flat=true`

`data` là **mảng** `SetResponse[]` (hành vi gần list cũ). Vẫn bắt buộc **`vocabulary=me|public`** và có field **`category`** khi có dữ liệu.

```json
{
  "success": true,
  "data": [ { …SetResponse… } ],
  "metadata": {
    "page": 1,
    "limit": 50,
    "total_items": 200,
    "total_pages": 4,
    "mine_total": 10,
    "public_total": 200
  }
}
```

Dùng khi màn hình cần một list phẳng (export, admin nhẹ, v.v.), không cần section “bộ lớn / bộ lẻ”.

---

## 4. Gợi ý kiểu TypeScript (tuỳ chọn)

```typescript
type VocabularyListMode = "me" | "public";

type SetCategoryBrief = {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  thumbnail: string;
  order: number;
};

type SetParentBrief = { id: string; title: string };

type VocabularySetResponse = {
  id: string;
  user_id: string;
  parent_id?: string | null;
  parent?: SetParentBrief | null;
  subject_id?: string | null;
  category_id?: string | null;
  category?: SetCategoryBrief | null;
  title: string;
  description: string;
  is_public: boolean;
  word_count: number;
  child_count: number;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
};

type SetsByCategoryGroup = {
  category: SetCategoryBrief | null;
  sets: VocabularySetResponse[];
};

type VocabularySetsGroupedData = {
  grouped_parents: SetsByCategoryGroup[];
  standalone: VocabularySetResponse[];
};

type PageMeta = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};

/** metadata GET /vocabulary-sets — PageMeta + badge tab */
type VocabularySetsListMetadata = PageMeta & {
  mine_total: number;
  public_total: number;
};

// Response success — cần phân nhánh theo query flat
type VocabularySetsListResponseGrouped = {
  success: true;
  data: VocabularySetsGroupedData;
  metadata: VocabularySetsListMetadata;
};

type VocabularySetsListResponseFlat = {
  success: true;
  data: VocabularySetResponse[];
  metadata: VocabularySetsListMetadata;
};
```

---

## 5. Checklist migrate FE

1. Thay **`me` / `public`** (boolean) bằng **`vocabulary=me`** hoặc **`vocabulary=public`** trên mọi call `GET /vocabulary-sets`.
2. Tab / màn “tất cả (của tôi + công khai)”: chuyển sang **hai chế độ** hoặc **hai request** với state phân trang tách biệt.
3. Parse `data`:
   - Nếu **`Array.isArray(data)`** → mode `flat=true`.
   - Nếu **object** có `grouped_parents` + `standalone` → render hai section (và group UI theo `grouped_parents`).
4. Dùng `data.*[].category` (hoặc `grouped_parents[].category`) thay vì chỉ `category_id` khi cần tên/thumbnail category.
5. Phân trang list: đọc **`metadata.total_items` / `metadata.total_pages`**.
6. Nhãn tab “Của tôi (n)” / “Công khai (n)”: dùng **`metadata.mine_total`** và **`metadata.public_total`** (có trong mọi response, kể cả khi đang xem tab kia).
7. Xử lý **400** khi thiếu/sai `vocabulary`.
8. Cập nhật test / mock API nếu có.

---

## 6. Tóm tắt nhanh

| Trước | Sau |
|--------|-----|
| `GET .../vocabulary-sets?page=1&limit=50` | Bắt buộc `&vocabulary=me` hoặc `&vocabulary=public` |
| Hai boolean `me` / `public` (có thể OR) | Một enum hai giá trị: chỉ **một** loại list mỗi request |
| `data`: mảng bộ (rất cũ) | Mặc định: `data.grouped_parents` + `data.standalone`; `flat=true`: `data` là mảng |
| Không có object `category` | Có `category` (brief) khi có FK hợp lệ |

Nếu cần chi tiết luồng học (drill `parent_id`, `child_count`, …), xem thêm [VOCABULARY_FE_GUIDE.md](./VOCABULARY_FE_GUIDE.md).
