"use client";

import { useEffect, useState } from "react";

type BuddyRequest = {
  id: string;
  taskType: string;
  locationLabel: string;
  status: string;
  createdAt: string;
};

export default function AdminBuddyPoolPage() {
  const [requests, setRequests] = useState<BuddyRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      const response = await fetch(`${baseUrl}/api/buddy/requests`);
      if (response.ok) {
        setRequests(await response.json());
      }
    };
    fetchRequests();
  }, []);

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-red-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-red-300 font-bold tracking-widest uppercase text-sm m-0">Admin</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Buddy Pool Oversight</h1>
            <p className="text-white/70 m-0 text-lg">Monitor requests, status, and demand.</p>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-white m-0 mb-1">Total requests</h3>
            <p className="text-5xl font-extrabold text-red-400 m-0">{requests.length}</p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white m-0">Recent requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-red-500/40 transition-colors flex flex-col">
                <h3 className="text-xl font-bold text-white m-0 mb-2">{request.taskType}</h3>
                <p className="text-white/80 m-0 mb-4">{request.locationLabel}</p>
                <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-1">
                  <p className="text-sm text-white/60 m-0 flex justify-between">
                    <span>Status:</span> <span className="font-semibold text-white/90">{request.status}</span>
                  </p>
                  <p className="text-xs text-white/40 m-0">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
