# Auth & Profile — hướng dẫn tích hợp Frontend

Base API: `{ORIGIN}/api/v1` (ví dụ dev: `http://localhost:8080/api/v1`).  
Các route **cần đăng nhập** gửi header:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Envelope JSON chuẩn

Mọi response thành công dùng dạng:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { }
}
```

- **Auth (login / register / google / refresh):** `data` là object chứa `access_token`, `refresh_token`, `token_type`, `user`.
- **User (`/users/me`, `PUT /users/profile`):** `data` là `UserResponse` (hoặc tương đương).

Lỗi: `success: false`, kèm `error` / `message` (và validation chi tiết khi 400).

---

## 1. Luồng đăng nhập & làm mới session

### 1.1 Đăng nhập email/mật khẩu

`POST /auth/login` — **public**

**Body**

| Field | Type | Ghi chú |
|--------|------|---------|
| `email` | string | Bắt buộc |
| `password` | string | Bắt buộc |
| `device_fingerprint` | string | Tùy chọn (theo dõi thiết bị) |

**Response (200)** — đọc token và user từ **`data`**.

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "<jwt>",
    "refresh_token": "<jwt>",
    "token_type": "Bearer",
    "user": {
      "id": "<uuid>",
      "username": "...",
      "email": "...",
      "google_id": null,
      "profile": {
        "fullname": "",
        "avatar": "",
        "phone": "",
        "dob": "2006-01-02T00:00:00Z",
        "bio": "",
        "current_level": "",
        "goal": "",
        "interests": ""
      },
      "email_verified": true,
      "created_at": "<RFC3339>",
      "updated_at": "<RFC3339>",
      "roles": [{ "id": "", "name": "", "description": "" }],
      "permissions": ["..."]
    }
  }
}
```

**Ghi chú FE**

- Toàn bộ thông tin hồ sơ hiển thị trên form “Chỉnh sửa thông tin” nằm trong **`user.profile`**, trừ **email** nằm ở **`user.email`** (identity).
- `profile.dob` có thể **vắng** (`omitempty`) nếu chưa có ngày sinh; khi có, backend trả **chuỗi thời gian** (RFC3339), không phải chỉ `YYYY-MM-DD`.
- `profile.avatar`: URL ảnh đại diện (preset từ hệ thống hoặc sau upload).

### 1.2 Đăng ký

`POST /auth/register` — **public**

**Body**

| Field | Type |
|--------|------|
| `fullname` | string (bắt buộc) |
| `email` | string |
| `password` | string (tối thiểu 6 ký tự theo validate hiện tại) |
| `device_fingerprint` | string (optional) |

Response cùng dạng **LoginResponse** (có `access_token`, `user` với `profile`; lúc mới đăng ký thường chỉ có `profile.fullname` đã set).

### 1.3 Google Sign-In

`POST /auth/google` — **public**

**Body**

| Field | Type |
|--------|------|
| `credential` | string — JWT credential từ Google Identity |
| `device_fingerprint` | string (optional) |

Response: `GoogleLoginResponse` — cấu trúc tương tự login (`access_token`, `refresh_token`, `token_type`, `user` với `profile` lồng nhau).

### 1.4 Refresh token

`POST /auth/refresh` — **public**

**Body**

```json
{ "refresh_token": "<refresh_jwt>" }
```

**Response:** cùng dạng **LoginResponse** (token mới + `user` đầy đủ). Gọi khi `access_token` hết hạn hoặc trước khi hết hạn theo chiến lược app.

**Luồng gợi ý**

1. Login/Register/Google → lưu `access_token` + `refresh_token`.
2. Mọi API cần auth: header `Authorization: Bearer <access_token>`.
3. 401 do hết hạn → `POST /auth/refresh` → cập nhật token → retry request.

---

## 2. Lấy user hiện tại (đồng bộ sau khi mở app / sau khi sửa profile)

`GET /users/me` — **JWT bắt buộc** (không cần permission đặc biệt).

**Response:** `data` là `UserResponse` — các field profile **dẹt** ở root của object (không lồng trong `profile`):

| JSON field | Ý nghĩa | Map UI (màn hình mẫu) |
|------------|---------|------------------------|
| `email` | Email đăng nhập | Ô Email |
| `fullname` | Họ và tên | Họ và tên |
| `avatar` | URL ảnh | Avatar + preset |
| `phone` | Số điện thoại | Số điện thoại |
| `dob` | Ngày sinh (`YYYY-MM-DD` trong JSON) | Ngày sinh |
| `bio` | Giới thiệu (tối đa 200 ký tự phía server) | Giới thiệu bản thân |
| `current_level` | Trình độ | Dropdown “Trình độ hiện tại” |
| `goal` | Mục tiêu | Mục tiêu |
| `interests` | Chuỗi (vd. cách nhau bởi dấu phẩy) | Sở thích |
| `roles`, `permissions` | RBAC | Ẩn hoặc dùng cho admin |

**Lưu ý:** Sau login, dữ liệu form có thể lấy từ `user.profile` + `user.email`; khi cần đồng bộ với server (hoặc sau admin đổi dữ liệu), gọi `GET /users/me`.

---

## 3. Cập nhật profile (modal “Lưu”)

`PUT /users/profile` — **JWT bắt buộc**

**Semantics:** **merge / partial update** — chỉ gửi field cần đổi; field **không gửi** hoặc **chuỗi rỗng** thường được hiểu là **giữ nguyên** giá trị cũ (trừ khi FE gửi rõ ràng để xóa — hiện backend ưu tiên “chỉ cập nhật khi có giá trị không rỗng” cho nhiều field).

**Body (`UpsertProfileRequest`)**

| Field | Type | Validation / UI |
|--------|------|------------------|
| `fullname` | string | Họ và tên |
| `avatar` | string | URL ảnh (sau khi chọn preset từ `/avatars` hoặc upload) |
| `phone` | string | Số điện thoại |
| `dob` | string | **`YYYY-MM-DD`** (JSON date) |
| `bio` | string | Tối đa **200** ký tự |
| `current_level` | string | Tối đa **100** ký tự (vd. `Intermediate (B1)`) |
| `goal` | string | Tối đa **500** ký tự |
| `interests` | string | Tối đa **500** ký tự |

**Email:** không đổi qua API này — email là field trên tài khoản (`user.email`), không nằm trong body profile. UI có thể hiển thị read-only hoặc dùng flow đổi email riêng nếu sau này có API.

**Lần đầu chưa có dòng `user_profiles`:** backend **tạo** bản ghi khi có ít nhất một giá trị profile cần lưu (không gửi toàn bộ rỗng).

**Response:** cùng envelope chuẩn project với body `UserResponse` (đã cập nhật).

---

## 4. API hỗ trợ UI avatar (preset “Chọn avatar”)

`GET /avatars` — **JWT bắt buộc**

- Trả danh sách avatar **published** và hiển thị cho user (`show_on_user`).
- FE: user chọn một item → lấy **URL** (hoặc field tương ứng trong response) → gán vào `avatar` khi `PUT /users/profile`.

Upload ảnh riêng (nếu dùng): `POST /upload` (multipart) — JWT; sau khi có URL, gửi URL đó trong `avatar` của `PUT /users/profile`.

---

## 5. Bảng map nhanh: màn hình ↔ API

| Thành phần UI | Nguồn sau login | Cập nhật |
|---------------|-----------------|----------|
| Họ và tên | `user.profile.fullname` | `PUT /users/profile` → `fullname` |
| Giới thiệu | `user.profile.bio` | `bio` |
| Trình độ | `user.profile.current_level` | `current_level` |
| Mục tiêu | `user.profile.goal` | `goal` |
| Sở thích | `user.profile.interests` | `interests` |
| Email | `user.email` | Không qua `PUT /users/profile` |
| SĐT | `user.profile.phone` | `phone` |
| Ngày sinh | `user.profile.dob` (parse RFC3339) | `dob` dạng `YYYY-MM-DD` |
| Avatar | `user.profile.avatar` | `avatar` (URL) + `GET /avatars` để chọn preset |

---

## 6. Lỗi thường gặp

- **401:** Thiếu/sai token → login lại hoặc refresh.
- **400 validation:** Kiểm tra `bio` ≤ 200, `current_level` ≤ 100, `goal` / `interests` ≤ 500; `dob` đúng format `YYYY-MM-DD`.

---

## 7. Tài liệu khác

- Swagger UI: `{ORIGIN}/swagger/index.html` (nếu bật trên môi trường dev).
