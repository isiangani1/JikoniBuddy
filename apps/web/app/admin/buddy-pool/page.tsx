"use client";

import { useEffect, useState } from "react";

type BuddyPoolMetrics = {
  windowDays: number;
  totalRequests: number;
  fulfilled: number;
  byStatus: Record<string, number>;
  avgMatchTimeMinutes: number | null;
  staleOpen: number;
  failedMatches: number;
  onlineHelpers: number;
  sellerLoad: Array<{
    sellerId: string;
    sellerName: string;
    requestCount: number;
    maxOrdersPerHour: number | null;
    loadRatio: number | null;
    loadStatus: string;
  }>;
  zoneCounts: Array<{
    zone: string;
    total: number;
    open: number;
    completed: number;
    matched: number;
    staleOpen: number;
    failed: number;
    avgMatchTimeMinutes: number | null;
    fulfillmentRate: number;
    supplyPressure: number;
    performanceLabel: string;
  }>;
};

export default function AdminBuddyPoolPage() {
  const [metrics, setMetrics] = useState<BuddyPoolMetrics | null>(null);
  const [days, setDays] = useState(7);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchMetrics = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/admin/buddy-pool?days=${days}`);
      if (response.ok) {
        const payload = (await response.json()) as BuddyPoolMetrics;
        if (active) {
          setMetrics(payload);
        }
      }
      if (active) {
        setIsLoading(false);
      }
    };
    fetchMetrics();

    return () => {
      active = false;
    };
  }, [days]);

  const requestVsFulfilled = metrics
    ? metrics.totalRequests > 0
      ? Math.round((metrics.fulfilled / metrics.totalRequests) * 100)
      : 0
    : 0;

  const maxZoneVolume = metrics
    ? Math.max(...metrics.zoneCounts.map((zone) => zone.total), 1)
    : 1;
  const maxSellerRequests = metrics
    ? Math.max(...metrics.sellerLoad.map((seller) => seller.requestCount), 1)
    : 1;

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col gap-6 bg-gradient-to-r from-red-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-red-300 font-bold tracking-widest uppercase text-sm m-0">Phase 6</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Buddy Pool Intelligence</h1>
            <p className="text-white/70 m-0 text-lg">
              See request fulfillment, zone pressure, seller load, and matching performance in one view.
            </p>
          </div>
          <div className="w-full lg:w-[240px] shrink-0">
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
              Window
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              onChange={(event) => setDays(Number(event.target.value))}
              value={days}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </section>

      {isLoading || !metrics ? (
        <section className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-white/60">
          Loading Buddy Pool intelligence…
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Requests vs fulfilled</p>
              <p className="text-4xl font-extrabold text-red-400 m-0 mt-3">
                {metrics.fulfilled}/{metrics.totalRequests}
              </p>
              <p className="text-sm text-white/60 m-0 mt-2">{requestVsFulfilled}% fulfilled</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Avg match time</p>
              <p className="text-4xl font-extrabold text-white m-0 mt-3">
                {metrics.avgMatchTimeMinutes ?? "—"}
              </p>
              <p className="text-sm text-white/60 m-0 mt-2">minutes to first assignment</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Failed / stale</p>
              <p className="text-4xl font-extrabold text-white m-0 mt-3">
                {metrics.failedMatches + metrics.staleOpen}
              </p>
              <p className="text-sm text-white/60 m-0 mt-2">
                {metrics.failedMatches} failed · {metrics.staleOpen} stale open
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Online helpers</p>
              <p className="text-4xl font-extrabold text-white m-0 mt-3">{metrics.onlineHelpers}</p>
              <p className="text-sm text-white/60 m-0 mt-2">currently available</p>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-2xl font-bold text-white m-0">Demand Heatmap by Zone</h2>
                <span className="text-xs uppercase tracking-widest text-white/40">
                  Demand &gt; supply
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.zoneCounts.map((zone) => (
                  <div
                    key={zone.zone}
                    className={`rounded-[20px] border p-5 ${
                      zone.performanceLabel === "healthy"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : zone.performanceLabel === "stressed"
                          ? "border-amber-500/30 bg-amber-500/10"
                          : "border-rose-500/30 bg-rose-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-white m-0">{zone.zone}</h3>
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                        {zone.performanceLabel}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                      <p className="m-0 text-white/70">Total: <span className="text-white font-semibold">{zone.total}</span></p>
                      <p className="m-0 text-white/70">Open: <span className="text-white font-semibold">{zone.open}</span></p>
                      <p className="m-0 text-white/70">Matched: <span className="text-white font-semibold">{zone.matched}</span></p>
                      <p className="m-0 text-white/70">Completed: <span className="text-white font-semibold">{zone.completed}</span></p>
                      <p className="m-0 text-white/70">Avg match: <span className="text-white font-semibold">{zone.avgMatchTimeMinutes ?? "—"}m</span></p>
                      <p className="m-0 text-white/70">Failed: <span className="text-white font-semibold">{zone.failed}</span></p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/55">
                        <span>Fulfillment {(zone.fulfillmentRate * 100).toFixed(0)}%</span>
                        <span>Pressure {(zone.supplyPressure * 100).toFixed(0)}%</span>
                      </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-white/45">
                          <span>Volume</span>
                          <span>{zone.total}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-white/70"
                            style={{ width: `${Math.max(8, (zone.total / maxZoneVolume) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-white/45">
                          <span>Fulfillment</span>
                          <span>{(zone.fulfillmentRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-emerald-300"
                            style={{ width: `${Math.max(6, zone.fulfillmentRate * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-white/45">
                          <span>Supply pressure</span>
                          <span>{(zone.supplyPressure * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${
                              zone.performanceLabel === "healthy"
                                ? "bg-emerald-400"
                                : zone.performanceLabel === "stressed"
                                  ? "bg-amber-400"
                                  : "bg-rose-400"
                            }`}
                            style={{ width: `${Math.max(6, zone.supplyPressure * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <section className="bg-white/5 border border-white/10 rounded-[24px] p-6">
                <h2 className="text-2xl font-bold text-white m-0 mb-4">Seller Load Balancing</h2>
                <div className="flex flex-col gap-4">
                  {metrics.sellerLoad.map((seller) => (
                    <div key={seller.sellerId} className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-white m-0">{seller.sellerName}</h3>
                          <p className="text-xs text-white/45 m-0 mt-1">{seller.sellerId}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            seller.loadStatus === "healthy"
                              ? "bg-emerald-500/20 text-emerald-200"
                              : seller.loadStatus === "stressed"
                                ? "bg-amber-500/20 text-amber-200"
                                : seller.loadStatus === "overloaded"
                                  ? "bg-rose-500/20 text-rose-200"
                                  : "bg-white/10 text-white/60"
                          }`}
                        >
                          {seller.loadStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4 text-sm text-white/70">
                        <p className="m-0">Requests: <span className="font-semibold text-white">{seller.requestCount}</span></p>
                        <p className="m-0">Capacity: <span className="font-semibold text-white">{seller.maxOrdersPerHour ?? "—"}</span></p>
                        <p className="m-0">Load: <span className="font-semibold text-white">{seller.loadRatio !== null ? `${Math.round(seller.loadRatio * 100)}%` : "—"}</span></p>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-white/45">
                            <span>Requests share</span>
                            <span>{seller.requestCount}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-white/70"
                              style={{
                                width: `${Math.max(
                                  8,
                                  (seller.requestCount / maxSellerRequests) * 100
                                )}%`
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-white/45">
                            <span>Capacity stress</span>
                            <span>
                              {seller.loadRatio !== null
                                ? `${Math.round(seller.loadRatio * 100)}%`
                                : "—"}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full ${
                                seller.loadStatus === "healthy"
                                  ? "bg-emerald-400"
                                  : seller.loadStatus === "stressed"
                                    ? "bg-amber-400"
                                    : seller.loadStatus === "overloaded"
                                      ? "bg-rose-400"
                                      : "bg-white/30"
                              }`}
                              style={{
                                width: `${
                                  seller.loadRatio !== null
                                    ? Math.max(6, Math.min(100, seller.loadRatio * 100))
                                    : 12
                                }%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white/5 border border-white/10 rounded-[24px] p-6">
                <h2 className="text-2xl font-bold text-white m-0 mb-4">Request Status Mix</h2>
                <div className="flex flex-col gap-3">
                  {Object.entries(metrics.byStatus).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-xl bg-black/20 px-4 py-3">
                      <span className="text-white/70 capitalize">{key}</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
