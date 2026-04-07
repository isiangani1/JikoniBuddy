"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { sellers } from "@/data/sellers";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";

type SortKey = "rating" | "eta" | "price";

function parsePriceRange(range: string) {
  // expects something like "KES 350-900"
  const match = range.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { min: Number.POSITIVE_INFINITY, max: Number.POSITIVE_INFINITY };
  return { min: Number(match[1]), max: Number(match[2]) };
}

function parseEtaMinutes(eta: string) {
  // expects something like "30-45 min"
  const match = eta.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]);
}

export default function BuyerSellerListingPage() {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<"all" | "available_now">("all");
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [showMap, setShowMap] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    Promise.all(
      sellers.map(async (seller) => {
        try {
          const res = await fetch(`/api/seller/availability?sellerId=${seller.id}`);
          const data = await res.json();
          return [seller.id, data?.profile?.isAcceptingOrders !== false] as const;
        } catch {
          return [seller.id, true] as const;
        }
      })
    ).then((entries) => {
      if (!active) return;
      setAvailabilityMap(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = sellers.filter((seller) => {
      const matchesQuery =
        !q ||
        seller.name.toLowerCase().includes(q) ||
        seller.services.some((service) => service.toLowerCase().includes(q)) ||
        seller.products.some((product) => product.name.toLowerCase().includes(q));

      const isAccepting = availabilityMap[seller.id] !== false;
      const matchesAvailability =
        availability === "all"
          ? true
          : isAccepting;

      return matchesQuery && matchesAvailability;
    });

    const sorted = [...base].sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "eta") return parseEtaMinutes(a.eta) - parseEtaMinutes(b.eta);
      const ap = parsePriceRange(a.priceRange);
      const bp = parsePriceRange(b.priceRange);
      return ap.min - bp.min;
    });

    return sorted;
  }, [availability, query, sortKey]);

  const mapCenter = filtered.length
    ? [filtered[0].lat, filtered[0].lng]
    : [-1.286389, 36.817223];

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 min-w-0">
      <aside className="w-full md:w-[280px] shrink-0 flex flex-col gap-6">
        <div className="text-xl font-bold text-white">Discover</div>

        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px] m-0">Search</h4>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sellers, meals, services..."
            className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px] m-0">Availability</h4>
          <div className="flex flex-col gap-1">
            <button
              className={`text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${availability === "all" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              type="button"
              onClick={() => setAvailability("all")}
            >
              All
            </button>
            <button
              className={`text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${availability === "available_now" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              type="button"
              onClick={() => setAvailability("available_now")}
            >
              Available now
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px] m-0">Sort by</h4>
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium appearance-none"
          >
            <option value="rating">Top rated</option>
            <option value="eta">Fastest delivery</option>
            <option value="price">Lowest price</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px] m-0">Map view</h4>
          <button
            className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            type="button"
            onClick={() => setShowMap((value) => !value)}
          >
            <span className="text-lg">🗺️</span> {showMap ? "Hide map" : "Show map"}
          </button>
          <p className="text-white/40 text-xs mt-1 m-0">
            Map is a placeholder for later Google Maps integration.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10">
          <Link className="flex justify-center w-full py-3 px-4 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-white font-medium transition-colors" href="/buyer">
            Back to dashboard
          </Link>
        </div>
      </aside>

      <section className="flex-1 flex flex-col gap-8 min-w-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex flex-col gap-2">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-sm m-0">Seller discovery</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Browse sellers</h1>
            <p className="text-white/70 m-0 text-lg max-w-xl">
              Compare sellers by rating, delivery time, price range, and
              availability.
            </p>
          </div>
          <div className="flex">
            <button 
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors whitespace-nowrap shadow-lg shadow-purple-500/20" 
              type="button" 
              onClick={() => router.push("/buyer")}
            >
              Schedule an order
            </button>
          </div>
        </div>

        {showMap ? (
          <section className="animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Map view</h2>
            <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden h-[320px]">
              <MapContainer
                center={mapCenter as [number, number]}
                zoom={13}
                className="h-full w-full bg-[#0e0814]"
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filtered.map((seller) => (
                  <Marker key={seller.id} position={[seller.lat, seller.lng]}>
                    <Popup>
                      <strong>{seller.name}</strong>
                      <br />
                      {seller.availability}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <h2 className="text-xl font-bold text-white m-0">Results <span className="text-white/50 font-normal">({filtered.length})</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((seller) => (
              <Link
                key={seller.id}
                href={`/buyer/sellers/${seller.id}`}
                className="relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 transition-all hover:-translate-y-1 hover:border-purple-500/45 p-6 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/40 to-teal-500/40 border-2 border-white/10 flex-shrink-0 flex items-center justify-center text-xl shadow-md text-white font-bold">
                     {seller.name.charAt(0)}
                  </div>
                  <div className="flex flex-col overflow-hidden w-full">
                    <h3 className="text-[17px] font-bold text-white m-0 mb-1 truncate group-hover:text-purple-300 transition-colors">{seller.name}</h3>
                    <p className="text-xs font-semibold text-yellow-500 m-0 mb-1 flex items-center gap-1">
                      <span>★</span> {seller.rating.toFixed(1)} <span className="text-white/30 mx-1">·</span> <span className="text-white/70">{seller.eta}</span>
                    </p>
                    <p className="text-white/60 text-[13px] m-0 truncate">{seller.priceRange}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wider m-0 ${
                      availabilityMap[seller.id] === false ? "text-white/40" : "text-green-400"
                    }`}
                  >
                    {availabilityMap[seller.id] === false ? "Paused" : seller.availability}
                  </p>
                  <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all">View menu</span>
                </div>
              </Link>
            ))}
            
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-[24px] flex flex-col items-center gap-3">
                 <span className="text-4xl opacity-30">🔍</span>
                 <p className="text-white/60 text-lg m-0">No sellers match your criteria.</p>
                 <button className="text-purple-400 hover:text-purple-300 underline font-medium mt-2" onClick={() => { setQuery(""); setAvailability("all"); }}>Clear filters</button>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
