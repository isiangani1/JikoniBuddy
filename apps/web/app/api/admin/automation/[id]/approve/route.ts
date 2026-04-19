import { NextRequest, NextResponse } from "next/server";

const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

function getApiKey() {
  return process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const baseUrl = getGatewayBaseUrl();
  const body = await request.json();
  const apiKey = getApiKey();
  const res = await fetch(
    `${baseUrl}/api/admin/automation/executions/${context.params.id}/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {})
      },
      body: JSON.stringify(body)
    }
  );
  const text = await res.text();
  return new NextResponse(text, { status: res.status });
}
