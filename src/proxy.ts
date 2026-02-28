import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware để check authentication
 * Chạy trước khi request đến route handlers
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lấy access token từ cookie
  const token = request.cookies.get("access_token")?.value;
  
  // Public routes - không cần authentication
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  
  // Nếu đang ở public route
  if (isPublicRoute) {
    // Nếu đã login, redirect về dashboard
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Chưa login, cho phép truy cập
    return NextResponse.next();
  }
  
  // Protected routes - cần authentication
  // Nếu chưa login, redirect về login page
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Lưu URL hiện tại để redirect lại sau khi login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Đã login, cho phép truy cập
  return NextResponse.next();
}

/**
 * Config matcher - chỉ chạy middleware cho các routes này
 * Không chạy cho static files, api routes, _next, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, etc. (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
