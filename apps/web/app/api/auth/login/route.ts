import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.toLowerCase() ?? "";
  const password = body.password ?? "";

  const buddyServiceUrl =
    process.env.BUDDY_SERVICE_URL ?? process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL;

  if (buddyServiceUrl && email && password) {
    try {
      const response = await fetch(`${buddyServiceUrl}/buddy/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store"
      });

      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        if (data?.role === "buddy") {
          return NextResponse.json({ role: "buddy", buddy: data });
        }
      }
    } catch {
      // Intentionally swallow error to fallback to local DB lookup
    }
  }

  // Lookup in local DB
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    if (compareSync(password, (user as any).passwordHash)) {
      return NextResponse.json({ role: user.role, userId: user.id });
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
