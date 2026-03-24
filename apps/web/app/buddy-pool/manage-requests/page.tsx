"use client";

import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type BuddyRequest = {
  id: string;
  taskType: string;
  locationLabel: string;
  status: string;
};

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState<BuddyRequest[]>([]);
  const [helperId, setHelperId] = useState("helper-1");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      const response = await fetch(`${baseUrl}/buddy/requests`);
      if (response.ok) {
        setRequests(await response.json());
      }
    };
    fetchRequests();
  }, []);

  const confirmHelper = async (requestId: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
    const response = await fetch(`${baseUrl}/buddy/requests/${requestId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helperId })
    });
    setStatus(response.ok ? "Helper confirmed." : "Confirmation failed.");
  };

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Buddy Pool</p>
            <h1>Manage Requests</h1>
            <p className="subhead">Confirm helpers and track request status.</p>
          </div>
          <div className="category-hero-card">
            <h3>Helper ID</h3>
            <input value={helperId} onChange={(e) => setHelperId(e.target.value)} />
          </div>
        </section>

        <section className="section fade-in">
          <h2>All requests</h2>
          <div className="category-grid">
            {requests.map((request) => (
              <div key={request.id} className="category-card">
                <h3>{request.taskType}</h3>
                <p>{request.locationLabel}</p>
                <p className="muted">Status: {request.status}</p>
                <button className="primary" onClick={() => confirmHelper(request.id)}>
                  Confirm Helper
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
