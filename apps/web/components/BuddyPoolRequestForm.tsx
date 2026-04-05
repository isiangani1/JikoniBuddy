"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const taskOptions = [
  { label: "Cooking", value: "cooking" },
  { label: "Packaging", value: "packaging" },
  { label: "Delivery Help", value: "delivery" }
];

type BuddyPoolRequestFormProps = {
  onSuccess?: (requestId: string) => void;
  sellerId?: string;
};

export default function BuddyPoolRequestForm({ onSuccess, sellerId: defaultSellerId }: BuddyPoolRequestFormProps = {}) {
  const [status, setStatus] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [mapError, setMapError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const form = new FormData(event.currentTarget);

    const payload = {
      sellerId: String(form.get("sellerId") ?? defaultSellerId ?? "seller-1"),
      taskType: String(form.get("taskType") ?? "cooking"),
      location: {
        label: String(form.get("location") ?? "Nairobi"),
        lat: Number(form.get("lat") ?? -1.286389),
        lng: Number(form.get("lng") ?? 36.817223)
      },
      timeWindow: {
        start: `${form.get("date")}T${form.get("startTime")}:00.000Z`,
        end: `${form.get("date")}T${form.get("endTime")}:00.000Z`
      },
      durationHours: Number(form.get("durationHours") ?? 2),
      compensation: Number(form.get("compensation") ?? 0) || undefined
    };

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      const response = await fetch(`${baseUrl}/api/buddy/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to create request.");
      }

      const data = await response.json();
      setStatus("Request created and matching started.");
      event.currentTarget.reset();
      
      if (onSuccess && data.request && data.request.id) {
        onSuccess(data.request.id);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Request failed.");
    }
  };

  const handleUseCurrent = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported on this device.");
      return;
    }
    setMapError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(next);
        setIsMapOpen(true);
      },
      () => setMapError("Unable to fetch current location.")
    );
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
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Seller ID</span>
          <input 
            name="sellerId" 
            defaultValue={defaultSellerId} 
            placeholder="seller-1" 
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
        
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Task type</span>
          <select 
            name="taskType"
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/50 outline-none transition-all appearance-none"
          >
            {taskOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Location label</span>
          <input 
            name="location" 
            placeholder="Westlands, Nairobi" 
            required 
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
        
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all active:scale-95" 
            onClick={handleUseCurrent}
          >
            📍 Use my location
          </button>
          <button 
            type="button" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all active:scale-95" 
            onClick={() => setIsMapOpen(true)}
          >
            🗺️ Pick on map
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <label className="flex flex-col gap-1.5 text-xs text-white/40 uppercase font-bold tracking-widest px-1">
            <span>Latitude</span>
            <input 
              name="lat" 
              type="number" 
              step="0.000001" 
              required 
              className="bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-purple-500/50"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-white/40 uppercase font-bold tracking-widest px-1">
            <span>Longitude</span>
            <input 
              name="lng" 
              type="number" 
              step="0.000001" 
              required 
              className="bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-purple-500/50"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Date</span>
          <input 
            name="date" 
            type="date" 
            required 
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Start time</span>
          <input 
            name="startTime" 
            type="time" 
            required 
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">End time</span>
          <input 
            name="endTime" 
            type="time" 
            required 
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Duration (hours)</span>
          <input 
            name="durationHours" 
            type="number" 
            min="1" 
            required 
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-white/70 ml-1">Compensation (Optional)</span>
          <input 
            name="compensation" 
            type="number" 
            min="0" 
            placeholder="KES"
            className="w-full bg-[#0d0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:border-purple-500/50 outline-none transition-all"
          />
        </label>
      </div>

      {status && (
        <div className={`p-4 rounded-xl text-sm font-medium ${status.includes("failed") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
          {status}
        </div>
      )}

      <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95 text-lg mt-4">
        Submit Buddy Request
      </button>

      {isMapOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300" onClick={() => setIsMapOpen(false)}>
          <div className="w-full max-w-2xl bg-[#12021f] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white m-0">Select delivery location</h3>
                <p className="text-white/50 text-sm m-0 mt-1">Pin the exact spot for the helper.</p>
                {mapError ? <p className="text-red-400 text-xs font-bold mt-2 m-0 uppercase tracking-widest">{mapError}</p> : null}
              </div>
              <button 
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white" 
                onClick={() => setIsMapOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black/40 relative flex items-center justify-center">
              {mapSrc ? (
                <iframe title="Buddy map" className="w-full h-full border-none opacity-80" src={mapSrc} />
              ) : (
                <div className="flex flex-col items-center gap-3 text-white/30">
                  <span className="text-4xl">📍</span>
                  <p className="font-bold text-sm">Waiting for location...</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-white/5 flex justify-end gap-3">
              <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all" onClick={() => setIsMapOpen(false)}>
                Cancel
              </button>
              <button className="px-6 py-3 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all active:scale-95" onClick={() => setIsMapOpen(false)}>
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
