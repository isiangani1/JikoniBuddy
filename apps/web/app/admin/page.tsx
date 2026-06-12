import Link from "next/link";
import SellerAvailabilityOverride from "@/components/admin/SellerAvailabilityOverride";

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
  const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
  const apiKey = process.env.INTERNAL_API_KEYS?.split(",")[0]?.trim();
  if (!apiKey) return null;

  const res = await fetch(`${baseUrl}/api/payout/admin/metrics`, {
    headers: { "x-api-key": apiKey },
    cache: "no-store"
  });
  if (!res.ok) return null;
  return (await res.json()) as PayoutMetrics;
}

type Tile = {
  title: string;
  href?: string;
  description: string;
  eyebrow: string;
  liveValue: string;
  trend: string;
  accent: "teal" | "violet" | "gold" | "rose";
  bars: number[];
};

const accentMap = {
  teal: {
    glow: "from-[#2dd4bf]/25 via-[#2dd4bf]/10 to-transparent",
    border: "border-[#2dd4bf]/25 hover:border-[#2dd4bf]/45",
    pill: "bg-[#2dd4bf]/12 text-[#c6fff6] border-[#2dd4bf]/30",
    bar: "from-[#2dd4bf] to-[#1fb9a4]"
  },
  violet: {
    glow: "from-[#7C5CFF]/25 via-[#7C5CFF]/10 to-transparent",
    border: "border-[#7C5CFF]/25 hover:border-[#7C5CFF]/45",
    pill: "bg-[#7C5CFF]/12 text-[#ddd6ff] border-[#7C5CFF]/30",
    bar: "from-[#7C5CFF] to-[#9f87ff]"
  },
  gold: {
    glow: "from-[#F7C948]/25 via-[#F7C948]/10 to-transparent",
    border: "border-[#F7C948]/25 hover:border-[#F7C948]/45",
    pill: "bg-[#F7C948]/12 text-[#fff0bf] border-[#F7C948]/30",
    bar: "from-[#F7C948] to-[#f3db87]"
  },
  rose: {
    glow: "from-[#fb7185]/25 via-[#fb7185]/10 to-transparent",
    border: "border-[#fb7185]/25 hover:border-[#fb7185]/45",
    pill: "bg-[#fb7185]/12 text-[#ffd5dc] border-[#fb7185]/30",
    bar: "from-[#fb7185] to-[#fda4af]"
  }
} as const;

function LiveTile(tile: Tile) {
  const accents = accentMap[tile.accent];
  const content = (
    <article
      className={`group relative overflow-hidden rounded-[28px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 ${accents.border}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accents.glow}`} />
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">{tile.eyebrow}</p>
            <h3 className="mt-2 text-xl font-bold text-white">{tile.title}</h3>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${accents.pill}`}>
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            {tile.liveValue}
          </span>
        </div>

        <p className="m-0 text-sm leading-6 text-white/68">{tile.description}</p>

        <div className="mt-auto space-y-3">
          <div className="flex items-end gap-2">
            {tile.bars.map((bar, index) => (
              <div key={`${tile.title}-${index}`} className="flex-1 rounded-full bg-white/5 p-1">
                <div
                  className={`rounded-full bg-gradient-to-t ${accents.bar} transition-all duration-500`}
                  style={{ height: `${bar}px` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Live pulse</span>
            <span>{tile.trend}</span>
          </div>
        </div>
      </div>
    </article>
  );

  if (!tile.href) return content;
  return <Link href={tile.href} className="block">{content}</Link>;
}

export default async function AdminDashboard() {
  const payoutMetrics = await getPayoutMetrics();
  const failurePercent = payoutMetrics ? Math.round(payoutMetrics.failureRate * 1000) / 10 : null;

  const tiles: Tile[] = [
    {
      title: "Command Center",
      href: "/admin/command-center",
      eyebrow: "Live Ops",
      description: "Track dispatch pressure, delayed orders, and seller load in one war-room surface.",
      liveValue: "19 signals",
      trend: "2 delays cooling down",
      accent: "rose",
      bars: [20, 44, 58, 72, 64, 49]
    },
    {
      title: "Smart Alerts",
      href: "/admin/alerts",
      eyebrow: "Monitoring",
      description: "Severity-routed alerts with actionable context for ops, finance, and support teams.",
      liveValue: "6 open",
      trend: "Critical kept under SLA",
      accent: "gold",
      bars: [18, 30, 38, 62, 54, 28]
    },
    {
      title: "Automation",
      href: "/admin/automation",
      eyebrow: "Supervised Actions",
      description: "Auto-reassign stalled orders, trigger Buddy Pool, and review intervention queue.",
      liveValue: "4 queued",
      trend: "3 auto-fixes in last hour",
      accent: "violet",
      bars: [15, 28, 46, 55, 68, 74]
    },
    {
      title: "Orders Live",
      href: "/admin/orders",
      eyebrow: "Debug View",
      description: "Open a full order trace with payment, chat, tracking, and buddy action history.",
      liveValue: "31 active",
      trend: "7 need attention",
      accent: "teal",
      bars: [24, 36, 40, 52, 61, 67]
    },
    {
      title: "Risk Scoring",
      href: "/admin/risk",
      eyebrow: "Trust & Safety",
      description: "Inspect fraud pressure, cancellation spikes, and suspicious movement patterns fast.",
      liveValue: "3 reviews",
      trend: "No severe fraud spike",
      accent: "rose",
      bars: [14, 22, 26, 30, 42, 33]
    },
    {
      title: "Finance Controls",
      href: "/admin/finance",
      eyebrow: "Settlement Desk",
      description: "Watch payout health, anomalies, and settlement queues without leaving the command deck.",
      liveValue: payoutMetrics ? `${payoutMetrics.processing} processing` : "Awaiting keys",
      trend: payoutMetrics ? `${payoutMetrics.success} cleared` : "Finance feed offline",
      accent: "gold",
      bars: [26, 41, 58, 66, 63, 72]
    },
    {
      title: "Buddy Pool",
      href: "/admin/buddy-pool",
      eyebrow: "Supply Engine",
      description: "See where helper demand is outrunning supply and rebalance zones before service slips.",
      liveValue: "12 hot zones",
      trend: "Westlands stabilizing",
      accent: "teal",
      bars: [32, 48, 44, 70, 59, 51]
    },
    {
      title: "SLA Analytics",
      href: "/admin/analytics",
      eyebrow: "Performance",
      description: "Monitor delivery speed, order success, and refund pressure against real marketplace targets.",
      liveValue: "92% hit rate",
      trend: "Refund rate flat",
      accent: "violet",
      bars: [20, 29, 47, 53, 60, 65]
    }
  ];

  return (
    <main className="flex w-full min-w-0 flex-col gap-8 pr-4 sm:pr-6 xl:pr-2">
      <header className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.16),rgba(45,212,191,0.12),rgba(255,255,255,0.04))] p-6 shadow-[0_24px_70px_rgba(4,2,10,0.35)] sm:p-8">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#7C5CFF]/20 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#2dd4bf]/10 blur-[70px]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-sm font-bold uppercase tracking-[0.32em] text-[#2dd4bf]">Admin Dashboard</p>
            <h1 className="m-0 text-3xl font-extrabold text-white md:text-5xl">Operate the marketplace in real time</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/68 sm:text-base">
              One deck for orders, finance, trust, and helper supply. Built to feel like a live control room, not a static report wall.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
              <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-white/40">Signals</p>
              <p className="mt-2 text-2xl font-bold text-white">47</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
              <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-white/40">Open cases</p>
              <p className="mt-2 text-2xl font-bold text-white">12</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl col-span-2 sm:col-span-1">
              <p className="m-0 text-[11px] uppercase tracking-[0.24em] text-white/40">Team mode</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#c6fff6]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2dd4bf] animate-pulse" />
                Live supervision
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <LiveTile key={tile.title} {...tile} />
        ))}
      </section>

      <SellerAvailabilityOverride />
    </main>
  );
}
