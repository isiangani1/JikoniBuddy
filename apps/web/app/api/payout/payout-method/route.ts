import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const body = await request.json();

  const res = await fetch(`${baseUrl}/api/payout/payout-method`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(request: Request) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "";

  const res = await fetch(`${baseUrl}/api/payout/payout-method?userId=${userId}`);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
