import { NextResponse } from "next/server";
type PaymentRequest = {
  userId?: string | null;
  amount?: number;
  method?: "mpesa" | "cash";
  phone?: string;
  orderId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PaymentRequest;
  const amount = typeof body.amount === "number" ? body.amount : null;

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Invalid amount." },
      { status: 400 }
    );
  }

  try {
    const paymentServiceUrl =
      process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:4008";
    const res = await fetch(`${paymentServiceUrl}/payments/c2b/stk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: body.userId,
        amount,
        method: body.method ?? "mpesa",
        phone: body.phone,
        orderId: body.orderId
      })
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Failed to create payment record:", error);
    return NextResponse.json(
      { error: "Failed to create payment record." },
      { status: 500 }
    );
  }
}
