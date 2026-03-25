"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";

type RatingStat = {
  label: string;
  value: string;
  icon: keyof typeof iconSvg;
  trend: number[];
};

type RatingRow = {
  seller: string;
  score: number;
  comment?: string | null;
  createdAt: string;
};

const fallbackStats: RatingStat[] = [
  {
    label: "Overall rating",
    value: "4.8",
    icon: "star",
    trend: [4.4, 4.6, 4.5, 4.7, 4.8, 4.8, 4.9]
  },
  {
    label: "Total reviews",
    value: "186",
    icon: "chat",
    trend: [120, 132, 148, 162, 173, 180, 186]
  },
  {
    label: "Repeat sellers",
    value: "42",
    icon: "repeat",
    trend: [20, 26, 30, 34, 38, 40, 42]
  },
  {
    label: "On-time rate",
    value: "97%",
    icon: "clock",
    trend: [92, 94, 95, 96, 97, 97, 98]
  }
];

const fallbackReviews: RatingRow[] = [
  {
    seller: "Chef Amani",
    score: 5.0,
    comment: "Fast packaging and great communication.",
    createdAt: "2026-03-17T12:00:00.000Z"
  },
  {
    seller: "Nairobi Kitchen",
    score: 4.8,
    comment: "Reliable arrival time and solid prep work.",
    createdAt: "2026-03-14T12:00:00.000Z"
  },
  {
    seller: "Swahili Spice",
    score: 4.9,
    comment: "Handled a rush shift smoothly.",
    createdAt: "2026-03-11T12:00:00.000Z"
  }
];

const iconSvg = {
  star: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 19.8l1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14v9H8l-3 3z" />
    </svg>
  ),
  repeat: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10l-3-3M17 17H7l3 3" />
      <path d="M7 7v6M17 17v-6" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
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

export default function BuddyPortalRatingsPage() {
  const [stats, setStats] = useState<RatingStat[]>(fallbackStats);
  const [reviews, setReviews] = useState<RatingRow[]>(fallbackReviews);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    fetchBuddyJson<{ stats: RatingStat[]; reviews: RatingRow[] }>(
      `/users/${buddyId}/ratings`
    )
      .then((data) => {
        if (data?.stats?.length) {
          setStats(data.stats);
        }
        if (data?.reviews?.length) {
          setReviews(data.reviews);
        }
      })
      .catch(() => null);
  }, []);

  const averageScore = useMemo(() => {
    if (!reviews.length) return "4.8";
    const sum = reviews.reduce((acc, item) => acc + item.score, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <>
      <main className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <section className="flex flex-col gap-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white m-0">Rating snapshot</h2>
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
                        <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-current [&>svg]:fill-none [&>svg]:stroke-2">{iconSvg[stat.icon]}</span>
                        <span className="font-medium text-white/90">{stat.label}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xl font-bold text-white" data-label="Value">{stat.value}</td>
                    <td className="p-4" data-label="Trend">
                      <svg
                        className="w-24 h-6 stroke-yellow-400 fill-none stroke-2 stroke-linecap-round stroke-linejoin-round"
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
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500 mt-4">
          <h2 className="text-2xl font-bold text-white m-0">Recent feedback</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Seller</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Rating</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Comment</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.map((review, index) => (
                  <tr key={`${review.seller}-${index}`} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white" data-label="Seller">{review.seller}</td>
                    <td className="p-4 font-bold text-yellow-400" data-label="Rating">{review.score.toFixed(1)} ★</td>
                    <td className="p-4 text-white/80" data-label="Comment">
                      {review.comment ?? <span className="text-white/40 italic">No comment</span>}
                    </td>
                    <td className="p-4 text-white/60" data-label="Date">
                      {new Date(review.createdAt).toLocaleDateString()}
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
