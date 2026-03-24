"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { TrendLineChart } from "@/components/DashboardCharts";

export default function SellerReviewsPage() {
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["sellerReviews", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const res = await fetch(`/api/seller/reviews?sellerId=${sellerId}`);
      if (!res.ok) throw new Error("Failed to load reviews");
      return res.json();
    },
    enabled: !!sellerId,
  });

  if (isLoading) return <div style={{ padding: "2rem", color: "white" }}>Syncing reputation data...</div>;

  const reviews = data?.reviews || [];
  const chartData = data?.chartData || [];
  const totalAvg = data?.totalAvg || "5.0";

  return (
    <main style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">Trust & Safety</p>
        <h1 style={{ margin: "0.2rem 0" }}>Reviews & Reputation</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Listen to your customers and track your standing in the marketplace.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start", marginBottom: "3rem" }}>
        <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <p className="eyebrow">CURRENT REPUTATION</p>
          <h2 style={{ fontSize: "5rem", margin: "1rem 0", color: "#F7C948" }}>{totalAvg}</h2>
          <div style={{ fontSize: "1.5rem", color: "#F7C948", marginBottom: "1rem" }}>
            {"★★★★★".split("").map((s, i) => (
              <span key={i} style={{ opacity: i < Math.floor(parseFloat(totalAvg)) ? 1 : 0.2 }}>{s}</span>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Based on {reviews.length} verified order ratings</p>
        </div>

        <TrendLineChart 
          title="Rating Trajectory"
          subtitle="Monthly average trend"
          points={chartData.map((d: any) => d.avg)}
          xLabels={chartData.map((d: any) => d.month.split('-')[1])}
          yLabels={["0", "1", "2", "3", "4", "5"]}
          headlineValue={`${totalAvg} / 5`}
          headlineLabel="Trend Strength"
        />
      </div>

      <section>
        <h3 style={{ marginBottom: "1.5rem" }}>Customer Feedback</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          {reviews.map((r: any) => (
            <div key={r.id} style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} style={{ color: i < r.value ? "#2dd4bf" : "rgba(255,255,255,0.1)" }}>{s}</span>
                  ))}
                  <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <span style={{ fontSize: "0.75rem", background: "rgba(45,212,191,0.1)", color: "#2dd4bf", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>VERIFIED PURCHASE</span>
              </div>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>
                {r.comment || "The customer didn't leave a text review, but gave a high star rating."}
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
                <button className="ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>Reply</button>
                <button className="ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", color: "#ff4e50" }}>Report</button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div style={{ padding: "4rem", textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <p style={{ color: "rgba(255,255,255,0.3)", margin: 0 }}>No reviews received yet. Your reputation will build as you fulfill orders!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
