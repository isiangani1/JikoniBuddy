import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    role?: string;
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    skills?: Array<"cooking" | "packaging" | "delivery">;
    location?: { lat: number; lng: number; label: string };
    radiusKm?: number;
    idNumber?: string;
  };

  const role = payload.role ?? "buyer";
  const buddyServiceUrl =
    process.env.BUDDY_SERVICE_URL ?? process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL;

  if (role === "buddy") {
    if (!buddyServiceUrl) {
      return NextResponse.json(
        { error: "Buddy service URL not configured." },
        { status: 500 }
      );
    }

    try {
      // Use 127.0.0.1 instead of localhost for better stability in Node 18+ environments
      const targetUrl = buddyServiceUrl.replace("localhost", "127.0.0.1");
      const response = await fetch(`${targetUrl}/buddy/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.message || "Unable to register buddy." },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json({ role: "buddy", buddy: data });
    } catch (err: any) {
      console.error("Buddy Service Connectivity Error:", err);
      return NextResponse.json(
        { error: `Buddy Service is unreachable at ${buddyServiceUrl}. Ensure it is running on port 4005.` },
        { status: 503 }
      );
    }
  }

  try {
    const passwordHash = hashSync(payload.password ?? "password123", 10);
    const userRole = role === "seller" ? "seller" : "buyer";

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email!,
        phone: payload.phone!,
        passwordHash,
        role: userRole as any,
        ...(userRole === "seller" && {
          sellerProfile: { create: { businessName: payload.name } }
        }),
        ...(userRole === "buyer" && {
          buyerProfile: { create: {} }
        })
      }
    });

    return NextResponse.json({ role: user.role, userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Email or phone may already be in use." },
      { status: 400 }
    );
  }
}

