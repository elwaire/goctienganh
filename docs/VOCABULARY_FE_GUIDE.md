# Vocabulary API — Hướng dẫn tích hợp Frontend

Tài liệu mô tả REST API **bộ từ vựng** (`vocabulary_sets`) và **từ** (`vocabulary_words`) để FE (web/mobile) gọi đúng endpoint, header và cấu trúc JSON.

## Base URL & phiên bản

- Prefix: **`/api/v1`**
- Ví dụ local: `http://localhost:<PORT>/api/v1/vocabulary-sets`

## Xác thực

Tất cả endpoint user và admin đều cần **JWT** (sau khi đăng nhập):

```http
Authorization: Bearer <access_token>
```

### Header tùy chọn: môn học

Middleware đọc **`X-Subject-Id`** (UUID) để:

- Khi **GET** danh sách bộ: nếu không gửi `subject_id` trên query, có thể dùng giá trị từ header để lọc.
- Khi **POST** tạo bộ: nếu body không có `subject_id`, backend có thể gán từ header.

```http
X-Subject-Id: 550e8400-e29b-41d4-a716-446655440000
```

## Envelope JSON chuẩn

Mọi response dùng dạng:

```json
{
  "success": true,
  "message": "",
  "data": { }
}
```

Lỗi:

```json
{
  "success": false,
  "message": "mô tả ngắn",
  "error": "chi tiết hoặc object validation"
}
```

- **Validation** (`400`): `error` thường là object map field → danh sách lỗi.
- **401**: chưa đăng nhập / token hết hạn.
- **403**: không có quyền truy cập tài nguyên (ví dụ bộ không public và không phải của bạn).
- **404**: không tìm thấy bộ hoặc từ.

Payload “thật” của API nằm trong **`data`**. Dưới đây mô tả nội dung `data` theo từng endpoint.

---

## Kiểu dữ liệu gợi ý (TypeScript)

```typescript
type UUID = string

interface SetOwner {
  id: UUID
  username: string
  email: string
  fullname: string
  avatar: string
}

interface VocabularySet {
  id: UUID
  user_id: UUID
  subject_id?: UUID | null
  owner?: SetOwner // thường có ở API admin list/detail
  title: string
  description: string
  is_public: boolean
  word_count: number
  is_owner: boolean
  created_at: string // ISO 8601
  updated_at: string
}

interface VocabularySetWithWords extends VocabularySet {
  words: VocabularyWord[]
}

interface VocabularyWord {
  id: UUID
  vocabulary_set_id: UUID
  term: string
  phonetic?: string
  word_type?: string
  definition: string
  example_sentence?: string
  example_translation?: string
  order: number
  created_at: string
  updated_at: string
}

interface SetListPayload {
  sets: VocabularySet[]
  total: number
}

interface WordListPayload {
  words: VocabularyWord[]
  total: number
}
```

---

## User API — Bộ từ (`/vocabulary-sets`)

Quy tắc chung:

- **Danh sách**: trả về các bộ **public** hoặc do **chính user** tạo.
- **Chi tiết / danh sách từ**: chỉ được xem nếu bộ **public** hoặc bạn là **chủ** (`user_id` trùng).
- **Tạo / sửa / xóa bộ** và **mọi thao tác từ**: chỉ **chủ** bộ.

### `GET /vocabulary-sets`

Danh sách bộ (phân trang + tìm kiếm + lọc môn).

| Query        | Ý nghĩa |
|-------------|---------|
| `page`      | Trang, mặc định logic server (thường ≥ 1) |
| `limit`     | Số item/trang (server giới hạn, ví dụ tối đa 100) |
| `search`    | Lọc theo tiêu đề (ILIKE) |
| `subject_id`| UUID; nếu không có, có thể dùng `X-Subject-Id` |

**`data`:** `SetListPayload` — `{ sets, total }`.

### `POST /vocabulary-sets`

Tạo bộ mới.

**Body:**

```json
{
  "title": "IELTS Core",
  "description": "Từ vựng cơ bản",
  "is_public": false,
  "subject_id": null
}
```

- `title`: bắt buộc, tối đa 255 ký tự.
- `is_public`: optional; không gửi thì mặc định `false`.
- `subject_id`: optional; có thể bỏ trống và dùng header `X-Subject-Id`.

**`data`:** một `VocabularySet` (mới tạo, `word_count` = 0).

### `GET /vocabulary-sets/{setId}`

Một bộ kèm **toàn bộ** từ (không phân trang). Dùng cho màn “học” / xem nhanh toàn bộ.

**`data`:** `VocabularySetWithWords`.

### `PUT /vocabulary-sets/{setId}`

Cập nhật bộ (chỉ chủ). Body: các field optional, chỉ gửi field cần đổi.

```json
{
  "title": "IELTS Core (updated)",
  "description": "...",
  "is_public": true,
  "subject_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**`data`:** `VocabularySet`.

### `DELETE /vocabulary-sets/{setId}`

Xóa mềm bộ và **toàn bộ từ** thuộc bộ (chỉ chủ).

**`data`:** ví dụ `{ "status": "ok" }`.

---

## User API — Từ (`/vocabulary-sets/{setId}/words`)

### `GET /vocabulary-sets/{setId}/words`

Danh sách từ **có phân trang** (phù hợp màn quản lý dài).

- Cần quyền xem bộ (public hoặc chủ).
- Query: `page`, `limit` (giới hạn tối đa theo server, ví dụ 200).

**`data`:** `WordListPayload` — `{ words, total }`.

### `POST /vocabulary-sets/{setId}/words`

Thêm **một** từ (chỉ chủ).

**Body:**

```json
{
  "term": "efficient",
  "phonetic": "ɪˈfɪʃnt",
  "word_type": "adjective",
  "definition": "hiệu quả",
  "example_sentence": "An efficient process saves time.",
  "example_translation": "Một quy trình hiệu quả tiết kiệm thời gian.",
  "order": 0
}
```

- `term`, `definition`: bắt buộc.

**`data`:** `VocabularyWord`.

### `POST /vocabulary-sets/{setId}/words/bulk`

Thêm **nhiều** từ một lần (chỉ chủ).

**Body:**

```json
{
  "words": [
    {
      "term": "apple",
      "definition": "quả táo",
      "order": 0
    },
    {
      "term": "banana",
      "definition": "quả chuối",
      "order": 1
    }
  ]
}
```

- `words`: mảng bắt buộc, ít nhất 1 phần tử; mỗi phần tử cùng rule như tạo một từ.

**`data`:** mảng `VocabularyWord[]`.

### `PUT /vocabulary-sets/{setId}/words/{wordId}`

Sửa từ (chỉ chủ). Body chỉ gửi field cần đổi (partial).

**`data`:** `VocabularyWord`.

### `DELETE /vocabulary-sets/{setId}/words/{wordId}`

Xóa mềm một từ; `word_count` của bộ được giảm (chỉ chủ).

**`data`:** ví dụ `{ "status": "ok" }`.

---

## Admin API — `/admin/vocabulary-sets`

Cần JWT và permission tương ứng:

| Endpoint | Permission |
|----------|------------|
| `GET /admin/vocabulary-sets` | `vocabulary_set:list` |
| `GET /admin/vocabulary-sets/{setId}` | `vocabulary_set:list` |
| `DELETE /admin/vocabulary-sets/{setId}` | `vocabulary_set:delete` |

### `GET /admin/vocabulary-sets`

Liệt kê **mọi** bộ (không lọc public/owner). Query: `page`, `limit`, `search` (theo title).

**`data`:** `SetListPayload`. Các phần tử trong `sets` thường có thêm `owner` (thông tin user tạo bộ).

### `GET /admin/vocabulary-sets/{setId}`

Chi tiết một bộ + toàn bộ từ + `owner`.

**`data`:** `VocabularySetWithWords` (có `owner` trên phần set).

### `DELETE /admin/vocabulary-sets/{setId}`

Xóa bộ (và từ con) **bất kỳ** user nào — dùng cho moderation.

**`data`:** `{ "status": "ok" }`.

---

## Ví dụ gọi API (fetch)

```typescript
const BASE = 'http://localhost:8080/api/v1' // chỉnh theo env

async function api<T>(
  path: string,
  opts: RequestInit & { token: string } = { token: '' }
): Promise<T> {
  const { token, ...init } = opts
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      // 'X-Subject-Id': subjectId,
      ...((init.headers as Record<string, string>) || {}),
    },
  })
  const json = await res.json()
  if (!json.success) {
    throw new Error(json.message || json.error || res.statusText)
  }
  return json.data as T
}

// Danh sách bộ
const list = await api<SetListPayload>('/vocabulary-sets?page=1&limit=20', {
  token: accessToken,
})

// Tạo bộ
const created = await api<VocabularySet>('/vocabulary-sets', {
  method: 'POST',
  token: accessToken,
  body: JSON.stringify({
    title: 'My deck',
    is_public: false,
  }),
})

// Chi tiết + tất cả từ
const detail = await api<VocabularySetWithWords>(`/vocabulary-sets/${setId}`, {
  token: accessToken,
})

// Bulk thêm từ
const words = await api<VocabularyWord[]>(`/vocabulary-sets/${setId}/words/bulk`, {
  method: 'POST',
  token: accessToken,
  body: JSON.stringify({
    words: [{ term: 'go', definition: 'đi', order: 0 }],
  }),
})
```

---

## Gợi ý luồng UI

1. **Trang “Thư viện bộ từ”:** `GET /vocabulary-sets` — hiển thị `sets`, dùng `total` để phân trang.
2. **Tạo / sửa bộ:** `POST` / `PUT`, sau đó invalidate cache hoặc refetch list.
3. **Màn chi tiết học:** `GET /vocabulary-sets/{setId}` — một request lấy đủ từ (nếu bộ lớn, cân nhắc `GET .../words?page=&limit=`).
4. **Màn quản lý từ (bảng lớn):** `GET .../words` phân trang; thêm/sửa/xóa gọi các endpoint tương ứng.
5. **Admin dashboard:** chỉ route có permission mới gọi `/admin/vocabulary-sets`.

---

## Lưu ý

- UUID dùng định dạng chuẩn string trong JSON.
- Soft delete: bản ghi có thể không còn xuất hiện trong API list/get sau khi xóa.
- `word_count` trên bộ được server cập nhật khi thêm/xóa từ (và bulk); FE có thể optimistic update hoặc refetch sau mutation.

Nếu cần bổ sung OpenAPI/Swagger sau khi chạy `swag init`, có thể đối chiếu thêm tag **`vocabulary`** trong repo.
