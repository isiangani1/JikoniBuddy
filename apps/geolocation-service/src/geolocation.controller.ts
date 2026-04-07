import { Controller, Get, Query } from "@nestjs/common";

@Controller("geocode")
export class GeolocationController {
  @Get("search")
  async search(@Query("q") query?: string) {
    if (!query?.trim()) return { results: [] };

    const upstream = new URL("https://nominatim.openstreetmap.org/search");
    upstream.searchParams.set("q", query.trim());
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

    return { results };
  }

  @Get("reverse")
  async reverse(@Query("lat") lat?: string, @Query("lng") lng?: string) {
    if (!lat || !lng) return { label: null };

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

    return { label };
  }
}
