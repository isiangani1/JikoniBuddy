import { NextResponse } from "next/server";

const baseUrl =
  process.env.API_GATEWAY_URL ??
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ??
  "http://127.0.0.1:4000";

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const url = new URL(`${baseUrl}/api/chat/orders/${params.orderId}/messages`);
  const incoming = new URL(request.url);
  incoming.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const body = await request.json();
  const res = await fetch(`${baseUrl}/api/chat/orders/${params.orderId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
