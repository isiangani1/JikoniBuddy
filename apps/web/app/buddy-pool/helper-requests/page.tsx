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
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      const response = await fetch(`${baseUrl}/buddy/requests?status=open`);
      if (response.ok) {
        setRequests(await response.json());
      }
    };
    fetchRequests();
  }, []);

  const applyToRequest = async (requestId: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
    const response = await fetch(`${baseUrl}/buddy/requests/${requestId}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helperId })
    });
    setStatus(response.ok ? "Applied successfully." : "Application failed.");
  };

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Pool</p>
            <h1>Helper Requests</h1>
            <p className="subhead">Browse open requests and apply instantly.</p>
          </div>
          <div className="category-hero-card">
            <h3>Helper ID</h3>
            <input
              value={helperId}
              onChange={(e) => setHelperId(e.target.value)}
            />
          </div>
        </section>

        <section className="section fade-in">
          <h2>Open requests</h2>
          <div className="category-grid">
            {requests.map((request) => (
              <div key={request.id} className="category-card">
                <h3>{request.taskType}</h3>
                <p>{request.locationLabel}</p>
                <p>
                  {new Date(request.startTime).toLocaleString()} →
                  {" "}
                  {new Date(request.endTime).toLocaleString()}
                </p>
                <button className="primary" onClick={() => applyToRequest(request.id)}>
                  Apply
                </button>
              </div>
            ))}
          </div>
          {status ? <p className="muted">{status}</p> : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
