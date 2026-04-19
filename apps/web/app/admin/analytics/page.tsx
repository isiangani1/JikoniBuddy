"use client";

import { useEffect, useMemo, useState } from "react";

type PerformanceOverview = {
  windowDays: number;
  summary: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    orderSuccessRate: number;
    avgDeliveryMinutes: number | null;
    refundRate: number;
  };
  sla: {
    deliveryTargetMinutes: number;
    matchTargetMinutes: number;
    deliveryMetRate: number;
    deliveryEligibleCount: number;
    deliveryMetCount: number;
    avgDeliveryMinutes: number | null;
    matchMetRate: number;
    matchEligibleCount: number;
    matchMetCount: number;
    avgMatchMinutes: number | null;
  };
  orderTrend: Array<{
    date: string;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refunds: number;
    deliverySlaMet: number;
    deliverySamples: number;
  }>;
  delayedOrders: Array<{
    orderId: string;
    deliveryMinutes: number;
    overByMinutes: number;
  }>;
  refundMix: Array<{
    label: string;
    count: number;
  }>;
  buddyPoolSla: {
    totalRequests: number;
    matchedRequests: number;
    openRequests: number;
    avgMatchMinutes: number | null;
    targetMinutes: number;
    metRate: number;
  };
};

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<PerformanceOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/admin/performance?days=${days}`);
      if (!active) return;
      setOverview(response.ok ? ((await response.json()) as PerformanceOverview) : null);
      setIsLoading(false);
    };

    load().catch(() => {
      if (!active) return;
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [days]);

  const trendMax = useMemo(
    () => Math.max(...(overview?.orderTrend.map((bucket) => bucket.totalOrders) ?? [1]), 1),
    [overview]
  );
  const refundMixMax = useMemo(
    () => Math.max(...(overview?.refundMix.map((item) => item.count) ?? [1]), 1),
    [overview]
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Phase 8</p>
            <h1 className="m-0 mt-2 text-3xl font-semibold text-white">SLA & Performance Monitoring</h1>
            <p className="m-0 mt-2 text-sm text-white/60">
              Delivery speed, order success, refund pressure, and buddy matching SLA in one operational view.
            </p>
          </div>
          <div className="w-full lg:w-[240px]">
            <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">
              Window
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              onChange={(event) => setDays(Number(event.target.value))}
              value={days}
            >
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </header>

      {isLoading || !overview ? (
        <div className="rounded-2xl border border-white/10 p-6 text-white/60">
          Loading performance controls…
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Avg delivery</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-white">
                {overview.summary.avgDeliveryMinutes ? `${overview.summary.avgDeliveryMinutes}m` : "—"}
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                target {overview.sla.deliveryTargetMinutes} minutes
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Order success rate</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-emerald-300">
                {(overview.summary.orderSuccessRate * 100).toFixed(1)}%
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                {overview.summary.completedOrders} completed of {overview.summary.totalOrders}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Refund rate</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-amber-300">
                {(overview.summary.refundRate * 100).toFixed(1)}%
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">share of orders with refund pressure</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Delivery SLA met</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-white">
                {(overview.sla.deliveryMetRate * 100).toFixed(1)}%
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                {overview.sla.deliveryMetCount}/{overview.sla.deliveryEligibleCount} tracked deliveries
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Match SLA met</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-white">
                {(overview.sla.matchMetRate * 100).toFixed(1)}%
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                target {overview.sla.matchTargetMinutes} minutes
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-2xl font-bold text-white">Operational Trend</h2>
                <span className="text-xs uppercase tracking-widest text-white/40">
                  last {overview.windowDays} days
                </span>
              </div>
              <div className="mt-6 flex items-end gap-2 overflow-x-auto">
                {overview.orderTrend.map((bucket) => (
                  <div key={bucket.date} className="flex min-w-[48px] flex-col items-center gap-2">
                    <div className="flex h-36 w-8 items-end rounded-t-xl bg-white/10">
                      <div
                        className="w-full rounded-t-xl bg-red-300"
                        style={{
                          height: `${Math.max(8, (bucket.totalOrders / trendMax) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-white/45">{bucket.date.slice(5)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/65">
                <p className="m-0">
                  Total orders: <span className="font-semibold text-white">{overview.summary.totalOrders}</span>
                </p>
                <p className="m-0">
                  Cancelled: <span className="font-semibold text-white">{overview.summary.cancelledOrders}</span>
                </p>
                <p className="m-0">
                  Avg match:{" "}
                  <span className="font-semibold text-white">
                    {overview.buddyPoolSla.avgMatchMinutes ? `${overview.buddyPoolSla.avgMatchMinutes}m` : "—"}
                  </span>
                </p>
                <p className="m-0">
                  Open buddy requests:{" "}
                  <span className="font-semibold text-white">{overview.buddyPoolSla.openRequests}</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-2xl font-bold text-white">Refund Mix</h2>
                <span className="text-xs uppercase tracking-widest text-white/40">workflow pressure</span>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {overview.refundMix.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-white/65">
                      <span>{item.label}</span>
                      <span className="font-semibold text-white">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${Math.max(6, (item.count / refundMixMax) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="m-0 text-2xl font-bold text-white">Delivery SLA Breaches</h2>
              <div className="mt-4 flex flex-col gap-3">
                {overview.delayedOrders.length === 0 ? (
                  <p className="m-0 text-sm text-white/50">No delivery SLA breaches in this window.</p>
                ) : (
                  overview.delayedOrders.map((item) => (
                    <div key={item.orderId} className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-white">{item.orderId}</strong>
                        <span className="text-xs uppercase tracking-widest text-rose-200">
                          +{item.overByMinutes}m over target
                        </span>
                      </div>
                      <p className="m-0 mt-2 text-sm text-white/70">
                        Delivery time landed at {item.deliveryMinutes} minutes.
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="m-0 text-2xl font-bold text-white">Buddy Match SLA</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="m-0 text-sm text-white/60">Matched requests</p>
                  <p className="m-0 mt-2 text-2xl font-semibold text-white">
                    {overview.buddyPoolSla.matchedRequests}/{overview.buddyPoolSla.totalRequests}
                  </p>
                  <p className="m-0 mt-2 text-sm text-white/55">
                    avg {overview.buddyPoolSla.avgMatchMinutes ?? "—"} minutes
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="m-0 text-sm text-white/60">SLA compliance</p>
                  <p className="m-0 mt-2 text-2xl font-semibold text-white">
                    {(overview.buddyPoolSla.metRate * 100).toFixed(1)}%
                  </p>
                  <p className="m-0 mt-2 text-sm text-white/55">
                    target {overview.buddyPoolSla.targetMinutes} minutes
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
