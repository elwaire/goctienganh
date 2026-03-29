# 🔥 Streak Feature — Frontend Integration Guide

## Tổng quan

Streak hoạt động theo cơ chế giống TikTok / Duolingo:
- User truy cập website → streak tăng 1 ngày (nếu hôm qua có truy cập)
- Truy cập nhiều lần trong ngày → **idempotent**, streak không thay đổi
- Bỏ lỡ 1 ngày → streak reset về `1`

> **Lưu ý:** Chỉ có **1 endpoint duy nhất** cho toàn bộ tính năng. Endpoint này vừa **check-in** (ghi nhận truy cập), vừa **trả về dữ liệu streak** hiện tại.

---

## API Endpoint

### `GET /api/v1/streak`

| Thuộc tính   | Giá trị                    |
|--------------|----------------------------|
| Method       | `GET`                      |
| URL          | `/api/v1/streak`           |
| Auth         | ✅ Required — Bearer Token  |

#### Request Headers

```http
Authorization: Bearer <access_token>
```

#### Response `200 OK`

```json
{
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "user_id": "a1b2c3d4-0000-0000-0000-000000000000",
    "current_streak": 5,
    "longest_streak": 12,
    "last_activity_date": "2026-03-29T00:00:00Z",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-29T07:50:00Z"
  },
  "message": ""
}
```

#### Response Fields

| Field                | Type        | Mô tả                                              |
|----------------------|-------------|----------------------------------------------------|
| `current_streak`     | `number`    | Số ngày liên tiếp hiện tại                         |
| `longest_streak`     | `number`    | Kỷ lục streak dài nhất của user                    |
| `last_activity_date` | `string` (ISO 8601) | Ngày ghi nhận hoạt động gần nhất (UTC)    |

#### Error Responses

| Status | Mô tả                                      |
|--------|--------------------------------------------|
| `401`  | Chưa đăng nhập hoặc token hết hạn         |
| `500`  | Lỗi server                                 |

---

## Cách tích hợp (Recommended)

### Bước 1 — Gọi API khi user load trang

Gọi endpoint này **một lần duy nhất khi app khởi động** (sau khi user đã được xác thực). Không cần gọi lại nhiều lần.

```typescript
// lib/api/streak.ts

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchAndCheckInStreak(accessToken: string): Promise<UserStreak> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/streak`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch streak");
  }

  const json = await res.json();
  return json.data as UserStreak;
}
```

### Bước 2 — Gọi trong layout chính (Next.js ví dụ)

```tsx
// app/(main)/layout.tsx (hoặc _app.tsx / root layout)

"use client";

import { useEffect, useState } from "react";
import { fetchAndCheckInStreak, UserStreak } from "@/lib/api/streak";
import { useAuth } from "@/hooks/useAuth"; // hook lấy token của bạn

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    fetchAndCheckInStreak(accessToken)
      .then(setStreak)
      .catch(console.error);
  }, [accessToken]); // chỉ chạy 1 lần khi có token

  return (
    <div>
      {/* Truyền streak xuống các component con nếu cần */}
      {children}
    </div>
  );
}
```

> **Tip:** Lưu `streak` vào **Context** hoặc **Zustand/Redux store** để các component khác có thể đọc mà không cần gọi API lại.

### Bước 3 — Hiển thị Streak Badge

```tsx
// components/StreakBadge.tsx

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  return (
    <div className="streak-badge">
      <span className="streak-fire">🔥</span>
      <span className="streak-count">{currentStreak}</span>
      <span className="streak-label">ngày liên tiếp</span>
      {longestStreak > 0 && (
        <span className="streak-best">Kỷ lục: {longestStreak} ngày</span>
      )}
    </div>
  );
}
```

---

## Ví dụ với React Query / TanStack Query

Nếu project dùng React Query, recommend dùng pattern sau để tránh race condition:

```typescript
// hooks/useStreak.ts

import { useQuery } from "@tanstack/react-query";
import { fetchAndCheckInStreak } from "@/lib/api/streak";
import { useAuth } from "@/hooks/useAuth";

export function useStreak() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["streak"],
    queryFn: () => fetchAndCheckInStreak(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 phút — không cần refetch liên tục
    retry: false,
  });
}
```

```tsx
// Sử dụng trong component
function HomePage() {
  const { data: streak, isLoading } = useStreak();

  if (isLoading) return null;

  return (
    <StreakBadge
      currentStreak={streak?.current_streak ?? 0}
      longestStreak={streak?.longest_streak ?? 0}
    />
  );
}
```

---

## Logic Business (để FE hiểu rõ)

```
Hôm nay là ngày N:

last_activity_date == N-1  →  current_streak += 1  ✅ tăng streak
last_activity_date == N    →  không thay đổi        ⚡ idempotent
last_activity_date < N-1   →  current_streak = 1    💔 reset
last_activity_date == null →  current_streak = 1    🆕 lần đầu
```

> Tất cả thời gian so sánh theo **UTC** (lúc nửa đêm UTC). Frontend nên hiển thị streak dựa hoàn toàn vào giá trị server trả về, **không tự tính toán lại** ở client.

---

## Khi nào nên gọi API

| Tình huống                        | Có nên gọi? |
|-----------------------------------|-------------|
| User mở trang lần đầu trong ngày | ✅ Yes       |
| User refresh trang                | ✅ Yes (idempotent, an toàn) |
| User navigate giữa các trang      | ❌ Không cần  |
| User chưa đăng nhập              | ❌ Skip      |
| Tab không active (background)    | ❌ Không cần  |

**Recommended:** Gọi 1 lần trong root layout khi token sẵn sàng là đủ.

---

## Roadmap (upcoming features)

Các tính năng sẽ được bổ sung sau:
- [ ] Streak dựa trên hoàn thành bài học / bài thi (không chỉ truy cập)
- [ ] Streak freeze (bảo vệ streak khi bỏ lỡ 1 ngày)
- [ ] Notification nhắc nhở giữ streak
- [ ] Leaderboard streak

> Khi có thêm logic mới, endpoint và response shape hiện tại **sẽ được giữ nguyên tương thích ngược** (backward compatible).
