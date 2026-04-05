import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const paymentServiceUrl =
    process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:4008";

  try {
    const res = await fetch(`${paymentServiceUrl}/payments/c2b/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Payment callback forwarding failed:", error);
    return NextResponse.json(
      { error: "Callback forwarding failed." },
      { status: 500 }
    );
  }
}
