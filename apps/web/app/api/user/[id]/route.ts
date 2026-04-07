import { NextRequest, NextResponse } from "next/server";

const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const baseUrl = getGatewayBaseUrl();
  const res = await fetch(`${baseUrl}/api/user/users/${context.params.id}`);
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const baseUrl = getGatewayBaseUrl();
  const body = await request.json();
  const res = await fetch(`${baseUrl}/api/user/users/${context.params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
