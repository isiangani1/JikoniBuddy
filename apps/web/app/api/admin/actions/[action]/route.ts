import { NextRequest, NextResponse } from "next/server";

const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

const actionMap: Record<string, string> = {
  "refund-order": "refund-order",
  "reassign-buddy": "reassign-buddy",
  "credit-wallet": "credit-wallet",
  "freeze-user": "freeze-user"
};

export async function POST(
  request: NextRequest,
  { params }: { params: { action: string } }
) {
  const target = actionMap[params.action];
  if (!target) {
    return NextResponse.json({ ok: false, message: "Unsupported admin action." }, { status: 404 });
  }

  const baseUrl = getGatewayBaseUrl();
  const body = await request.json();
  const apiKey = process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();

  const res = await fetch(`${baseUrl}/api/admin/actions/${target}`, {
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
