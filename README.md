# Aria — AI Workspace

A production-ready SaaS platform for AI-powered productivity. Chat with LLMs in real time, generate content, and manage your workspace — built with a focus on streaming performance, security, and clean architecture.

**Live:** https://aria-three-alpha.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?style=flat-square&logo=prisma)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)
![Tests](https://img.shields.io/badge/Tests-39%20passed-brightgreen?style=flat-square&logo=vitest)
![CI](https://github.com/subrosa5/aria/actions/workflows/ci.yml/badge.svg)

---

## Features

**AI Chat**
- Real-time streaming responses via SSE (Server-Sent Events) — no polling
- Powered by Groq API (Llama 3.1 8B Instant, free tier)
- Multi-session support: create, switch, and delete chat sessions
- Persistent chat history in PostgreSQL
- Auto-generated titles from first user message
- Typing indicator with animated dots during streaming
- Keyboard shortcut: Enter to send, Shift+Enter for newline

**Content Writer**
- 4 content types: Blog Post, Email, Social Media, Code
- 5 tone presets: Professional, Casual, Friendly, Persuasive, Informative
- One-click clipboard copy with feedback

**Dashboard**
- Per-user usage stats: messages this month, generations, plan, active days
- Free plan usage bar with percentage tracking
- Quick-access cards to all tools

**Authentication**
- Email + password registration and login
- JWT stored in httpOnly cookies (XSS-proof)
- Middleware-based route protection
- Password hashing with bcryptjs (cost factor 12)
- Zod validation on all API inputs

**Internationalization**
- Full EN / RU language toggle
- 130+ translation keys covering all pages and UI states
- Language preference persisted in localStorage via Zustand

**Mobile**
- Fully responsive across all pages
- Mobile sidebar: slide-in drawer with backdrop overlay and hamburger trigger
- Fixed top bar on mobile with navigation access

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| State | Zustand + persist middleware |
| Validation | Zod |
| Auth | JWT + bcryptjs + httpOnly cookies |
| AI | Groq API — Llama 3.1 8B Instant |
| Streaming | Web ReadableStream + SSE |
| ORM | Prisma v5 |
| Database | PostgreSQL (Neon serverless) |
| Deployment | Vercel |

---

## Architecture

- **Streaming** — custom `ReadableStream` on the server encodes SSE chunks token by token; client reads via `ReadableStreamDefaultReader` and updates Zustand store on each delta, triggering React re-renders per character
- **Auth** — JWT signed with `jose`, stored in `httpOnly` cookies, verified in both Next.js Middleware (route guard) and API route handlers (`getCurrentUser`)
- **Prisma singleton** — prevents connection pool exhaustion in serverless by reusing the client instance across hot reloads
- **i18n** — static translation dictionary (`translations[lang]`) consumed via `useLanguageStore()` hook; no external i18n library, zero bundle overhead
- **Protected routes** — Next.js Middleware intercepts all `/dashboard`, `/chat`, `/tools`, `/settings` requests; unauthenticated users are redirected to `/auth/login`

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout (font, viewport, metadata)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── chat/page.tsx              # SSE streaming chat
│   ├── tools/
│   │   ├── page.tsx
│   │   └── writer/page.tsx
│   ├── settings/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── chat/route.ts          # POST stream | GET history | DELETE chat
│       └── generate/route.ts
├── components/
│   └── layout/
│       └── Sidebar.tsx            # Desktop sidebar + mobile drawer
├── lib/
│   ├── auth.ts                    # JWT sign/verify, bcrypt, getCurrentUser
│   ├── i18n.ts                    # EN/RU translation dictionary
│   ├── prisma.ts                  # Prisma client singleton
│   └── utils.ts                   # cn() — clsx + tailwind-merge
├── store/
│   ├── chat.ts                    # Zustand: chats, messages, streaming state
│   └── language.ts                # Zustand: language preference (persisted)
└── middleware.ts                   # Route protection
```

---

## Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  plan      String    @default("FREE")
  avatar    String?
  createdAt DateTime  @default(now())
  chats     Chat[]
  messages  Message[]
  usage     Usage[]
}

model Chat {
  id        String    @id @default(cuid())
  userId    String
  title     String    @default("New Chat")
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
}

model Message {
  id        String   @id @default(cuid())
  chatId    String
  userId    String
  role      String
  content   String   @db.Text
  createdAt DateTime @default(now())
  chat      Chat     @relation(fields: [chatId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model Usage {
  id        String   @id @default(cuid())
  userId    String
  type      String
  tokens    Int      @default(0)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Testing

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```

**39 tests across 5 suites:**

| Suite | Coverage |
|---|---|
| `src/lib/auth.test.ts` | `signToken`, `verifyToken` (valid, tampered, invalid), `hashPassword`, `comparePassword` (correct, wrong, salt uniqueness) |
| `src/store/chat.test.ts` | `addChat`, `addMessage`, `updateLastMessage`, `deleteChat` (active reassignment, null fallback), `setStreaming`, `updateChatTitle` |
| `src/app/api/auth/login/route.test.ts` | 400 on invalid input, 401 on unknown user, 401 on wrong password, 200 + httpOnly cookie on success |
| `src/app/api/auth/register/route.test.ts` | 400 on bad fields, 409 on duplicate email, 200 + cookie on success, password hash not exposed in response |
| `src/components/layout/Sidebar.test.tsx` | Nav links render, brand logo, sign out button, hamburger opens mobile drawer, language toggle visible |

**Stack:** Vitest + Testing Library + jsdom

---

## Getting Started

```bash
git clone https://github.com/subrosa5/aria.git
cd aria
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon or local) |
| `DIRECT_URL` | Direct DB URL for Prisma migrations |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GROQ_API_KEY` | Groq API key — [console.groq.com](https://console.groq.com) (free) |

---

## Streaming Implementation

```ts
// server: src/app/api/chat/route.ts
const stream = new ReadableStream({
  async start(controller) {
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      messages,
    });
    for await (const delta of (await result).textStream) {
      controller.enqueue(encode(`data: ${JSON.stringify({ delta })}\n\n`));
    }
    controller.enqueue(encode("data: [DONE]\n\n"));
    controller.close();
  },
});

return new Response(stream, {
  headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
});
```

```ts
// client: src/app/chat/page.tsx
const reader = res.body!.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const json = JSON.parse(line.replace("data: ", ""));
  if (json.delta) updateLastMessage(chatId, (prev) => prev + json.delta);
}
```

---

## Deployment

Deployed on **Vercel** (Hobby plan).
Database on **Neon** (serverless PostgreSQL, free tier).

```bash
npx vercel --prod
```
