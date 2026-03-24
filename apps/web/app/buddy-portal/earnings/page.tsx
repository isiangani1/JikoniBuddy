"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";

type EarningStat = {
  label: string;
  value: string;
  icon: keyof typeof iconSvg;
  trend: number[];
};

type EarningRow = {
  amount: number;
  currency: string;
  source: string;
  status: string;
  createdAt: string;
  paidAt?: string | null;
};

type PaymentRow = {
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
};

const fallbackStats: EarningStat[] = [
  {
    label: "Today",
    value: "KES 1,200",
    icon: "wallet",
    trend: [8, 12, 10, 14, 16, 13, 18]
  },
  {
    label: "This Week",
    value: "KES 6,800",
    icon: "trend",
    trend: [6, 9, 8, 11, 10, 14, 15]
  },
  {
    label: "This Month",
    value: "KES 24,500",
    icon: "calendar",
    trend: [4, 6, 7, 9, 12, 11, 14]
  },
  {
    label: "Total",
    value: "KES 118,900",
    icon: "target",
    trend: [3, 5, 6, 8, 9, 10, 12]
  }
];

const fallbackPayments: PaymentRow[] = [
  {
    amount: 4200,
    currency: "KES",
    method: "M-Pesa",
    status: "processing",
    createdAt: "2026-03-17T09:00:00.000Z"
  },
  {
    amount: 3600,
    currency: "KES",
    method: "M-Pesa",
    status: "paid",
    createdAt: "2026-03-10T09:00:00.000Z"
  },
  {
    amount: 2950,
    currency: "KES",
    method: "M-Pesa",
    status: "paid",
    createdAt: "2026-03-03T09:00:00.000Z"
  }
];

const iconSvg = {
  wallet: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M16 12h4" />
      <circle cx="16" cy="12" r="1.5" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 16l6-6 4 4 6-6" />
      <path d="M14 8h6v6" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M4 9h16" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  )
} as const;

const buildSparklinePath = (points: number[]) => {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 22 - ((point - min) / range) * 16;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
};

export default function BuddyPortalEarningsPage() {
  const [stats, setStats] = useState<EarningStat[]>(fallbackStats);
  const [payments, setPayments] = useState<PaymentRow[]>(fallbackPayments);
  const [earnings, setEarnings] = useState<EarningRow[]>([]);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    fetchBuddyJson<{ stats: EarningStat[]; earnings: EarningRow[] }>(
      `/buddy/users/${buddyId}/earnings`
    )
      .then((data) => {
        if (data?.stats?.length) {
          setStats(data.stats);
        }
        if (data?.earnings?.length) {
          setEarnings(data.earnings);
        }
      })
      .catch(() => null);
    fetchBuddyJson<PaymentRow[]>(`/buddy/users/${buddyId}/payments`)
      .then((data) => {
        if (data?.length) {
          setPayments(data);
        }
      })
      .catch(() => null);
  }, []);

  const payoutRows = useMemo(() => {
    if (payments.length) return payments;
    return earnings.map((earning) => ({
      amount: earning.amount,
      currency: earning.currency,
      method: earning.source,
      status: earning.status,
      createdAt: earning.createdAt,
      completedAt: earning.paidAt ?? null
    }));
  }, [earnings, payments]);

  return (
    <>
      <main className="category-page">
        
        <section className="section fade-in">
          <h2>Earnings snapshot</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.label}>
                    <td data-label="Metric">
                      <div className="table-metric">
                        <span className="insight-icon">{iconSvg[stat.icon]}</span>
                        <span>{stat.label}</span>
                      </div>
                    </td>
                    <td data-label="Value">{stat.value}</td>
                    <td data-label="Trend">
                      <svg
                        className="sparkline"
                        viewBox="0 0 100 24"
                        role="presentation"
                      >
                        <path d={buildSparklinePath(stat.trend)} />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="insights-actions">
            <div className="insights-meta">
              <span>Primary method: M-Pesa</span>
              <span>Frequency: Weekly</span>
              <span>Next payout: Friday</span>
            </div>
            <div className="hero-actions">
              <button className="primary">Request payout</button>
              <button className="ghost">Update M-Pesa details</button>
            </div>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Recent payouts</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutRows.map((payout, index) => (
                  <tr key={`${payout.createdAt}-${index}`}>
                    <td data-label="Amount">
                      {payout.currency} {payout.amount.toLocaleString()}
                    </td>
                    <td data-label="Method">{payout.method}</td>
                    <td data-label="Date">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td data-label="Status">
                      <span className="status-pill">{payout.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
