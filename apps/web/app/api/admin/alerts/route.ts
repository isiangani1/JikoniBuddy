import { NextRequest, NextResponse } from "next/server";

const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

export async function GET(request: NextRequest) {
  const baseUrl = getGatewayBaseUrl();
  const url = new URL(request.url);
  const apiKey = process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();
  const res = await fetch(`${baseUrl}/api/admin/alerts?${url.searchParams.toString()}`, {
    headers: apiKey ? { "x-api-key": apiKey } : undefined
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}

export async function POST(request: NextRequest) {
  const baseUrl = getGatewayBaseUrl();
  const body = await request.json();
  const apiKey = process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();
  const res = await fetch(`${baseUrl}/api/admin/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {})
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
