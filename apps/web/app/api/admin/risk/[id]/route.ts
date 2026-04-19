import { NextResponse } from "next/server";

const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const baseUrl = getGatewayBaseUrl();
  const apiKey = process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();
  const res = await fetch(`${baseUrl}/api/admin/risk/users/${context.params.id}`, {
    headers: apiKey ? { "x-api-key": apiKey } : undefined
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
