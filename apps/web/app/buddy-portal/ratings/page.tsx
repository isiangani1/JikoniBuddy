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
      `/buddy/users/${buddyId}/ratings`
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
      <main className="category-page">
        <section className="section fade-in">
          <h2>Rating snapshot</h2>
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
        </section>

        <section className="section fade-in">
          <h2>Recent feedback</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={`${review.seller}-${index}`}>
                    <td data-label="Seller">{review.seller}</td>
                    <td data-label="Rating">{review.score.toFixed(1)} ★</td>
                    <td data-label="Comment">
                      {review.comment ?? "No comment"}
                    </td>
                    <td data-label="Date">
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
