import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, plan: true, avatar: true, createdAt: true },
  });
  if (!dbUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const usageCount = await prisma.usage.count({
    where: { userId: user.id, createdAt: { gte: new Date(new Date().setDate(1)) } },
  });

  return NextResponse.json({ user: dbUser, usage: usageCount });
}
