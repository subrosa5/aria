import "@testing-library/jest-dom";

// auth.ts теперь падает при отсутствии JWT_SECRET (см. fix/jwt-secret-fallback) —
// это правильно для прода, но локальный `npm test` без .env тоже должен работать.
// CI задаёт свой JWT_SECRET через env в workflow — тут только safety net для локали.
process.env.JWT_SECRET ||= "test-secret-for-local-dev-only";
