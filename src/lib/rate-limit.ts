import { prisma } from "./prisma";

// Sliding-window rate limit на существующей таблице Usage — она и так
// пишется на каждый chat/generate вызов, отдельная инфраструктура (Redis
// и т.п.) не нужна для этого масштаба. Простой подход: считаем, сколько
// Usage-записей у пользователя за последние WINDOW_MS, и отсекаем, если
// больше лимита. Не идеально под очень высокую нагрузку (лишний запрос в
// БД на каждый вызов), но для реального использования этого достаточно и
// это то, чего в проекте не было вообще — сейчас пользователь мог слать
// запросы к Groq без всякого ограничения.
const WINDOW_MS = 5 * 60 * 1000; // 5 минут
const MAX_REQUESTS_PER_WINDOW = 20;

export async function checkRateLimit(
  userId: string
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const windowStart = new Date(Date.now() - WINDOW_MS);
  const count = await prisma.usage.count({
    where: { userId, createdAt: { gte: windowStart } },
  });

  return {
    allowed: count < MAX_REQUESTS_PER_WINDOW,
    retryAfterSeconds: Math.ceil(WINDOW_MS / 1000),
  };
}
