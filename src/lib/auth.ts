import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Раньше здесь был `|| "fallback-secret"` — если JWT_SECRET не задан в
// окружении, приложение молча подписывало токены публично известной строкой
// из открытого репозитория. Любой мог бы подделать валидный токен для
// любого пользователя. Теперь падаем громко при старте, а не тихо остаёмся
// уязвимыми в проде.
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error(
    "JWT_SECRET is not set. Refusing to start with an insecure default secret."
  );
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  plan: string;
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
