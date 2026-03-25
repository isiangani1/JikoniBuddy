"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type BuddyRequest = {
  id: string;
  taskType: string;
  locationLabel: string;
  startTime: string;
  endTime: string;
};

export default function HelperRequestsPage() {
  const [requests, setRequests] = useState<BuddyRequest[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [helperId, setHelperId] = useState("helper-1");

  useEffect(() => {
    const fetchRequests = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      const response = await fetch(`${baseUrl}/api/buddy/requests?status=open`);
      if (response.ok) {
        setRequests(await response.json());
      }
    };
    fetchRequests();
  }, []);

  const applyToRequest = async (requestId: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const response = await fetch(`${baseUrl}/api/buddy/requests/${requestId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helperId })
    });
    setStatus(response.ok ? "Applied successfully." : "Application failed.");
  };

  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Buddy Pool</p>
            <h1>Helper Requests</h1>
            <p className="text-white/70 m-0 text-lg">Browse open requests and apply instantly.</p>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Helper ID</h3>
            <input
              value={helperId}
              onChange={(e) => setHelperId(e.target.value)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Open requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
                <h3>{request.taskType}</h3>
                <p>{request.locationLabel}</p>
                <p>
                  {new Date(request.startTime).toLocaleString()} →
                  {" "}
                  {new Date(request.endTime).toLocaleString()}
                </p>
                <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" onClick={() => applyToRequest(request.id)}>
                  Apply
                </button>
              </div>
            ))}
          </div>
          {status ? <p className="text-white/50 text-sm">{status}</p> : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
