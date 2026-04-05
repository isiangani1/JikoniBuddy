import { NextResponse } from "next/server";
const baseUrl =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get("sellerId");
  
  if (!sellerId) return NextResponse.json({ error: "Missing sellerId" }, { status: 400 });

  try {
    const walletRes = await fetch(
      `${baseUrl}/api/payout/wallet?userId=${sellerId}&type=seller`
    );
    const txRes = await fetch(
      `${baseUrl}/api/payout/transactions?userId=${sellerId}&type=seller`
    );

    if (!walletRes.ok || !txRes.ok) {
      return NextResponse.json({ error: "Failed to load payouts" }, { status: 502 });
    }

    const wallet = await walletRes.json();
    const transactions = await txRes.json();
    return NextResponse.json({
      wallet,
      transactions,
      totalBalance: wallet?.balance ?? 0,
      pendingBalance: wallet?.pendingBalance ?? 0
    });
  } catch (error) {
    console.error("Failed to fetch financials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle Payout Request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${baseUrl}/api/payout/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Payout failed" }, { status: 500 });
  }
}
