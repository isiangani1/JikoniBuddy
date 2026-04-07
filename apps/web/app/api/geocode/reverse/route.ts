import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  if (!lat || !lng) {
    return NextResponse.json({ label: null }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const res = await fetch(
    `${baseUrl}/api/geolocation/geocode/reverse?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
    { cache: "no-store" }
  );
  const data = await res.json().catch(() => ({ label: null }));
  return NextResponse.json(data);
}
