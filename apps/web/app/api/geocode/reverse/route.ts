import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  if (!lat || !lng) {
    return NextResponse.json({ label: null }, { status: 400 });
  }

  const upstream = new URL("https://nominatim.openstreetmap.org/reverse");
  upstream.searchParams.set("lat", lat);
  upstream.searchParams.set("lon", lng);
  upstream.searchParams.set("format", "json");

  const res = await fetch(upstream.toString(), {
    headers: {
      "User-Agent": "JikoniBuddy/1.0",
      "Accept-Language": "en"
    },
    cache: "no-store"
  });

  const data = await res.json().catch(() => ({}));
  const label = data?.display_name ?? null;

  return NextResponse.json({ label });
}
