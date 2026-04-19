"use client";

import { useEffect, useMemo, useState } from "react";

type FinanceOverview = {
  windowDays: number;
  summary: {
    totalWithdrawals: number;
    pendingSettlements: number;
    processingSettlements: number;
    paidSettlements: number;
    failedSettlements: number;
    payoutSuccessRate: number;
    payoutFailureRate: number;
    avgLatencyMs: number | null;
  };
  revenueBreakdown: {
    grossVolume: number;
    platformFees: number;
    deliveryFees: number;
    commissions: number;
    sellerNet: number;
    buddyPayouts: number;
  };
  settlementPipeline: {
    total: number;
    pending: number;
    processing: number;
    paid: number;
    failed: number;
    reversed: number;
  };
  settlementTrend: Array<{
    date: string;
    grossVolume: number;
    platformFees: number;
    deliveryFees: number;
    sellerNet: number;
    withdrawalCount: number;
  }>;
  walletAnomalies: Array<{
    walletId: string;
    userId: string;
    userName: string;
    role: string;
    type: string;
    balance: number;
    pendingBalance: number;
    currency: string;
    severity: "low" | "medium" | "critical";
    reasons: string[];
  }>;
  recentFailures: Array<{
    id: string;
    reference: string;
    amount: number;
    currency: string;
    createdAt: string;
    status: string;
    reason: string;
  }>;
  topPendingWallets: Array<{
    walletId: string;
    userId: string;
    userName: string;
    role: string;
    walletType: string;
    currency: string;
    balance: number;
    pendingBalance: number;
  }>;
};

function formatMoney(amount: number, currency = "KES") {
  return `${currency} ${Math.round(amount).toLocaleString()}`;
}

export default function AdminFinancePage() {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/admin/finance/overview?days=${days}`);
      if (!active) return;
      setOverview(response.ok ? ((await response.json()) as FinanceOverview) : null);
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
    () => Math.max(...(overview?.settlementTrend.map((bucket) => bucket.grossVolume) ?? [1]), 1),
    [overview]
  );

  const breakdownMax = useMemo(() => {
    if (!overview) return 1;
    return Math.max(
      overview.revenueBreakdown.platformFees,
      overview.revenueBreakdown.deliveryFees,
      overview.revenueBreakdown.commissions,
      overview.revenueBreakdown.sellerNet,
      overview.revenueBreakdown.buddyPayouts,
      1
    );
  }, [overview]);

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Phase 7 Hardened</p>
            <h1 className="m-0 mt-2 text-3xl font-semibold text-white">Finance & Payouts</h1>
            <p className="m-0 mt-2 text-sm text-white/60">
              Backend-derived finance controls for revenue quality, settlement health, and anomaly review.
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
          Loading hardened finance controls…
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Gross volume</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-white">
                {formatMoney(overview.revenueBreakdown.grossVolume)}
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                merchant volume in the last {overview.windowDays} days
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Settlement pipeline</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-amber-300">
                {overview.summary.processingSettlements}
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                {overview.summary.pendingSettlements} pending · {overview.summary.paidSettlements} paid
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Payout success rate</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-emerald-300">
                {(overview.summary.payoutSuccessRate * 100).toFixed(1)}%
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">
                {overview.summary.failedSettlements} failures need review
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="m-0 text-xs uppercase tracking-widest text-white/50">Avg payout latency</p>
              <p className="m-0 mt-3 text-4xl font-extrabold text-white">
                {overview.summary.avgLatencyMs
                  ? `${Math.round(overview.summary.avgLatencyMs / 60000)}m`
                  : "—"}
              </p>
              <p className="m-0 mt-2 text-sm text-white/60">request to processed timestamp</p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-2xl font-bold text-white">Revenue Breakdown</h2>
                <span className="text-xs uppercase tracking-widest text-white/40">backend-derived</span>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Platform fees",
                    value: overview.revenueBreakdown.platformFees,
                    color: "bg-emerald-400"
                  },
                  {
                    label: "Delivery fees",
                    value: overview.revenueBreakdown.deliveryFees,
                    color: "bg-sky-400"
                  },
                  {
                    label: "Commissions",
                    value: overview.revenueBreakdown.commissions,
                    color: "bg-amber-400"
                  },
                  {
                    label: "Seller net",
                    value: overview.revenueBreakdown.sellerNet,
                    color: "bg-fuchsia-400"
                  },
                  {
                    label: "Buddy payouts",
                    value: overview.revenueBreakdown.buddyPayouts,
                    color: "bg-rose-400"
                  }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="m-0 text-sm text-white/60">{item.label}</p>
                    <p className="m-0 mt-2 text-2xl font-semibold text-white">
                      {formatMoney(item.value)}
                    </p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${Math.max(6, (item.value / breakdownMax) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="m-0 text-2xl font-bold text-white">Settlement Trend</h2>
                <span className="text-xs uppercase tracking-widest text-white/40">
                  last {overview.windowDays} days
                </span>
              </div>
              <div className="mt-6 flex items-end gap-2 overflow-x-auto">
                {overview.settlementTrend.map((bucket) => (
                  <div key={bucket.date} className="flex min-w-[50px] flex-col items-center gap-2">
                    <div className="flex h-36 w-8 items-end rounded-t-xl bg-white/10">
                      <div
                        className="w-full rounded-t-xl bg-red-300"
                        style={{
                          height: `${Math.max(8, (bucket.grossVolume / trendMax) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-white/45">{bucket.date.slice(5)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/65">
                <p className="m-0">
                  Pending: <span className="font-semibold text-white">{overview.settlementPipeline.pending}</span>
                </p>
                <p className="m-0">
                  Processing:{" "}
                  <span className="font-semibold text-white">{overview.settlementPipeline.processing}</span>
                </p>
                <p className="m-0">
                  Paid: <span className="font-semibold text-white">{overview.settlementPipeline.paid}</span>
                </p>
                <p className="m-0">
                  Failed: <span className="font-semibold text-white">{overview.settlementPipeline.failed}</span>
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="m-0 text-2xl font-bold text-white">Wallet Anomalies</h2>
              <div className="mt-4 flex flex-col gap-3">
                {overview.walletAnomalies.length === 0 ? (
                  <p className="m-0 text-sm text-white/50">No anomalies detected in the current window.</p>
                ) : (
                  overview.walletAnomalies.map((wallet) => (
                    <div
                      key={wallet.walletId}
                      className={`rounded-xl p-4 ${
                        wallet.severity === "critical"
                          ? "border border-rose-500/30 bg-rose-500/10"
                          : "border border-amber-500/30 bg-amber-500/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-white">{wallet.userName}</strong>
                        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                          {wallet.severity}
                        </span>
                      </div>
                      <p className="m-0 mt-2 text-sm text-white/65">
                        {wallet.role} · {wallet.type} wallet · Balance{" "}
                        {formatMoney(wallet.balance, wallet.currency)} · Pending{" "}
                        {formatMoney(wallet.pendingBalance, wallet.currency)}
                      </p>
                      <ul className="mt-3 list-disc pl-5 text-sm text-white/70">
                        {wallet.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="m-0 text-2xl font-bold text-white">Recent Failure Reasons</h2>
              <div className="mt-4 flex flex-col gap-3">
                {overview.recentFailures.length === 0 ? (
                  <p className="m-0 text-sm text-white/50">No failed settlements in the current window.</p>
                ) : (
                  overview.recentFailures.map((item) => (
                    <div key={item.id} className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <strong className="text-white">{item.reference}</strong>
                        <span className="text-xs text-white/45">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="m-0 mt-2 text-sm text-white/70">{item.reason}</p>
                      <p className="m-0 mt-1 text-xs uppercase tracking-widest text-white/45">
                        {formatMoney(item.amount, item.currency)} · {item.status}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="m-0 text-2xl font-bold text-white">Top Wallets Awaiting Settlement</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm text-white/75">
                <thead className="text-xs uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="py-2">User</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Wallet</th>
                    <th className="py-2">Available</th>
                    <th className="py-2">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.topPendingWallets.map((wallet) => (
                    <tr key={wallet.walletId} className="border-t border-white/5">
                      <td className="py-3">{wallet.userName}</td>
                      <td className="py-3 capitalize">{wallet.role}</td>
                      <td className="py-3 capitalize">{wallet.walletType}</td>
                      <td className="py-3">{formatMoney(wallet.balance, wallet.currency)}</td>
                      <td className="py-3">{formatMoney(wallet.pendingBalance, wallet.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
