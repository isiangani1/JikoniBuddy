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
    enabled: !!sellerId
  });

  if (isLoading) return <div className="p-8 text-white">Crunching historical data...</div>;

  const chartData = data?.chartData || [];
  const totals = data?.totals || { totalRevenue: 0, totalOrders: 0, completionRate: 0, cancellationRate: 0 };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Business Intelligence</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white m-0">Advanced Analytics</h1>
          <p className="text-white/60 text-sm mt-2">Deep-dive into your kitchen&apos;s financial and operational performance.</p>
        </div>
        <div className="flex gap-2 rounded-xl bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setPeriod("7d")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              period === "7d" ? "bg-purple-500 text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPeriod("30d")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              period === "30d" ? "bg-purple-500 text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Gross Revenue</p>
          <h2 className="text-3xl font-extrabold text-white m-0">KES {totals.totalRevenue.toLocaleString()}</h2>
          <p className="text-white/50 text-xs">Total earnings in {period === "7d" ? "week" : "month"}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Order Volume</p>
          <h2 className="text-3xl font-extrabold text-white m-0">{totals.totalOrders}</h2>
          <p className="text-white/50 text-xs">Fulfilled requests</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Completion Rate</p>
          <h2 className="text-3xl font-extrabold text-teal-300 m-0">{totals.completionRate}%</h2>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-teal-400"
              style={{ width: `${totals.completionRate}%` }}
            />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-3">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Cancellation Rate</p>
          <h2 className="text-3xl font-extrabold text-red-400 m-0">{totals.cancellationRate}%</h2>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-red-400"
              style={{ width: `${totals.cancellationRate}%` }}
            />
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <TrendLineChart
          title="Revenue Growth"
          subtitle={`Trajectory over ${period}`}
          points={chartData.map((d: any) => d.revenue)}
          xLabels={chartData.map((d: any, i: number) => (i % (period === "7d" ? 1 : 5) === 0 ? d.date.split("-")[2] : ""))}
          yLabels={["0", "15k", "30k", "45k+"]}
          headlineValue={`KES ${totals.totalRevenue.toLocaleString()}`}
          headlineLabel="Historical Earnings"
        />
        <TrendLineChart
          title="Demand Patterns"
          subtitle="Orders received over time"
          points={chartData.map((d: any) => d.orders)}
          xLabels={chartData.map((d: any, i: number) => (i % (period === "7d" ? 1 : 5) === 0 ? d.date.split("-")[2] : ""))}
          yLabels={["0", "10", "20", "30+"]}
          headlineValue={totals.totalOrders.toString()}
          headlineLabel="Total Orders"
        />
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Loss & Performance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="text-[11px] uppercase tracking-wider text-white/40 border-b border-white/10">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Cancelled</th>
                <th className="p-4">Revenue Lost (Est)</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {chartData.filter((d: any) => d.cancelled > 0).reverse().map((day: any) => (
                <tr key={day.date} className="border-b border-white/5">
                  <td className="p-4">{new Date(day.date).toLocaleDateString()}</td>
                  <td className="p-4">{day.orders}</td>
                  <td className="p-4 text-red-400 font-semibold">{day.cancelled}</td>
                  <td className="p-4 text-white/60">KES {(day.cancelled * 450).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-1 rounded">
                      Investigate
                    </span>
                  </td>
                </tr>
              ))}
              {chartData.filter((d: any) => d.cancelled > 0).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">
                    Perfect Performance! No cancellations detected in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
