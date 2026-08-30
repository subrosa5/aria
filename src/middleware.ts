import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// jose, не jsonwebtoken: middleware выполняется в Edge runtime, а
// jsonwebtoken опирается на Node.js crypto, которого там нет. jose —
// стандартный edge-совместимый выбор для JWT в Next.js middleware.
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET is not set.");
}
const encodedSecret = new TextEncoder().encode(SECRET);

const PROTECTED = ["/dashboard", "/chat", "/tools", "/settings"];

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    // Раньше middleware проверял только НАЛИЧИЕ cookie "token", не её
    // валидность — любой мог поставить cookie token=что-угодно и пройти
    // редирект-защиту на уровне страниц. API-роуты дальше всё равно
    // проверяли токен по-настоящему (getCurrentUser -> verifyToken), так
    // что данные не утекали, но защита на уровне страниц была фиктивной.
    await jwtVerify(token, encodedSecret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
  const valid = await isValidToken(token);

  if (PROTECTED.some(p => path.startsWith(p)) && !valid) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (valid && (path === "/auth/login" || path === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/chat/:path*", "/tools/:path*", "/settings/:path*", "/auth/:path*"] };
