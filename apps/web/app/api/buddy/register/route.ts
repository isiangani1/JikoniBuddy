import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const gatewayUrl =
    process.env.API_GATEWAY_URL ?? process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  if (!gatewayUrl) {
    return NextResponse.json(
      { error: "API Gateway URL not configured." },
      { status: 500 }
    );
  }

  const response = await fetch(`${gatewayUrl}/api/buddy/auth/register`, {
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
