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
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      const response = await fetch(`${baseUrl}/buddy/requests`);
      if (response.ok) {
        setRequests(await response.json());
      }
    };
    fetchRequests();
  }, []);

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Admin</p>
            <h1>Buddy Pool Oversight</h1>
            <p className="subhead">Monitor requests, status, and demand.</p>
          </div>
          <div className="category-hero-card">
            <h3>Total requests</h3>
            <p className="muted">{requests.length}</p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Recent requests</h2>
          <div className="category-grid">
            {requests.map((request) => (
              <div key={request.id} className="category-card">
                <h3>{request.taskType}</h3>
                <p>{request.locationLabel}</p>
                <p className="muted">Status: {request.status}</p>
                <p className="muted">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
