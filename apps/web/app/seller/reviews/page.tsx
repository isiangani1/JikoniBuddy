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

  if (isLoading) return <div className="p-8 text-center text-white/50"><p className="animate-pulse">Syncing reputation data...</p></div>;

  const reviews = data?.reviews || [];
  const chartData = data?.chartData || [];
  const totalAvg = data?.totalAvg || "5.0";

  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-white/10 pb-6">
        <p className="text-yellow-400 font-bold tracking-widest uppercase text-sm m-0">Trust & Safety</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Reviews & Reputation</h1>
        <p className="text-white/60 m-0 text-lg">Listen to your customers and track your standing in the marketplace.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        <div className="bg-gradient-to-b from-[#211a30] to-[#120a1f] border border-white/10 shadow-2xl rounded-[24px] flex flex-col items-center justify-center p-8 lg:p-12 text-center w-full lg:w-1/3 min-h-[300px]">
          <p className="font-bold text-white/50 tracking-widest uppercase text-xs mb-4">Current Reputation</p>
          <h2 className="text-6xl sm:text-7xl font-extrabold m-0 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.2)]">{totalAvg}</h2>
          <div className="text-2xl sm:text-3xl text-yellow-400 mt-3 mb-6 flex justify-center gap-1 drop-shadow-md">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className={i < Math.floor(parseFloat(totalAvg)) ? "opacity-100" : "opacity-20 text-white/30"}>{s}</span>
            ))}
          </div>
          <p className="text-sm text-white/60 m-0 font-medium">Based on <strong className="text-white">{reviews.length}</strong> verified order ratings</p>
        </div>

        <div className="w-full lg:w-2/3 bg-white/5 border border-white/10 rounded-[24px] overflow-hidden p-6 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
      </div>

      <section className="flex flex-col gap-6 mt-4">
        <h3 className="text-2xl font-bold text-white m-0 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">💬</span>
          Customer Feedback
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((r: any) => (
            <div key={r.id} className="bg-white/5 p-6 rounded-[20px] border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 flex flex-col shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex text-lg gap-0.5">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className={i < r.value ? "text-teal-400" : "text-white/10"}>{s}</span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white/40 tracking-wider">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-teal-400/10 text-teal-400 px-2.5 py-1 rounded-md border border-teal-400/20 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Verified Purchase
                </span>
              </div>
              <p className="m-0 text-white/90 leading-relaxed font-medium text-[15px] flex-1">
                "{r.comment || <span className="text-white/40 italic font-normal">The customer didn't leave a text review, but gave a high star rating.</span>}"
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
                <button className="flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-colors border border-white/10 bg-white/5 hover:bg-white/10 text-white flex justify-center items-center gap-2">
                  <span>↩️</span> Reply
                </button>
                <button className="w-auto py-2 px-4 rounded-xl text-sm font-semibold transition-colors border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400" title="Report this review">
                  Report
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white/5 rounded-[24px] border-2 border-dashed border-white/10 flex flex-col items-center gap-4">
              <span className="text-5xl opacity-30">🤝</span>
              <p className="text-white/60 m-0 text-lg font-medium">No reviews received yet. Your reputation will build as you fulfill orders!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
