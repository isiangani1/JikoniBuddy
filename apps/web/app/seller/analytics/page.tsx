"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { TrendLineChart } from "@/components/DashboardCharts";

export default function SellerAnalyticsPage() {
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    setSellerId(localStorage.getItem("jb_session") || "test-seller-1");
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["sellerDeepAnalytics", sellerId, period],
    queryFn: async () => {
      if (!sellerId) return null;
      const res = await fetch(`/api/seller/analytics?sellerId=${sellerId}&period=${period}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: !!sellerId,
  });

  if (isLoading) return <div style={{ padding: "2rem", color: "white" }}>Crunching historical data...</div>;

  const chartData = data?.chartData || [];
  const totals = data?.totals || { totalRevenue: 0, totalOrders: 0, completionRate: 0, cancellationRate: 0 };

  return (
    <main style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Business Intelligence</p>
          <h1 style={{ margin: "0.2rem 0" }}>Advanced Analytics</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Deep-dive into your kitchen's financial and operational performance.</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.4rem", borderRadius: "10px", display: "flex", gap: "0.5rem" }}>
          <button 
             onClick={() => setPeriod("7d")}
             style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer", background: period === "7d" ? "#7C5CFF" : "transparent", color: "white" }}
          >
            Last 7 Days
          </button>
          <button 
             onClick={() => setPeriod("30d")}
             style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer", background: period === "30d" ? "#7C5CFF" : "transparent", color: "white" }}
          >
            Last 30 Days
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">GROSS REVENUE</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>KES {totals.totalRevenue.toLocaleString()}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Total earnings in {period === '7d' ? 'week' : 'month'}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">ORDER VOLUME</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{totals.totalOrders}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Fulfilled requests</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">COMPLETION RATE</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0", color: "#2dd4bf" }}>{totals.completionRate}%</h2>
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginTop: "0.5rem" }}>
            <div style={{ width: `${totals.completionRate}%`, height: "100%", background: "#2dd4bf", borderRadius: "2px" }}></div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">CANCELLATION RATE</p>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0", color: "#ff4e50" }}>{totals.cancellationRate}%</h2>
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginTop: "0.5rem" }}>
            <div style={{ width: `${totals.cancellationRate}%`, height: "100%", background: "#ff4e50", borderRadius: "2px" }}></div>
          </div>
        </div>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        <TrendLineChart 
          title="Revenue Growth"
          subtitle={`Trajectory over ${period}`}
          points={chartData.map((d: any) => d.revenue)}
          xLabels={chartData.map((d: any, i: number) => i % (period === '7d' ? 1 : 5) === 0 ? d.date.split('-')[2] : "")}
          yLabels={["0", "15k", "30k", "45k+"]}
          headlineValue={`KES ${totals.totalRevenue.toLocaleString()}`}
          headlineLabel="Historical Earnings"
        />
        <TrendLineChart 
          title="Demand Patterns"
          subtitle="Orders received over time"
          points={chartData.map((d: any) => d.orders)}
          xLabels={chartData.map((d: any, i: number) => i % (period === '7d' ? 1 : 5) === 0 ? d.date.split('-')[2] : "")}
          yLabels={["0", "10", "20", "30+"]}
          headlineValue={totals.totalOrders.toString()}
          headlineLabel="Total Orders"
        />
      </section>

      <section style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Loss & Performance Matrix</h3>
        <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Total Orders</th>
              <th style={{ padding: "1rem" }}>Cancelled</th>
              <th style={{ padding: "1rem" }}>Revenue Lost (Est)</th>
              <th style={{ padding: "1rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {chartData.filter((d: any) => d.cancelled > 0).reverse().map((day: any) => (
              <tr key={day.date} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: "1rem" }}>{new Date(day.date).toLocaleDateString()}</td>
                <td style={{ padding: "1rem" }}>{day.orders}</td>
                <td style={{ padding: "1rem", color: "#ff4e50", fontWeight: "bold" }}>{day.cancelled}</td>
                <td style={{ padding: "1rem", color: "rgba(255,255,255,0.6)" }}>KES {(day.cancelled * 450).toLocaleString()}</td>
                <td style={{ padding: "1rem" }}>
                   <span style={{ fontSize: "0.7rem", color: "#ff4e50", background: "rgba(255,78,80,0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>INVESTIGATE</span>
                </td>
              </tr>
            ))}
            {chartData.filter((d: any) => d.cancelled > 0).length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                  Perfect Performance! No cancellations detected in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
