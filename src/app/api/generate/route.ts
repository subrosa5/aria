import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["blog", "email", "social", "code"]),
  prompt: z.string().min(5),
  tone: z.string().optional(),
});

const prompts: Record<string, string> = {
  blog: "Write a professional blog post about the following topic. Include an engaging title, introduction, 3-4 sections with headers, and a conclusion:",
  email: "Write a professional email about the following topic. Include subject line, greeting, body, and sign-off:",
  social: "Write an engaging social media post (Twitter/LinkedIn) about the following topic. Keep it concise and include relevant hashtags:",
  code: "Write clean, well-commented code for the following requirement. Include explanation of how it works:",
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { type, prompt, tone } = result.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-anthropic-api-key-here") {
    return NextResponse.json({
      result: `[Demo Mode] Generated ${type} content for: "${prompt}"\n\nTo enable real AI generation, add your ANTHROPIC_API_KEY to environment variables.\n\nThis is a placeholder showing where AI-generated content would appear. The actual integration uses Claude claude-sonnet-4-6 via streaming API.`,
    });
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = prompts[type] + (tone ? ` Tone: ${tone}.` : "");

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: `${systemPrompt}\n\n${prompt}` }],
  });

  const content = message.content[0].type === "text" ? message.content[0].text : "";

  await prisma.usage.create({ data: { userId: user.id, type, tokens: content.length } });

  return NextResponse.json({ result: content });
}
