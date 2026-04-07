"use client";

import { useEffect, useState } from "react";

export default function SellerAvailabilityOverride() {
  const [sellerId, setSellerId] = useState("");
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [operatingHoursOpen, setOperatingHoursOpen] = useState("08:00");
  const [operatingHoursClose, setOperatingHoursClose] = useState("22:00");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerId.trim()) return;
    let active = true;
    fetch(`/api/seller/availability?sellerId=${encodeURIComponent(sellerId.trim())}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.profile) return;
        setIsAcceptingOrders(data.profile.isAcceptingOrders ?? true);
        setOperatingHoursOpen(data.profile.operatingHoursOpen ?? "08:00");
        setOperatingHoursClose(data.profile.operatingHoursClose ?? "22:00");
      })
      .catch(() => null);
    return () => {
      active = false;
    };
  }, [sellerId]);

  const handleSave = async () => {
    if (!sellerId.trim()) {
      setStatus("Enter a seller ID first.");
      return;
    }
    setStatus("Saving...");
    const res = await fetch(`/api/seller/availability?sellerId=${encodeURIComponent(sellerId.trim())}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isAcceptingOrders,
        operatingHoursOpen,
        operatingHoursClose
      })
    });
    if (!res.ok) {
      setStatus("Failed to update availability.");
      return;
    }
    setStatus("Availability updated.");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white m-0">Seller availability override</h2>
        <p className="text-white/60 text-sm m-0">Admin override for seller online status and hours.</p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Seller ID</span>
        <input
          value={sellerId}
          onChange={(event) => setSellerId(event.target.value)}
          placeholder="seller-123"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Open</span>
          <input
            type="time"
            value={operatingHoursOpen}
            onChange={(event) => setOperatingHoursOpen(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Close</span>
          <input
            type="time"
            value={operatingHoursClose}
            onChange={(event) => setOperatingHoursClose(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => setIsAcceptingOrders((value) => !value)}
        className={`px-4 py-2 rounded-xl font-semibold transition-colors w-full sm:w-auto ${
          isAcceptingOrders ? "bg-teal-400 text-[#1a1026]" : "bg-white/10 text-white"
        }`}
      >
        {isAcceptingOrders ? "ACCEPTING ORDERS" : "PAUSED"}
      </button>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity"
        >
          Save override
        </button>
        {status ? <span className="text-xs text-white/60">{status}</span> : null}
      </div>
    </div>
  );
}
