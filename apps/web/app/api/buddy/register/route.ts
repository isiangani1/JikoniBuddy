import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const buddyServiceUrl =
    process.env.BUDDY_SERVICE_URL ?? process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL;

  if (!buddyServiceUrl) {
    return NextResponse.json(
      { error: "Buddy service URL not configured." },
      { status: 500 }
    );
  }

  const response = await fetch(`${buddyServiceUrl}/buddy/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to register buddy." },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
