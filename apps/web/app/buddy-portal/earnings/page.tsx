"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";
import BuddyPayoutLeaflet from "@/components/BuddyPayoutLeaflet";

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
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [buddyName, setBuddyName] = useState("Buddy");
  const [buddyId, setBuddyId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem("jb_user_name");
      if (storedName) setBuddyName(storedName);
    }
    const storedBuddyId = getBuddyId();
    setBuddyId(storedBuddyId);
    if (!storedBuddyId) return;
    fetchBuddyJson<{ stats: EarningStat[]; earnings: EarningRow[] }>(
      `/users/${storedBuddyId}/earnings`
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
    fetchBuddyJson<PaymentRow[]>(`/users/${storedBuddyId}/payments`)
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
      <main className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <section className="flex flex-col gap-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white m-0">Earnings snapshot</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Metric</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Value</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.map((stat) => (
                  <tr key={stat.label} className="hover:bg-white/5 transition-colors">
                    <td className="p-4" data-label="Metric">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-current [&>svg]:fill-none [&>svg]:stroke-2">{iconSvg[stat.icon]}</span>
                        <span className="font-medium text-white/90">{stat.label}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xl font-bold text-white" data-label="Value">{stat.value}</td>
                    <td className="p-4" data-label="Trend">
                      <svg
                        className="w-24 h-6 stroke-purple-400 fill-none stroke-2 stroke-linecap-round stroke-linejoin-round"
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Primary method: M-Pesa</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Frequency: Weekly</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Next payout: Friday</span>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors shadow-lg shadow-purple-500/20" onClick={() => setIsPayoutOpen(true)}>
                Request payout
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors">Update M-Pesa details</button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500 mt-4">
          <h2 className="text-2xl font-bold text-white m-0">Recent payouts</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Amount</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Method</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Date</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payoutRows.map((payout, index) => (
                  <tr key={`${payout.createdAt}-${index}`} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white" data-label="Amount">
                      {payout.currency} {payout.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-white/80" data-label="Method">{payout.method}</td>
                    <td className="p-4 text-white/80" data-label="Date">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4" data-label="Status">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${payout.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{payout.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <BuddyPayoutLeaflet
        isOpen={isPayoutOpen}
        onClose={() => setIsPayoutOpen(false)}
        buddyName={buddyName}
        buddyId={buddyId}
        availableBalance={
          stats?.[0]?.value
            ? Number(stats[0].value.toString().replace(/[^\d]/g, ""))
            : 0
        }
        onSubmitted={() => {
          if (!buddyId) return;
          fetchBuddyJson<PaymentRow[]>(`/users/${buddyId}/payments`)
            .then((data) => {
              if (data?.length) setPayments(data);
            })
            .catch(() => null);
        }}
      />
    </>
  );
}
