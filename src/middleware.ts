import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/chat", "/tools", "/settings"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (PROTECTED.some(p => path.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token && (path === "/auth/login" || path === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/chat/:path*", "/tools/:path*", "/settings/:path*", "/auth/:path*"] };
