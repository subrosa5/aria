import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
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

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || groqKey === "your-groq-api-key-here") {
    return NextResponse.json({
      result: `[Demo Mode] Generated ${type} content for: "${prompt}"\n\nAdd your free GROQ_API_KEY from console.groq.com to enable real AI generation.`,
    });
  }

  const groq = createGroq({ apiKey: groqKey });
  const systemPrompt = prompts[type] + (tone ? ` Tone: ${tone}.` : "");

  const { text: content } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    system: systemPrompt,
    prompt,
    maxOutputTokens: 2048,
  });

  await prisma.usage.create({ data: { userId: user.id, type, tokens: content.length } });

  return NextResponse.json({ result: content });
}
