# Flashcard Module — API Documentation

> **Base URL:** `POST /api/v1`  
> **Auth:** Tất cả endpoint đều yêu cầu header `Authorization: Bearer <token>` (JWT).  
> **Subject filter:** Các endpoint có hỗ trợ filter theo môn học đều đọc header `X-Subject-Id: <uuid>` hoặc query param `?subject_id=<uuid>`.

---

## Mục lục

1. [Data Models](#1-data-models)
2. [Deck — Bộ thẻ học](#2-deck--bộ-thẻ-học)
3. [Card — Thẻ học](#3-card--thẻ-học)
4. [Study Session — Phiên luyện tập](#4-study-session--phiên-luyện-tập)
5. [Study History — Lịch sử luyện tập](#5-study-history--lịch-sử-luyện-tập)
6. [Study Stats — Thống kê](#6-study-stats--thống-kê)
7. [Admin APIs](#7-admin-apis)
8. [Luồng FE hoàn chỉnh](#8-luồng-fe-hoàn-chỉnh)
9. [Enums & Constants](#9-enums--constants)
10. [Error Handling](#10-error-handling)

---

## 1. Data Models

### DeckResponse

Trả về ở hầu hết mọi API liên quan đến deck.

```ts
interface DeckResponse {
  id: string; // UUID
  user_id: string; // UUID — chủ sở hữu
  subject_id?: string; // UUID — môn học liên kết (nullable)
  owner?: {
    // chỉ có trong Admin APIs
    id: string;
    username: string;
    email: string;
    fullname: string;
    avatar: string;
  };
  title: string;
  description: string;
  is_public: boolean;
  card_count: number;
  is_owner: boolean; // true nếu user hiện tại là chủ deck
  accuracy?: number; // 0.0–1.0, null nếu chưa học lần nào
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### CardResponse

```ts
interface CardResponse {
  id: string; // UUID
  deck_id: string; // UUID
  term: string; // từ/cụm từ tiếng Anh
  phonetic?: string; // phiên âm IPA, e.g. "/ɪˈfɪʃ.ənt/"
  word_type?: string; // loại từ: "noun", "verb", "adjective", ...
  definition: string; // nghĩa tiếng Việt
  example_sentence?: string; // câu ví dụ tiếng Anh
  example_translation?: string; // dịch câu ví dụ sang tiếng Việt
  order: number; // thứ tự hiển thị
  masked_term?: string; // chỉ có khi session mode = "fill_blank", e.g. "E_fic__nt"
  created_at: string;
  updated_at: string;
}
```

### StudySessionResponse

```ts
interface StudySessionResponse {
  id: string; // UUID — session ID
  user_id: string;
  deck_id: string;
  mode: "flashcard" | "writing" | "listening";
  writing_mode?: "vi_to_en" | "en_to_vi" | "fill_blank"; // chỉ khi mode = "writing"
  total_cards: number;
  correct_count: number;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at?: string;
  cards?: CardResponse[]; // trả về khi Start Session, không có khi Get Session (sau start)
}
```

### DeckStudyStatsResponse

```ts
interface DeckStudyStatsResponse {
  deck_id: string;
  total_cards: number; // tổng số thẻ trong deck
  studied_cards: number; // số thẻ đã học ít nhất 1 lần
  mastered_cards: number; // số thẻ đã thuộc (is_memorized = true ở lần học gần nhất)
  total_sessions: number; // tổng số phiên học đã hoàn thành
  accuracy: number; // 0.0–1.0 — độ chính xác tổng hợp
  progress: number; // 0.0–1.0 — mastered / total (tiến độ)
  total_time_ms: number; // tổng thời gian học (ms)
  last_studied_at?: string; // ISO 8601
}
```

---

## 2. Deck — Bộ thẻ học

### `GET /flashcard-decks` — Danh sách bộ thẻ

Trả về các deck **public** + deck **của chính user**. Filter theo môn học qua header hoặc query.

**Query Params:**

| Param        | Type   | Required | Description                                |
| ------------ | ------ | -------- | ------------------------------------------ |
| `page`       | int    | No       | Số trang, mặc định `1`                     |
| `limit`      | int    | No       | Số item/trang, mặc định `20`, tối đa `100` |
| `search`     | string | No       | Tìm kiếm theo tên deck (ILIKE)             |
| `subject_id` | UUID   | No       | Filter theo môn học _(ưu tiên hơn header)_ |

**Header (tuỳ chọn):**

```
X-Subject-Id: <uuid>
```

**Response `200`:**

```json
{
  "data": {
    "decks": [DeckResponse],
    "total": 42
  },
  "message": ""
}
```

---

### `POST /flashcard-decks` — Tạo bộ thẻ

**Header (tuỳ chọn):**

```
X-Subject-Id: <uuid>   ← gán subject_id tự động nếu body không có
```

**Request Body:**

```json
{
  "title": "English Vocabulary Unit 5",
  "description": "Từ vựng chủ đề Business (optional)",
  "is_public": false,
  "subject_id": "uuid-của-môn-học" // optional; fallback sang header X-Subject-Id
}
```

| Field         | Type    | Required | Notes                                       |
| ------------- | ------- | -------- | ------------------------------------------- |
| `title`       | string  | ✅       | Tối đa 255 ký tự                            |
| `description` | string  | No       |                                             |
| `is_public`   | boolean | No       | Mặc định `false`                            |
| `subject_id`  | UUID    | No       | Nếu bỏ trống → lấy từ header `X-Subject-Id` |

**Response `201`:**

```json
{
  "data": {
    /* DeckResponse */
  },
  "message": "Deck created successfully"
}
```

---

### `GET /flashcard-decks/{deckId}` — Chi tiết bộ thẻ + thẻ

Trả về thông tin deck **kèm toàn bộ cards**. User phải là chủ hoặc deck phải `is_public = true`.

**Response `200`:**

```json
{
  "data": {
    /* DeckResponse fields */
    "cards": [CardResponse]
  },
  "message": ""
}
```

---

### `PUT /flashcard-decks/{deckId}` — Cập nhật bộ thẻ

Chỉ chủ deck mới được cập nhật. Tất cả field đều **optional** (partial update).

**Request Body:**

```json
{
  "title": "Tên mới (optional)",
  "description": "Mô tả mới (optional)",
  "is_public": true,
  "subject_id": "uuid-môn-học-mới" // optional — để gán/thay đổi môn học
}
```

**Response `200`:** `DeckResponse`

---

### `DELETE /flashcard-decks/{deckId}` — Xoá bộ thẻ

Chỉ chủ deck mới được xoá. Soft delete.

**Response `204`:** No content

---

### `POST /flashcard-decks/{deckId}/copy` — Copy (Fork) bộ thẻ ⭐

Sao chép toàn bộ deck (metadata + cards) thành **bộ thẻ mới thuộc về user hiện tại**.

> **Điều kiện truy cập:** Deck nguồn phải là `is_public = true` HOẶC user là chủ deck đó.  
> **Deck gốc không bị thay đổi** — đây là thao tác "fork"/clone.

**URL Param:**

| Param    | Mô tả                                |
| -------- | ------------------------------------ |
| `deckId` | UUID của deck **nguồn** cần sao chép |

**Request Body (tất cả optional):**

```json
{
  "title": "Từ vựng của tôi",
  "description": "Bản copy để tự ôn tập",
  "is_public": false,
  "subject_id": "uuid-môn-học"
}
```

| Field         | Type    | Required | Mặc định khi bỏ trống                       |
| ------------- | ------- | -------- | ------------------------------------------- |
| `title`       | string  | No       | `"Copy of <title gốc>"`                     |
| `description` | string  | No       | Giữ nguyên description của deck gốc         |
| `is_public`   | boolean | No       | `false` (deck copy là **private** mặc định) |
| `subject_id`  | UUID    | No       | Giữ nguyên `subject_id` của deck gốc        |

**Response `201`:** `DeckWithCardsResponse`

```json
{
  "data": {
    "id": "new-deck-uuid",
    "user_id": "current-user-uuid",
    "title": "Copy of English Vocabulary Unit 5",
    "description": "...",
    "is_public": false,
    "card_count": 15,
    "is_owner": true,
    "subject_id": "subject-uuid",
    "cards": [
      /* CardResponse[] — toàn bộ cards đã được copy */
    ]
  },
  "message": "Deck copied successfully"
}
```

**Error cases:**

| Status | Khi nào                                  |
| ------ | ---------------------------------------- |
| `404`  | `deckId` nguồn không tồn tại             |
| `403`  | Deck không public và user không phải chủ |

**Gợi ý FE:**

```ts
// Nút "Lưu bộ thẻ về tài khoản" / "Fork deck"
async function copyDeck(
  deckId: string,
  options?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    subjectId?: string;
  },
) {
  const res = await api.post(`/flashcard-decks/${deckId}/copy`, {
    title: options?.title,
    description: options?.description,
    is_public: options?.isPublic ?? false,
    subject_id: options?.subjectId,
  });
  // res.data → DeckWithCardsResponse (deck mới)
  return res.data;
}
```

---

## 3. Card — Thẻ học

### `GET /flashcard-decks/{deckId}/cards` — Danh sách thẻ (phân trang)

**Query Params:** `page`, `limit` (tối đa `200`, mặc định `50`)

**Response `200`:**

```json
{
  "data": {
    "cards": [CardResponse],
    "total": 15
  }
}
```

---

### `POST /flashcard-decks/{deckId}/cards` — Thêm 1 thẻ

Chỉ chủ deck mới được thêm.

**Request Body:**

```json
{
  "term": "Efficient",
  "phonetic": "/ɪˈfɪʃ.ənt/",
  "word_type": "adjective",
  "definition": "Hiệu quả",
  "example_sentence": "She is an efficient worker.",
  "example_translation": "Cô ấy là một nhân viên làm việc hiệu quả.",
  "order": 1
}
```

| Field                 | Type   | Required | Notes                                             |
| --------------------- | ------ | -------- | ------------------------------------------------- |
| `term`                | string | ✅       | Từ/cụm từ tiếng Anh                               |
| `definition`          | string | ✅       | Nghĩa tiếng Việt                                  |
| `phonetic`            | string | No       | Phiên âm IPA                                      |
| `word_type`           | string | No       | `noun`, `verb`, `adjective`, `adverb`, ...        |
| `example_sentence`    | string | No       | Câu ví dụ tiếng Anh _(cần có để dùng fill_blank)_ |
| `example_translation` | string | No       | Dịch câu ví dụ                                    |
| `order`               | int    | No       | Thứ tự, mặc định `0`                              |

**Response `201`:** `CardResponse`

---

### `POST /flashcard-decks/{deckId}/cards/bulk` — Thêm nhiều thẻ cùng lúc

Chỉ chủ deck mới được thêm. Thêm tất cả hoặc không thêm gì (atomic).

**Request Body:**

```json
{
  "cards": [
    {
      "term": "Efficient",
      "definition": "Hiệu quả",
      "order": 1
    },
    {
      "term": "Collaborate",
      "definition": "Hợp tác",
      "order": 2
    }
  ]
}
```

**Response `201`:** `CardResponse[]` (mảng)

---

### `PUT /flashcard-decks/{deckId}/cards/{cardId}` — Cập nhật thẻ

Chỉ chủ deck mới được cập nhật. Tất cả field **optional**.

**Request Body:** tương tự `CreateCardRequest` nhưng mọi field là optional (dùng pointer).

**Response `200`:** `CardResponse`

---

### `DELETE /flashcard-decks/{deckId}/cards/{cardId}` — Xoá thẻ

**Response `204`:** No content

---

## 4. Study Session — Phiên luyện tập

> **Luồng chuẩn:**  
> `POST .../study-sessions` → học từng thẻ → `POST .../records` (mỗi thẻ) → `POST .../complete`

### `POST /flashcard-decks/{deckId}/study-sessions` — Bắt đầu phiên học

**Request Body (optional):**

```json
{
  "mode": "writing",
  "writing_mode": "vi_to_en"
}
```

| Field          | Type   | Required | Values                                                                     |
| -------------- | ------ | -------- | -------------------------------------------------------------------------- |
| `mode`         | string | No       | `flashcard` _(mặc định)_, `writing`, `listening`                           |
| `writing_mode` | string | No       | `vi_to_en` _(mặc định)_, `en_to_vi`, `fill_blank` _(chỉ khi mode=writing)_ |

**Ý nghĩa từng mode:**

| Mode                   | Mô tả                                | FE hiển thị                                                                 |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `flashcard`            | Lật thẻ, tự đánh giá                 | Mặt trước: `term` → lật → `definition`. User chọn "Đã thuộc" / "Chưa thuộc" |
| `writing / vi_to_en`   | Cho nghĩa tiếng Việt, điền tiếng Anh | Hiển thị `definition` → user nhập `term`                                    |
| `writing / en_to_vi`   | Cho tiếng Anh, điền nghĩa tiếng Việt | Hiển thị `term` → user nhập `definition`                                    |
| `writing / fill_blank` | Điền từ thiếu trong từ               | Hiển thị `masked_term` (e.g `E_fic__nt`) → user nhập lại `term` đầy đủ      |
| `listening`            | Nghe TTS, điền nghĩa                 | FE phát TTS của `term` → user nhập `definition`                             |

**Response `201`:** `StudySessionResponse` **kèm** `cards[]`

> ⚠️ **Lưu ý:** `cards` chỉ trả về khi _start session_. Sau đó dùng deck detail nếu cần thẻ lại.  
> Với `fill_blank`: mỗi card có thêm field `masked_term` (một phần ký tự bị ẩn bằng `_`).

**Response ví dụ:**

```json
{
  "data": {
    "id": "session-uuid",
    "user_id": "user-uuid",
    "deck_id": "deck-uuid",
    "mode": "writing",
    "writing_mode": "fill_blank",
    "total_cards": 10,
    "correct_count": 0,
    "status": "in_progress",
    "started_at": "2026-03-28T09:00:00+07:00",
    "cards": [
      {
        "id": "card-uuid",
        "term": "Efficient",
        "masked_term": "E_fic__nt",
        "definition": "Hiệu quả",
        ...
      }
    ]
  }
}
```

---

### `GET /flashcard-decks/{deckId}/study-sessions/{sessionId}` — Lấy thông tin phiên học

**Response `200`:** `StudySessionResponse` (không kèm `cards`)

---

### `POST /flashcard-decks/{deckId}/study-sessions/{sessionId}/records` — Ghi kết quả 1 thẻ

Gọi sau mỗi lần user trả lời xong 1 thẻ.

**Request Body:**

```json
{
  "card_id": "card-uuid",
  "is_correct": true,
  "is_memorized": true,
  "time_spent_ms": 3500
}
```

| Field           | Type    | Required | Notes                                                   |
| --------------- | ------- | -------- | ------------------------------------------------------- |
| `card_id`       | UUID    | ✅       | ID của thẻ vừa học                                      |
| `is_correct`    | boolean | ✅       | Kết quả đúng/sai (server dùng để tính accuracy)         |
| `is_memorized`  | boolean | No       | Dành cho mode `flashcard`: `true` = "Đã thuộc" (Got it) |
| `time_spent_ms` | int     | No       | Thời gian user mất để trả lời (milliseconds)            |

**Logic `is_correct` + `is_memorized` theo mode:**

| Mode        | `is_correct`                                      | `is_memorized`                 |
| ----------- | ------------------------------------------------- | ------------------------------ |
| `flashcard` | = `is_memorized`                                  | User tự đánh giá               |
| `writing`   | FE so sánh input với đáp án, truyền kết quả       | Tuỳ FE (có thể = `is_correct`) |
| `listening` | FE so sánh input với `definition`, truyền kết quả | Tuỳ FE                         |

**Response `200`:**

```json
{
  "data": {
    "record_id": "uuid",
    "card_id": "uuid",
    "is_correct": true,
    "is_memorized": true
  }
}
```

---

### `POST /flashcard-decks/{deckId}/study-sessions/{sessionId}/complete` — Hoàn thành phiên học

Gọi sau khi user học hết tất cả thẻ. Chuyển session sang `status = "completed"`.

**Response `200`:**

```json
{
  "data": {
    "session_id": "uuid",
    "deck_id": "uuid",
    "mode": "flashcard",
    "total_cards": 10,
    "correct_count": 8,
    "accuracy": 0.8,
    "status": "completed",
    "started_at": "2026-03-28T09:00:00+07:00",
    "completed_at": "2026-03-28T09:10:00+07:00"
  },
  "message": "Study session completed"
}
```

---

## 5. Study History — Lịch sử luyện tập

### `GET /flashcard-decks/{deckId}/study-history` — Lịch sử phiên học

Trả về danh sách phiên học **đã hoàn thành** của user trên deck này.

**Query Params:** `page`, `limit` (mặc định `10`)

**Response `200`:**

```json
{
  "data": {
    "sessions": [
      {
        "session_id": "uuid",
        "mode": "writing",
        "writing_mode": "vi_to_en",
        "total_cards": 10,
        "correct_count": 9,
        "accuracy": 0.9,
        "total_time_ms": 120000,
        "started_at": "2026-03-28T09:00:00+07:00",
        "completed_at": "2026-03-28T09:02:00+07:00"
      }
    ],
    "total": 5
  }
}
```

**Gợi ý hiển thị UI (panel "Lịch sử luyện tập"):**

| Field           | Hiển thị                                       |
| --------------- | ---------------------------------------------- |
| `mode`          | Icon: 🃏 flashcard / ✏️ writing / 🎧 listening |
| `writing_mode`  | Badge: "Việt → Anh" / "Anh → Việt" / "Điền từ" |
| `accuracy`      | `(accuracy * 100).toFixed(0) + "%"`            |
| `total_time_ms` | Format: `"2m 30s"`                             |
| `started_at`    | Format: `"28/03/2026 09:00"`                   |

---

## 6. Study Stats — Thống kê

### `GET /flashcard-decks/{deckId}/study-stats` — Thống kê học tập

**Response `200`:**

```json
{
  "data": {
    "deck_id": "uuid",
    "total_cards": 20,
    "studied_cards": 15,
    "mastered_cards": 10,
    "total_sessions": 8,
    "accuracy": 0.87,
    "progress": 0.5,
    "total_time_ms": 3600000,
    "last_studied_at": "2026-03-28T09:00:00+07:00"
  }
}
```

**Gợi ý hiển thị UI (panel "Thống kê"):**

| Field                            | Label UI     | Hiển thị                  |
| -------------------------------- | ------------ | ------------------------- |
| `accuracy`                       | Độ chính xác | `"87%"`                   |
| `progress`                       | Tiến độ      | `"50%"` hoặc progress bar |
| `total_sessions`                 | Lần học      | `"8 lần"`                 |
| `total_time_ms`                  | Thời gian    | `"1 giờ"`                 |
| `last_studied_at`                | Lần cuối học | `"28/03/2026"`            |
| `mastered_cards` / `total_cards` | Đã thuộc     | `"10/20 từ"`              |

---

## 7. Admin APIs

> Yêu cầu quyền `flashcard_deck:list` hoặc `flashcard_deck:delete`.

### `GET /admin/flashcard-decks` — Danh sách tất cả deck

**Query Params:** `page`, `limit`, `search`

**Response:** `DeckListResponse` (mỗi deck có field `owner` chứa thông tin chủ)

---

### `GET /admin/flashcard-decks/{deckId}` — Chi tiết deck (Admin)

**Response:** `DeckWithCardsResponse` (kèm `owner` và `cards[]`)

---

### `DELETE /admin/flashcard-decks/{deckId}` — Xoá bất kỳ deck nào

**Response `204`:** No content

---

## 8. Luồng FE hoàn chỉnh

### Luồng 1: Tạo bộ thẻ mới

```
1. User chọn môn học → FE lưu subjectId
2. POST /flashcard-decks
   Header: X-Subject-Id: {subjectId}   ← hoặc truyền subject_id trong body
   Body: { title, description, is_public }
3. Nhận DeckResponse → lưu deck.id
4. POST /flashcard-decks/{deckId}/cards/bulk
   Body: { cards: [...] }
5. Chuyển đến trang chi tiết deck
```

---

### Luồng 2: Học flashcard (mode = flashcard)

```
1. GET /flashcard-decks/{deckId}  → lấy danh sách cards
2. POST /flashcard-decks/{deckId}/study-sessions
   Body: { "mode": "flashcard" }  → nhận session.id + cards[]
3. FE hiển thị từng card:
   - Mặt trước: term (+ phonetic, word_type)
   - User nhấn lật → mặt sau: definition (+ example_sentence)
   - User chọn: "Đã thuộc" (Got it) hoặc "Chưa thuộc" (Study again)
4. Với mỗi thẻ sau khi user chọn:
   POST /flashcard-decks/{deckId}/study-sessions/{sessionId}/records
   Body: {
     card_id: "...",
     is_correct: true/false,   // = is_memorized
     is_memorized: true/false, // "Đã thuộc" hay chưa
     time_spent_ms: 3500
   }
5. Sau khi hết tất cả thẻ:
   POST .../complete
6. Hiển thị màn hình kết quả (accuracy từ CompleteStudySessionResponse)
```

---

### Luồng 3: Học writing (fill_blank)

```
1. POST /flashcard-decks/{deckId}/study-sessions
   Body: { "mode": "writing", "writing_mode": "fill_blank" }
2. Nhận cards[] — mỗi card có masked_term (e.g "E_fic__nt")
3. FE hiển thị masked_term + example_sentence → user điền term đầy đủ
4. FE so sánh input.toLowerCase() === card.term.toLowerCase()
5. POST .../records với is_correct = (kết quả so sánh)
6. POST .../complete
```

---

### Luồng 4: Học listening

```
1. POST /flashcard-decks/{deckId}/study-sessions
   Body: { "mode": "listening" }
2. Nhận cards[]
3. FE phát TTS của card.term (Google TTS / Web Speech API)
4. User nghe và nhập definition (nghĩa tiếng Việt)
5. FE so sánh input với card.definition (case-insensitive)
6. POST .../records với is_correct = (kết quả so sánh)
7. POST .../complete
```

---

### Luồng 5: Xem trang chi tiết bộ thẻ

```
Gọi song song 3 API:
1. GET /flashcard-decks/{deckId}       → thông tin deck + cards
2. GET /flashcard-decks/{deckId}/study-stats    → thống kê
3. GET /flashcard-decks/{deckId}/study-history  → lịch sử học (page=1, limit=10)
```

---

### Luồng 6: Fork bộ thẻ của người khác

```
1. User xem trang chi tiết deck (deck.is_public = true, deck.is_owner = false)
2. FE hiển thị nút "Lưu về tài khoản" / "Copy bộ thẻ"
3. (Optional) Hiển thị modal cho user đặt lại tên bộ thẻ
4. POST /flashcard-decks/{deckId}/copy
   Body: { "title": "Tên tuỳ chọn" }   ← hoặc {} để dùng default
5. Nhận DeckWithCardsResponse (deck mới — is_owner = true)
6. Chuyển hướng đến trang chi tiết deck mới
7. Toast: "Đã lưu bộ thẻ về tài khoản của bạn!"
```

> **Lưu ý:**
>
> - Nếu `deck.is_owner = true` có thể ẩn nút fork hoặc đổi thành "Sao lưu bộ thẻ".
> - Body có thể để trống `{}` — server tự tạo title `"Copy of <tên gốc>"` và set `is_public = false`.

---

## 9. Enums & Constants

### Study Mode

| Value       | Mô tả                         |
| ----------- | ----------------------------- |
| `flashcard` | Lật thẻ, tự đánh giá          |
| `writing`   | Luyện viết từ (có 3 sub-mode) |
| `listening` | Nghe TTS, viết nghĩa          |

### Writing Mode (chỉ khi mode = `writing`)

| Value        | Hiển thị   | Mô tả                                       |
| ------------ | ---------- | ------------------------------------------- |
| `vi_to_en`   | Việt → Anh | Cho `definition` → user điền `term`         |
| `en_to_vi`   | Anh → Việt | Cho `term` → user điền `definition`         |
| `fill_blank` | Điền từ    | Cho `masked_term` → user điền `term` đầy đủ |

### Session Status

| Value         | Mô tả              |
| ------------- | ------------------ |
| `in_progress` | Phiên đang diễn ra |
| `completed`   | Đã hoàn thành      |

### Deck Status (internal — không dùng trực tiếp ở FE)

`draft` | `published` | `archived`

---

## 10. Error Handling

### HTTP Status Codes

| Status                      | Khi nào xảy ra                                       |
| --------------------------- | ---------------------------------------------------- |
| `400 Bad Request`           | Body thiếu field bắt buộc hoặc sai format            |
| `401 Unauthorized`          | Thiếu/hết hạn JWT token                              |
| `403 Forbidden`             | Không phải chủ deck (khi cần quyền)                  |
| `404 Not Found`             | Deck / Card / Session không tồn tại                  |
| `409 Conflict`              | Session đã `completed` nhưng vẫn gọi record/complete |
| `500 Internal Server Error` | Lỗi server                                           |

### Response Format chung

**Thành công:**

```json
{
  "data": { ... },
  "message": "optional success message"
}
```

**Lỗi:**

```json
{
  "error": "Not Found",
  "detail": "flashcard deck not found"
}
```

**Validation error (`400`):**

```json
{
  "error": "Validation Error",
  "fields": {
    "title": "required",
    "term": "required"
  }
}
```

---

## Ghi chú quan trọng cho FE

1. **`accuracy` trong `DeckResponse`** — chỉ có mặt nếu user đã học deck đó ít nhất 1 lần. Nếu `null/undefined` → hiển thị `"—"` hoặc `"Chưa học"`.

2. **`subject_id` trong `DeckResponse`** — có thể `null`. Dùng để filter theo môn học trên trang danh sách.

3. **`cards[]` trong `StudySessionResponse`** — **CHỈ có khi Start Session**. Lưu lại client-side để không phải gọi thêm API trong quá trình học.

4. **`masked_term`** — chỉ có khi session `writing_mode = "fill_blank"`. So sánh **case-insensitive**.

5. **`total_time_ms` trong stats** — đơn vị **milliseconds**. Convert: `Math.round(ms / 60000)` phút.

6. **`accuracy` trong stats** — từ `0.0` đến `1.0`. Nhân 100 để hiển thị phần trăm.

7. **`progress`** — `mastered_cards / total_cards`. Dùng cho progress bar.

8. **X-Subject-Id header** — nên set ở mức Axios interceptor/fetch wrapper theo context môn học hiện tại:

   ```ts
   // Ví dụ với Axios
   axiosInstance.defaults.headers["X-Subject-Id"] = currentSubjectId ?? "";
   ```

9. **`is_owner` trong `DeckResponse`** — dùng để kiểm soát UI theo quyền:
   - `true` → Hiển thị nút **Edit / Delete**. Ẩn hoặc thay nút "Fork" bằng "Sao lưu".
   - `false` → Ẩn nút Edit/Delete. Hiển thị nút **"Lưu về tài khoản"** (chỉ khi `is_public = true`).

10. **Copy Deck — title mặc định** — nếu không truyền `title` trong body, server tự tạo `"Copy of <title gốc>"`. FE nên hiển thị giá trị này trong modal xác nhận để user có thể sửa trước khi submit.
