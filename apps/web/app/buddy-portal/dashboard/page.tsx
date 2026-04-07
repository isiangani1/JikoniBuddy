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
    }>(`/users/${buddyId}/dashboard-metrics`)
      .then((data) => {
        if (data?.radial) {
          setRadial((prev) => ({ ...prev, ...data.radial }));
        }
        if (data?.line) {
          setLine((prev) => ({ ...prev, ...data.line }));
        }
      })
      .catch(() => null);
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
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[40%]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statTiles.map((tile) => (
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
        </div>
      </section>
    </main>
  );
}
