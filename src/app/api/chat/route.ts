import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey || apiKey === "your-anthropic-api-key-here") {
          const demo = "I'm Aria, your AI assistant! To enable real AI responses, please add your Anthropic API key to the environment variables. For now, I'm running in demo mode.";
          for (const char of demo) {
            fullContent += char;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: char })}\n\n`));
            await new Promise((r) => setTimeout(r, 10));
          }
        } else {
          const response = await client.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: "You are Aria, a helpful AI assistant. Be concise, friendly, and professional.",
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
          });

          for await (const chunk of response) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const text = chunk.delta.text;
              fullContent += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
            }
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
