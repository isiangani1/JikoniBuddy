"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RadialPerformanceChart,
  TrendLineChart
} from "@/components/DashboardCharts";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";
import { useBuddyStore } from "@/lib/buddy-store";

const statTiles = [
  {
    label: "Open Requests",
    value: "12",
    note: "New requests near you",
    href: "/buddy-portal/my-requests"
  },
  {
    label: "Active Jobs",
    value: "2",
    note: "Currently in progress",
    href: "/buddy-portal/active-jobs"
  },
  {
    label: "Earnings Today",
    value: "KES 1,200",
    note: "Track payouts",
    href: "/buddy-portal/earnings"
  },
  {
    label: "Recent Ratings",
    value: "4.8",
    note: "View feedback",
    href: "/buddy-portal/ratings"
  },
  {
    label: "Job History",
    value: "24",
    note: "Completed jobs",
    href: "/buddy-portal/history"
  },
  {
    label: "Notifications",
    value: "3",
    note: "Unread alerts",
    href: "/buddy-portal/notifications"
  },
  {
    label: "Messages",
    value: "2",
    note: "Active threads",
    href: "/buddy-portal/messages"
  },
  {
    label: "Settings",
    value: "Update",
    note: "Preferences",
    href: "/buddy-portal/settings"
  },
  {
    label: "Support",
    value: "Help",
    note: "Get assistance",
    href: "/buddy-portal/support"
  }
];

export default function BuddyPortalDashboard() {
  const { isOnline, setIsOnline } = useBuddyStore();
  const [metrics, setMetrics] = useState<any>(null); // New state variable
  const [isLoading, setIsLoading] = useState(true);
  const [performance, setPerformance] = useState<{
    acceptanceRate: number;
    completedJobs: number;
    cancelledJobs: number;
    avgResponseMinutes: number;
    rating: number;
    totalEarned: number;
  } | null>(null);
  const [idleSuggestions, setIdleSuggestions] = useState<{ label: string; count: number }[]>([]);
  const [fraudSignals, setFraudSignals] = useState<{ repeatedCancellations: boolean; cancellationCount: number; gpsSpoofing: boolean } | null>(null);
  const router = useRouter();
  const buddyId = getBuddyId(); // Moved buddyId declaration to component level
  // Load initial online state (mocking local persistence for MVP stability)
  useEffect(() => {
    const cachedState = localStorage.getItem("jb_buddy_online");
    if (cachedState) {
      setIsOnline(cachedState === "true");
    }
  }, []);

  const [radial, setRadial] = useState({
    title: "Buddy Performance",
    subtitle: "Your personal reliability score",
    centerValue: "92%",
    centerLabel: "Reliability",
    rings: [
      { label: "Acceptance rate", percent: 88, color: "#7C5CFF", radius: 110 },
      { label: "On-time shifts", percent: 94, color: "#2DD4BF", radius: 90 },
      { label: "Rating quality", percent: 96, color: "#F7C948", radius: 70 }
    ]
  });
  const [line, setLine] = useState({
    title: "Buddy Engagement Trend",
    subtitle: "Requests completed over time",
    points: [12, 18, 22, 30, 28, 40, 43],
    xLabels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov", ""],
    yLabels: ["15k", "20k", "30k", "40k", "45k"],
    footerLeft: "Latest: 43k · Peak: 45k",
    footerRight: "Churn down 6%",
    headlineValue: "43,000",
    headlineLabel: "Revenue retained"
  });

  useEffect(() => {
    if (!buddyId) router.replace("/");
    else fetchMetrics();
  }, [buddyId, buddyId]);

  const fetchMetrics = async () => {
    if (!buddyId) return;
    try {
      const [metricsData, performanceData, idleData, fraudData] = await Promise.all([
        fetchBuddyJson<{
          radial: {
            centerValue: string;
            centerLabel: string;
            rings: { label: string; percent: number; color: string; radius: number }[];
          };
          line: {
            points: number[];
            xLabels: string[];
            headlineValue: string;
            headlineLabel: string;
            footerLeft: string;
            footerRight: string;
          };
        }>(`/users/${buddyId}/dashboard-metrics`),
        fetchBuddyJson<{
          acceptanceRate: number;
          completedJobs: number;
          cancelledJobs: number;
          avgResponseMinutes: number;
          rating: number;
          totalEarned: number;
        }>(`/users/${buddyId}/performance`),
        fetchBuddyJson<{ label: string; count: number }[]>(
          `/users/${buddyId}/idle-suggestions`
        ),
        fetchBuddyJson<{
          repeatedCancellations: boolean;
          cancellationCount: number;
          gpsSpoofing: boolean;
        }>(`/users/${buddyId}/fraud-signals`)
      ]);

      if (metricsData?.radial) {
        setRadial((prev) => ({ ...prev, ...metricsData.radial }));
      }
      if (metricsData?.line) {
        setLine((prev) => ({ ...prev, ...metricsData.line }));
      }
      setPerformance(performanceData ?? null);
      setIdleSuggestions(idleData ?? []);
      setFraudSignals(fraudData ?? null);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  // Removed toggleOnline function as local state and toggle button are removed.

  return (
    <main className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <section className="flex flex-col gap-6 animate-in fade-in duration-500">

        <div className="bg-[#12021f] border border-white/10 rounded-[20px] p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold m-0 text-white">Daily Earnings Goal</h3>
              <p className="text-sm text-white/60 m-0 mt-1">KES 1,200 / KES 3,000</p>
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ${isLoading ? "w-[20%] animate-pulse" : "w-[40%]"}`}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={`tile-skeleton-${index}`} className="p-5 rounded-[18px] bg-white/5 border border-white/10 animate-pulse">
                  <div className="h-3 w-24 rounded bg-white/10" />
                  <div className="h-6 w-20 rounded bg-white/10 mt-3" />
                  <div className="h-3 w-32 rounded bg-white/10 mt-2" />
                </div>
              ))
            : statTiles.map((tile) => (
            <Link key={tile.label} className="flex items-center justify-between p-5 rounded-[18px] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-colors group cursor-pointer" href={tile.href}>
              <div>
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1 block">{tile.label}</span>
                <h3 className="text-2xl font-bold text-white m-0">{tile.value}</h3>
                <p className="text-sm text-white/60 m-0 mt-1">{tile.note}</p>
              </div>
              <span className="text-xl text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500 delay-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <div className="h-[320px] rounded-[24px] bg-white/5 border border-white/10 animate-pulse" />
              <div className="h-[320px] rounded-[24px] bg-white/5 border border-white/10 animate-pulse" />
            </>
          ) : (
            <>
              <RadialPerformanceChart
                title={radial.title}
                subtitle={radial.subtitle}
                centerValue={radial.centerValue}
                centerLabel={radial.centerLabel}
                rings={radial.rings}
              />
              <TrendLineChart
                title={line.title}
                subtitle={line.subtitle}
                points={line.points}
                xLabels={line.xLabels}
                yLabels={line.yLabels}
                footerLeft={line.footerLeft}
                footerRight={line.footerRight}
                headlineValue={line.headlineValue}
                headlineLabel={line.headlineLabel}
              />
            </>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500 delay-150">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white m-0">Performance analytics</h3>
            {performance ? (
              <div className="mt-4 grid gap-2 text-sm text-white/70">
                <div className="flex justify-between"><span>Acceptance rate</span><strong className="text-white">{performance.acceptanceRate}%</strong></div>
                <div className="flex justify-between"><span>Completed jobs</span><strong className="text-white">{performance.completedJobs}</strong></div>
                <div className="flex justify-between"><span>Avg response</span><strong className="text-white">{performance.avgResponseMinutes.toFixed(1)} mins</strong></div>
                <div className="flex justify-between"><span>Rating</span><strong className="text-white">{performance.rating.toFixed(1)}</strong></div>
                <div className="flex justify-between"><span>Total earned</span><strong className="text-white">KES {performance.totalEarned.toLocaleString()}</strong></div>
              </div>
            ) : (
              <div className="mt-4 space-y-2 animate-pulse">
                <div className="h-4 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white m-0">Smart idle positioning</h3>
            <p className="text-sm text-white/60 mt-2">Suggested zones with higher demand.</p>
            <div className="mt-4 flex flex-col gap-2">
              {(idleSuggestions.length ? idleSuggestions : [{ label: "Loading", count: 0 }]).map((item, idx) => (
                <div key={`${item.label}-${idx}`} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <span className="text-white/80">{item.label}</span>
                  <span className="text-xs text-white/60">{item.count} requests</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white m-0">Fraud signals</h3>
            <p className="text-sm text-white/60 mt-2">We monitor unusual activity for safety.</p>
            {fraudSignals ? (
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Repeated cancellations</span>
                  <strong className={`${fraudSignals.repeatedCancellations ? "text-rose-300" : "text-emerald-300"}`}>
                    {fraudSignals.cancellationCount}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>GPS spoofing</span>
                  <strong className={`${fraudSignals.gpsSpoofing ? "text-rose-300" : "text-emerald-300"}`}>
                    {fraudSignals.gpsSpoofing ? "Flagged" : "Clear"}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2 animate-pulse">
                <div className="h-4 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded" />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
