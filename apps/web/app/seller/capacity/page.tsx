"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function CapacityManager() {
  const queryClient = useQueryClient();
  const [sellerId, setSellerId] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    maxOrdersPerHour: 20,
    prepBufferMinutes: 15,
    autoBuddyScaling: true,
    isAcceptingOrders: true,
    operatingHoursOpen: "08:00",
    operatingHoursClose: "22:00"
  });

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { isLoading } = useQuery({
    queryKey: ["sellerCapacity", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to load capacity settings");
      const data = await res.json();
      setSettings(data);
      return data;
    },
    enabled: !!sellerId
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const res = await fetch(`/api/seller/capacity?sellerId=${sellerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      alert("Smart Capacity Engine settings updated!");
      queryClient.invalidateQueries({ queryKey: ["sellerCapacity", sellerId] });
    }
  });

  const handleToggle = (field: keyof typeof settings) => {
    const nextSettings = { ...settings, [field]: !settings[field] };
    setSettings(nextSettings);
    saveSettingsMutation.mutate(nextSettings);
  };

  if (isLoading) return <p className="p-8 text-white">Loading capacity profile...</p>;

  return (
    <main className="p-4 sm:p-6 max-w-3xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Logistics & Load</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white m-0">Smart Capacity Engine</h1>
        <p className="text-white/60 text-sm sm:text-base">
          Control exactly how much load your kitchen can take. If the threshold is breached, the engine will either
          stop orders or automatically broadcast an SOS to the Buddy Pool based on your preferences.
        </p>
      </header>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white m-0">Working Hours</h3>
          <p className="text-white/60 text-sm">
            Define the hours your kitchen is visibly online and accepting incoming orders.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Kitchen Opens At</label>
            <input
              type="time"
              value={settings.operatingHoursOpen}
              onChange={(e) => setSettings({ ...settings, operatingHoursOpen: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">Kitchen Closes At</label>
            <input
              type="time"
              value={settings.operatingHoursClose}
              onChange={(e) => setSettings({ ...settings, operatingHoursClose: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white m-0">Live Store Status</h3>
            <p className="text-white/60 text-sm">Manually pause all incoming requests right now.</p>
          </div>
          <button
            onClick={() => handleToggle("isAcceptingOrders")}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              settings.isAcceptingOrders
                ? "bg-teal-400 text-[#1a1026]"
                : "bg-white/10 text-white"
            }`}
          >
            {settings.isAcceptingOrders ? "ACCEPTING ORDERS" : "PAUSED"}
          </button>
        </div>

        <div className="grid gap-6 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-white m-0">Max Orders Per Time Slot</h3>
            <p className="text-white/60 text-sm">
              If active orders exceed this number within a rolling hour, capacity is breached.
            </p>
            <input
              type="number"
              value={settings.maxOrdersPerHour}
              onChange={(e) => setSettings({ ...settings, maxOrdersPerHour: parseInt(e.target.value) || 20 })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-white m-0">Prep Time Buffer (Minutes)</h3>
            <p className="text-white/60 text-sm">How much extra cushion time to add to each order globally.</p>
            <input
              type="number"
              value={settings.prepBufferMinutes}
              onChange={(e) => setSettings({ ...settings, prepBufferMinutes: parseInt(e.target.value) || 15 })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-teal-400/60 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section
        className={`rounded-2xl p-6 sm:p-8 flex flex-col gap-4 border transition-colors ${
          settings.autoBuddyScaling
            ? "bg-purple-500/10 border-purple-400/40"
            : "bg-white/5 border-white/10"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="max-w-lg">
            <h3 className={`text-lg font-semibold m-0 ${settings.autoBuddyScaling ? "text-purple-200" : "text-white"}`}>
              Auto-Trigger Buddy Pool
            </h3>
            <p className="text-white/70 text-sm mt-2">
              When “Max Orders” is breached, the system will instantly publish an SOS request to nearby available
              Buddies instead of rejecting customer orders.
            </p>
          </div>
          <button
            onClick={() => handleToggle("autoBuddyScaling")}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              settings.autoBuddyScaling
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            {settings.autoBuddyScaling ? "ENABLED" : "DISABLED"}
          </button>
        </div>
      </section>

      <button
        className="w-full px-5 py-3 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity"
        onClick={() => saveSettingsMutation.mutate(settings)}
        disabled={saveSettingsMutation.isPending}
      >
        {saveSettingsMutation.isPending ? "Saving..." : "Save Smart Logic Thresholds"}
      </button>
    </main>
  );
}
