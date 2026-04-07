type PayoutMetrics = {
  windowDays: number;
  totalWithdrawals: number;
  success: number;
  failed: number;
  processing: number;
  failureRate: number;
  avgLatencyMs: number | null;
};

async function getPayoutMetrics(): Promise<PayoutMetrics | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const apiKey = process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();
  if (!apiKey) return null;

  const res = await fetch(`${baseUrl}/api/payout/admin/metrics`, {
    headers: { "x-api-key": apiKey },
    cache: "no-store"
  });
  if (!res.ok) return null;
  return (await res.json()) as PayoutMetrics;
}

export default async function AdminDashboard() {
  const payoutMetrics = await getPayoutMetrics();
  const failurePercent = payoutMetrics
    ? Math.round(payoutMetrics.failureRate * 1000) / 10
    : null;

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-red-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex flex-col gap-2">
          <p className="text-red-300 font-bold tracking-widest uppercase text-sm m-0">Admin Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Platform Operations</h1>
        </div>
        <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap">Review Sellers</button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-red-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white m-0 mb-2">Orders Live</h3>
          <p className="text-white/70 m-0">Monitor active, delayed, and cancelled orders.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-red-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white m-0 mb-2">Disputes</h3>
          <p className="text-white/70 m-0">Open cases, refunds, and resolution steps.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-red-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white m-0 mb-2">Metrics</h3>
          <p className="text-white/70 m-0">GMV, cancellations, and seller performance.</p>
        </div>
      </section>
      <section className="bg-white/5 border border-white/10 rounded-[24px] p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-white m-0">Payout Observability</h2>
          <p className="text-sm text-white/60 m-0">
            {payoutMetrics ? `Last ${payoutMetrics.windowDays} days` : "Awaiting metrics"}
          </p>
        </div>
        {payoutMetrics ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Total withdrawals</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">{payoutMetrics.totalWithdrawals}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Failure rate</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">{failurePercent}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Processing</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">{payoutMetrics.processing}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-widest text-white/50 m-0">Avg latency</p>
              <p className="text-2xl font-semibold text-white m-0 mt-2">
                {payoutMetrics.avgLatencyMs ? `${Math.round(payoutMetrics.avgLatencyMs / 1000)}s` : "n/a"}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-white/60">
            Metrics unavailable. Configure `INTERNAL_API_KEYS` to enable finance widgets.
          </div>
        )}
      </section>

      <SellerAvailabilityOverride />
    </main>
  );
}
import SellerAvailabilityOverride from "@/components/admin/SellerAvailabilityOverride";
