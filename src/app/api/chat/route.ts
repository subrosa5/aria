import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messages, chatId } = await req.json();

  let activeChatId = chatId;
  if (!activeChatId) {
    const chat = await prisma.chat.create({ data: { userId: user.id, title: "New Chat" } });
    activeChatId = chat.id;
  }

  const lastUserMsg = messages[messages.length - 1]?.content || "";
  await prisma.message.create({
    data: { chatId: activeChatId, userId: user.id, role: "user", content: lastUserMsg },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chatId: activeChatId })}\n\n`));

      let fullContent = "";
      try {
        const groqKey = process.env.GROQ_API_KEY;
        if (!groqKey || groqKey === "your-groq-api-key-here") {
          const demo = "Hi! I'm Aria. To enable real AI responses, add your GROQ_API_KEY (free at console.groq.com). Currently running in demo mode.";
          for (const char of demo) {
            fullContent += char;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: char })}\n\n`));
            await new Promise((r) => setTimeout(r, 12));
          }
        } else {
          const groq = createGroq({ apiKey: groqKey });
          const result = streamText({
            model: groq("llama-3.1-8b-instant"),
            system: "You are Aria, a helpful and friendly AI assistant. Be concise and professional.",
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            maxOutputTokens: 1024,
          });

          for await (const delta of (await result).textStream) {
            fullContent += delta;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
          }
        }

        await prisma.message.create({
          data: { chatId: activeChatId, userId: user.id, role: "assistant", content: fullContent },
        });

        await prisma.usage.create({ data: { userId: user.id, type: "chat", tokens: fullContent.length } });

        if (messages.length === 1) {
          const title = lastUserMsg.slice(0, 40) + (lastUserMsg.length > 40 ? "..." : "");
          await prisma.chat.update({ where: { id: activeChatId }, data: { title } });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ title })}\n\n`));
        }
      } catch (e) {
        console.error(e);
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chats = await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ chats });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = await req.json();
  if (!chatId) return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

  const chat = await prisma.chat.findFirst({ where: { id: chatId, userId: user.id } });
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.message.deleteMany({ where: { chatId } });
  await prisma.chat.delete({ where: { id: chatId } });

  return NextResponse.json({ ok: true });
}
