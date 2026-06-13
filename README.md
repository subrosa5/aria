# Aria — AI-powered SaaS Workspace

> A full-stack AI productivity platform where users can chat with Claude AI, generate content, and manage their workspace — built as a production-ready SaaS with authentication, streaming, and a polished UI.

**Live:** https://aria-three-alpha.vercel.app · **GitHub:** https://github.com/subrosa5/aria

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?style=flat-square&logo=prisma)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## Features

### Landing Page
- Animated hero section with gradient text and floating UI mockup
- Feature grid with scroll-triggered animations (Framer Motion)
- Pricing table (Free / Pro / Team) with highlighted plan
- CTA sections and footer — fully responsive

### Authentication
- Email + password registration and login
- JWT stored in **httpOnly cookies** (secure, XSS-proof)
- Middleware-based route protection — unauthenticated users redirected to login
- Password hashing with **bcryptjs** (cost factor 12)
- Zod schema validation on all API inputs

### AI Chat (Streaming)
- Real-time **streaming responses** from Claude AI via SSE (Server-Sent Events)
- Demo mode when no API key is set — works out of the box
- Multi-chat support: create, switch between, and persist chat sessions
- Chat history stored in PostgreSQL, loaded on page mount
- Typing indicator with animated dots during streaming
- Suggested prompts on empty chat state
- Keyboard shortcut: Enter to send, Shift+Enter for new line
- Auto-scroll to latest message
- Auto-generated chat titles from first user message

### Content Writer
- 4 content types: **Blog Post**, **Email**, **Social Media**, **Code**
- 5 tone options: Professional, Casual, Friendly, Persuasive, Informative
- Animated skeleton loader during generation
- One-click copy to clipboard with confirmation feedback

### Dashboard
- Personalized greeting
- Stats cards: messages this month, generations, plan, active days
- Free plan usage bar with visual progress indicator
- Quick action cards linking to AI tools

### Settings
- Profile editor
- Plan display with upgrade CTA
- Security section

### Architecture
- **Next.js Middleware** protects all `/dashboard`, `/chat`, `/tools`, `/settings` routes
- **Zustand** store manages chat state client-side (messages, streaming flag, active chat)
- **Prisma Client singleton** prevents connection pool exhaustion in serverless
- All API routes validate input with **Zod** before touching the database
- SSE streaming with manual `ReadableStream` — no polling

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| State management | Zustand |
| Validation | Zod |
| Auth | JWT + bcryptjs + httpOnly cookies |
| AI | Groq API — Llama 3.1 8B Instant (free tier) |
| ORM | Prisma v5 |
| Database | PostgreSQL (Neon serverless) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── auth/
│   │   ├── login/page.tsx        # Login form
│   │   └── register/page.tsx     # Registration form
│   ├── dashboard/page.tsx        # User dashboard with stats
│   ├── chat/page.tsx             # AI Chat with streaming
│   ├── tools/
│   │   ├── page.tsx              # Tools index
│   │   └── writer/page.tsx       # Content generation
│   ├── settings/page.tsx         # Account settings
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts    # POST: authenticate user
│       │   ├── register/route.ts # POST: create account
│       │   ├── logout/route.ts   # POST: clear cookie
│       │   └── me/route.ts       # GET: current user + usage
│       ├── chat/route.ts         # POST: stream AI response | GET: chat history
│       └── generate/route.ts     # POST: one-shot content generation
├── components/
│   └── layout/
│       └── Sidebar.tsx           # App sidebar with navigation
├── lib/
│   ├── auth.ts                   # JWT sign/verify, bcrypt, getCurrentUser
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
├── store/
│   └── chat.ts                   # Zustand store for chat state
└── middleware.ts                  # Route protection
```

---

## Database Schema

```
User         — id, name, email, password (bcrypt), plan, avatar
Chat         — id, userId, title
Message      — id, chatId, userId, role (user|assistant), content
Usage        — id, userId, type, tokens, createdAt
```

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/subrosa5/aria.git
cd aria

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, GROQ_API_KEY

# 4. Push database schema
npx prisma db push

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct DB URL for Prisma migrations |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GROQ_API_KEY` | Groq API key from console.groq.com (free) |

> Without `GROQ_API_KEY` the app runs in **demo mode** — all UI works, AI returns a placeholder response.

---

## Streaming Implementation

The chat uses a custom SSE stream built with the Web `ReadableStream` API:

```ts
// Server sends events as: data: {"delta": "token"}\n\n
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
const stream = new ReadableStream({
  async start(controller) {
    const result = streamText({ model: groq("llama-3.1-8b-instant"), messages });
    for await (const delta of (await result).textStream) {
      controller.enqueue(encode(`data: ${JSON.stringify({ delta })}\n\n`));
    }
    controller.enqueue(encode("data: [DONE]\n\n"));
    controller.close();
  }
});
```

The client reads the stream token by token and updates the Zustand store, causing React to re-render each new character in real time.

---

## Deployment

Deployed on **Vercel** (Hobby plan, free).
Database hosted on **Neon** (serverless PostgreSQL, free tier).

```bash
npx vercel --prod
```
