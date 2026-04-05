import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const body = await request.json();

  const res = await fetch(`${baseUrl}/api/payout/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
