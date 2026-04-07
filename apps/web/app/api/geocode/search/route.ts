import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const res = await fetch(
    `${baseUrl}/api/geolocation/geocode/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  const data = await res.json().catch(() => ({ results: [] }));
  return NextResponse.json(data);
}
