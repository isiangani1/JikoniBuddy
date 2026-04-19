"use client";

import { useEffect, useMemo, useState } from "react";

type AlertEvent = {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  createdAt: string;
  source?: string | null;
};

const statusChips = [
  { label: "Healthy", tone: "bg-emerald-500/20 text-emerald-200" },
  { label: "Stressed", tone: "bg-amber-500/20 text-amber-200" },
  { label: "Failing", tone: "bg-rose-500/20 text-rose-200" }
];

export default function CommandCenterPage() {
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch("/api/admin/alerts?status=open")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!active) return;
        setEvents(data ?? []);
      })
      .catch(() => null)
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const latest = useMemo(() => events.slice(0, 6), [events]);

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#1b0f2d] via-[#12021f] to-[#0b0613] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 m-0">Live Command Center</p>
        <h1 className="text-3xl font-semibold text-white m-0 mt-2">Ops War Room</h1>
        <p className="text-white/60 text-sm m-0 mt-2">
          Real‑time overview of orders, buddies, and sellers.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-white m-0">Live Map</h2>
            <div className="flex flex-wrap gap-2">
              {statusChips.map((chip) => (
                <span
                  key={chip.label}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${chip.tone}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[320px] rounded-2xl border border-dashed border-white/10 bg-black/20 flex items-center justify-center text-white/50">
            Live map placeholder (orders, buddies, sellers)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 m-0">Orders in flight</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">42</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 m-0">Active buddies</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">17</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 m-0">Avg delay</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">6 min</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white m-0">Live Feed</h2>
            <span className="text-xs text-white/50">Auto-updating</span>
          </div>
          {isLoading ? (
            <p className="text-white/60">Loading feed…</p>
          ) : latest.length === 0 ? (
            <p className="text-white/60">No live incidents right now.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {latest.map((event) => (
                <li key={event.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white font-semibold m-0">{event.title}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        event.severity === "critical"
                          ? "bg-rose-500/20 text-rose-200"
                          : event.severity === "medium"
                            ? "bg-amber-500/20 text-amber-200"
                            : "bg-emerald-500/20 text-emerald-200"
                      }`}
                    >
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm m-0 mt-2">{event.message}</p>
                  <p className="text-white/40 text-xs m-0 mt-2">
                    {new Date(event.createdAt).toLocaleTimeString()} · {event.source ?? "system"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </section>
  );
}
