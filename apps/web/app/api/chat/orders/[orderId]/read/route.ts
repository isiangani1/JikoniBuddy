import { NextResponse } from "next/server";

const baseUrl =
  process.env.API_GATEWAY_URL ??
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ??
  "http://127.0.0.1:4000";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const payload = await request.json().catch(() => ({}));
  const res = await fetch(`${baseUrl}/api/chat/orders/${params.orderId}/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
