"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderWidget() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const handleUseCurrent = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported on this device.");
      return;
    }
    setMapError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocation("Current location (Auto-detected)");
      },
      () => {
        setMapError("Unable to fetch current location.");
      }
    );
  };

  const handlePickFromMap = () => {
    setIsMapOpen(true);
  };

  const handleConfirmPin = () => {
    setLocation(
      coords
        ? `Pinned location (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`
        : location || "Pinned location (Exact spot)"
    );
    setIsMapOpen(false);
  };

  const handleSearchLocation = async () => {
    if (!location.trim()) return;
    setIsSearching(true);
    setMapError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const results = (await response.json()) as Array<{
        lat: string;
        lon: string;
      }>;
      if (!results.length) {
        throw new Error("Location not found.");
      }
      setCoords({ lat: Number(results[0].lat), lng: Number(results[0].lon) });
      setIsMapOpen(true);
    } catch (error) {
      setMapError(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const mapSrc = useMemo(() => {
    if (!coords) return null;
    const delta = 0.01;
    const left = coords.lng - delta;
    const right = coords.lng + delta;
    const top = coords.lat + delta;
    const bottom = coords.lat - delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
  }, [coords]);

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_rgba(20,6,40,0.35)]">
        <h3 className="text-lg font-semibold text-white">Schedule an Order</h3>
        <label className="mt-4 flex flex-col gap-2 text-sm text-white/70">
          <span>Delivery Location</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter location"
            className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:text-white" onClick={handleUseCurrent}>
            Use my location
          </button>
          <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:text-white" onClick={handlePickFromMap}>
            Pick on map
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:text-white disabled:opacity-50"
            onClick={handleSearchLocation}
            disabled={isSearching}
          >
            {isSearching ? "Searching..." : "Search location"}
          </button>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm text-white/70">
          <span>Date</span>
          <input type="date" className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white focus:border-white/30 focus:outline-none" />
        </label>
        <label className="mt-4 flex flex-col gap-2 text-sm text-white/70">
          <span>Time Window</span>
          <input placeholder="12:00 - 14:00" className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none" />
        </label>
        <button
          className="mt-6 w-full rounded-full bg-[#2dd4bf] px-4 py-3 text-sm font-semibold text-[#0d0a14] hover:opacity-90"
          type="button"
          onClick={() => router.push("/buyer")}
        >
          Find Food
        </button>
      </div>

      {isMapOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#120c1c] p-6 shadow-[0_24px_60px_rgba(20,6,40,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Pick a delivery pin</h3>
                <p className="text-sm text-white/60">Drag the pin to your exact drop-off point.</p>
                {mapError ? <p className="text-sm text-red-400">{mapError}</p> : null}
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white" onClick={() => setIsMapOpen(false)}>
                Close
              </button>
            </div>
            <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-xl border border-white/10 bg-black/20 text-sm text-white/60">
              {mapSrc ? (
                <iframe title="Delivery map" className="h-[280px] w-full rounded-xl" src={mapSrc} />
              ) : (
                <div className="text-center">
                  <div className="text-2xl">📍</div>
                  <p>Search or use current location to load the map.</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white" onClick={() => setIsMapOpen(false)}>
                Cancel
              </button>
              <button className="rounded-full bg-[#2dd4bf] px-4 py-2 text-sm font-semibold text-[#0d0a14]" onClick={handleConfirmPin}>
                Use this location
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
