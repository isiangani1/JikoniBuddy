import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");

  const url = new URL(`${baseUrl}/api/payout/transactions`);
  if (userId) url.searchParams.set("userId", userId);
  if (type) url.searchParams.set("type", type);

  const res = await fetch(url.toString());
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
