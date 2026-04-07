"use client";

import { useEffect, useMemo, useState } from "react";
import { getBuddyId } from "@/lib/buddy-client";
import { pushToast } from "@/lib/toast-store";
import BuddyPayoutLeaflet from "@/components/BuddyPayoutLeaflet";
import PayoutMethodModal from "@/components/PayoutMethodModal";

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
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [buddyName, setBuddyName] = useState("Buddy");
  const [buddyId, setBuddyId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletPending, setWalletPending] = useState(0);
  const [lastPayoutAt, setLastPayoutAt] = useState<string | null>(null);
  const [payoutMethodLabel, setPayoutMethodLabel] = useState("M-Pesa");
  const [payoutFrequency, setPayoutFrequency] = useState("Weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem("jb_user_name");
      if (storedName) setBuddyName(storedName);
    }
    const storedBuddyId = getBuddyId();
    setBuddyId(storedBuddyId);
    if (!storedBuddyId) return;

    const loadWallet = async () => {
      const [walletRes, txRes, methodRes] = await Promise.all([
        fetch(`/api/payout/wallet?userId=${storedBuddyId}&type=buddy`),
        fetch(`/api/payout/transactions?userId=${storedBuddyId}&type=buddy`),
        fetch(`/api/payout/payout-method?userId=${storedBuddyId}`)
      ]);
      if (!walletRes.ok || !txRes.ok) {
        pushToast({ title: "Wallet unavailable", message: "Unable to load wallet data.", variant: "error" });
        return;
      }
      const wallet = await walletRes.json();
      const transactions = await txRes.json();
      const payoutMethods = methodRes.ok ? await methodRes.json() : [];
      setAllTransactions(transactions ?? []);

      setWalletBalance(wallet?.balance ?? 0);
      setWalletPending(wallet?.pendingBalance ?? 0);
      if (Array.isArray(payoutMethods) && payoutMethods.length) {
        const method = payoutMethods[0];
        setPayoutMethodLabel(method.label || method.type || "M-Pesa");
      }

      const earningTx = transactions.filter((t: any) => t.type === "earning");
      const payoutTx = transactions.filter((t: any) => t.type === "withdrawal");

      const now = new Date();
      const isSameDay = (date: Date) =>
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const sumAmount = (items: any[]) =>
        items.reduce((acc, item) => acc + Number(item.amount ?? 0), 0);

      const todayTotal = sumAmount(
        earningTx.filter((t: any) => isSameDay(new Date(t.createdAt)))
      );
      const weekTotal = sumAmount(
        earningTx.filter((t: any) => new Date(t.createdAt) >= weekStart)
      );
      const monthTotal = sumAmount(
        earningTx.filter((t: any) => new Date(t.createdAt) >= monthStart)
      );
      const total = sumAmount(earningTx);

      setStats([
        { label: "Today", value: `KES ${todayTotal.toLocaleString()}`, icon: "wallet", trend: [8, 12, 10, 14, 16, 13, 18] },
        { label: "This Week", value: `KES ${weekTotal.toLocaleString()}`, icon: "trend", trend: [6, 9, 8, 11, 10, 14, 15] },
        { label: "This Month", value: `KES ${monthTotal.toLocaleString()}`, icon: "calendar", trend: [4, 6, 7, 9, 12, 11, 14] },
        { label: "Total", value: `KES ${total.toLocaleString()}`, icon: "target", trend: [3, 5, 6, 8, 9, 10, 12] }
      ]);

      setPayments(
        payoutTx.map((tx: any) => ({
          amount: tx.amount,
          currency: tx.currency ?? "KES",
          method: "M-Pesa",
          status: tx.status,
          createdAt: tx.createdAt,
          completedAt: null
        }))
      );
      const latestPayout = payoutTx
        .filter((tx: any) => tx.createdAt)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
      setLastPayoutAt(latestPayout?.createdAt ?? null);
      setEarnings(
        earningTx.map((tx: any) => ({
          amount: tx.amount,
          currency: tx.currency ?? "KES",
          source: "order",
          status: tx.status,
          createdAt: tx.createdAt,
          paidAt: null
        }))
      );
    };

    loadWallet()
      .catch(() => null)
      .finally(() => setIsLoading(false));
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

  const totalEarned = useMemo(
    () => earnings.reduce((acc, item) => acc + Number(item.amount ?? 0), 0),
    [earnings]
  );

  const filteredLedger = useMemo(() => {
    return (allTransactions ?? [])
      .filter((tx) => (filterType === "all" ? true : tx.type === filterType))
      .filter((tx) => (filterStatus === "all" ? true : tx.status === filterStatus))
      .filter((tx) => {
        if (!filterSearch.trim()) return true;
        const hay = `${tx.reference ?? ""} ${tx.type ?? ""} ${tx.status ?? ""}`.toLowerCase();
        return hay.includes(filterSearch.trim().toLowerCase());
      });
  }, [allTransactions, filterType, filterStatus, filterSearch]);

  const exportCsv = () => {
    const rows = [
      ["Date", "Type", "Amount", "Currency", "Status", "Reference"],
      ...filteredLedger.map((tx) => [
        new Date(tx.createdAt).toISOString(),
        tx.type,
        tx.amount,
        tx.currency ?? "KES",
        tx.status,
        tx.reference ?? ""
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/\"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `buddy_ledger_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <main className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        <section className="flex flex-col gap-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`stat-skeleton-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="h-6 w-28 rounded bg-white/10 mt-3" />
                </div>
              ))
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60 m-0">Available</p>
                  <p className="text-2xl font-bold text-white m-0 mt-2">
                    KES {walletBalance.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60 m-0">Pending</p>
                  <p className="text-2xl font-bold text-white m-0 mt-2">
                    KES {walletPending.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60 m-0">Total earned</p>
                  <p className="text-2xl font-bold text-white m-0 mt-2">
                    KES {totalEarned.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60 m-0">Last payout</p>
                  <p className="text-2xl font-bold text-white m-0 mt-2">
                    {lastPayoutAt ? new Date(lastPayoutAt).toLocaleDateString() : "—"}
                  </p>
                </div>
              </>
            )}
          </div>
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
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={`stat-row-${index}`} className="animate-pulse">
                      <td className="p-4"><div className="h-4 w-32 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-5 w-20 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
                    </tr>
                  ))
                ) : (
                  stats.map((stat) => (
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
                ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Primary method: {payoutMethodLabel}</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Frequency: {payoutFrequency}</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Next payout: Friday</span>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors shadow-lg shadow-purple-500/20" onClick={() => setIsPayoutOpen(true)}>
                Request payout
              </button>
              <button
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                onClick={() => setIsMethodOpen(true)}
              >
                Update M-Pesa details
              </button>
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
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={`payout-skeleton-${index}`} className="animate-pulse">
                      <td className="p-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-16 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-16 rounded bg-white/10" /></td>
                    </tr>
                  ))
                ) : (
                  payoutRows.map((payout, index) => (
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
                ))
                )}
              </tbody>
            </table>
          </div>
          {!isLoading && payoutRows.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white m-0">No payouts yet</h3>
              <p className="m-0 mt-2 text-sm text-white/60">
                Complete your first job to start seeing payouts here.
              </p>
              <button
                className="mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
                onClick={() => setIsPayoutOpen(true)}
              >
                Request payout
              </button>
            </div>
          ) : null}
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-white m-0">Transaction ledger</h2>
            <button
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
              onClick={exportCsv}
            >
              Export CSV
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
            >
              <option value="all">All types</option>
              <option value="earning">Earnings</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="fee">Fees</option>
            </select>
            <select
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option value="all">All status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white flex-1"
              placeholder="Search reference or status"
              value={filterSearch}
              onChange={(event) => setFilterSearch(event.target.value)}
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Date</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Type</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Amount</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Status</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLedger.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/80">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-white/80">{tx.type}</td>
                    <td className="p-4 text-white font-semibold">
                      {tx.currency ?? "KES"} {Number(tx.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-white/80">{tx.status}</td>
                    <td className="p-4 text-white/60">{tx.reference ?? "—"}</td>
                  </tr>
                ))}
                {filteredLedger.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-white/50">
                      No transactions match your filters.
                    </td>
                  </tr>
                ) : null}
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
          walletBalance
        }
        onSubmitted={() => {
          if (!buddyId) return;
          fetch(`/api/payout/transactions?userId=${buddyId}&type=buddy`)
            .then((res) => res.json())
            .then((transactions) => {
              const payoutTx = transactions.filter((t: any) => t.type === "withdrawal");
              const earningTx = transactions.filter((t: any) => t.type === "earning");
              setPayments(
                payoutTx.map((tx: any) => ({
                  amount: tx.amount,
                  currency: tx.currency ?? "KES",
                  method: "M-Pesa",
                  status: tx.status,
                  createdAt: tx.createdAt,
                  completedAt: null
                }))
              );
              setEarnings(
                earningTx.map((tx: any) => ({
                  amount: tx.amount,
                  currency: tx.currency ?? "KES",
                  source: "order",
                  status: tx.status,
                  createdAt: tx.createdAt,
                  paidAt: null
                }))
              );
            })
            .catch(() => null);
        }}
      />
      <PayoutMethodModal
        isOpen={isMethodOpen}
        onClose={() => setIsMethodOpen(false)}
        userId={buddyId}
        roleLabel="Buddy"
      />
    </>
  );
}
