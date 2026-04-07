import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const upstream = new URL("https://nominatim.openstreetmap.org/search");
  upstream.searchParams.set("q", query);
  upstream.searchParams.set("format", "json");
  upstream.searchParams.set("limit", "5");
  upstream.searchParams.set("addressdetails", "1");

  const res = await fetch(upstream.toString(), {
    headers: {
      "User-Agent": "JikoniBuddy/1.0",
      "Accept-Language": "en"
    },
    cache: "no-store"
  });

  const data = await res.json().catch(() => []);
  const results = Array.isArray(data)
    ? data.map((item: any) => ({
        label: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon)
      }))
    : [];

  return NextResponse.json({ results });
}
