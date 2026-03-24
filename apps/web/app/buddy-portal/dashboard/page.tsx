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
    }>(`/buddy/users/${buddyId}/dashboard-metrics`)
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
    <main className="category-page">
      <section className="section fade-in">



        <div className="earnings-tracker-card">
          <div className="earnings-header">
            <div>
              <h3 style={{ margin: 0 }}>Daily Earnings Goal</h3>
              <p style={{ margin: '0.2rem 0 0', color: 'rgba(255,255,255,0.6)' }}>KES 1,200 / KES 3,000</p>
            </div>
            <div style={{ textAlign: 'right' }}>
            </div>
          </div>
          <div className="earnings-progress-bar">
            <div className="earnings-progress-fill" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="dashboard-tiles">
          {statTiles.map((tile) => (
            <Link key={tile.label} className="dashboard-tile" href={tile.href}>
              <div>
                <span className="tile-label">{tile.label}</span>
                <h3>{tile.value}</h3>
                <p className="muted">{tile.note}</p>
              </div>
              <span className="tile-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section fade-in">
        <div className="dashboard-charts">
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
