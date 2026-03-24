"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";

type RequestDetail = {
  id: string;
  sellerId: string;
  taskType: string;
  locationLabel: string;
  startTime: string;
  endTime?: string | null;
  durationHours: number;
  compensation?: number | null;
  status: string;
};

const fallbackRequest: RequestDetail = {
  id: "req-1",
  sellerId: "seller-kilimani",
  taskType: "Cooking",
  locationLabel: "Kilimani",
  startTime: "2026-03-19T15:00:00.000Z",
  endTime: "2026-03-19T17:00:00.000Z",
  durationHours: 2,
  compensation: 1500,
  status: "open"
};

export default function BuddyRequestDetailPage() {
  const params = useParams();
  const requestId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [request, setRequest] = useState<RequestDetail>(fallbackRequest);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    fetchBuddyJson<RequestDetail>(`/buddy/requests/${requestId}`)
      .then((data: RequestDetail) => {
        if (data?.id) setRequest(data);
      })
      .catch(() => null);
  }, [requestId]);

  const handleAccept = async () => {
    const helperId = getBuddyId();
    if (!helperId || !requestId) {
      setActionStatus("Please log in as a buddy to accept requests.");
      return;
    }
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      const response = await fetch(`${baseUrl}/buddy/requests/${requestId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, note: "Buddy accepted via request detail." })
      });
      if (!response.ok) {
        throw new Error("Unable to accept request.");
      }
      setActionStatus("Request accepted. Redirecting to active jobs.");
      window.location.href = "/buddy-portal/active-jobs";
    } catch (error) {
      setActionStatus(
        error instanceof Error ? error.message : "Unable to accept request."
      );
    }
  };

  const handleReject = () => {
    const helperId = getBuddyId();
    if (!helperId || !requestId) {
      setActionStatus("Please log in as a buddy to reject requests.");
      return;
    }
    const baseUrl =
      process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
    fetch(`${baseUrl}/buddy/requests/${requestId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helperId })
    })
      .then(() => {
      setActionStatus("Request declined.");
      window.location.href = "/buddy-portal/my-requests";
      })
      .catch(() => setActionStatus("Unable to decline request."));
  };

  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Request details</p>
          <h1>
            {request.taskType} request · {request.locationLabel}
          </h1>
          <p className="subhead">
            Review the task scope, time window, and compensation before you
            accept.
          </p>
          <div className="hero-actions">
            <Link className="primary" href="/buddy-portal/my-requests">
              Back to requests
            </Link>
            <Link className="ghost" href="/buddy-portal/active-jobs">
              View active jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="section fade-in">
        {actionStatus ? <p className="muted">{actionStatus}</p> : null}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Detail</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Detail">Seller</td>
                <td data-label="Value">{request.sellerId}</td>
              </tr>
              <tr>
                <td data-label="Detail">Task type</td>
                <td data-label="Value">{request.taskType}</td>
              </tr>
              <tr>
                <td data-label="Detail">Location</td>
                <td data-label="Value">{request.locationLabel}</td>
              </tr>
              <tr>
                <td data-label="Detail">Start time</td>
                <td data-label="Value">
                  {new Date(request.startTime).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td data-label="Detail">End time</td>
                <td data-label="Value">
                  {request.endTime
                    ? new Date(request.endTime).toLocaleString()
                    : "TBD"}
                </td>
              </tr>
              <tr>
                <td data-label="Detail">Duration</td>
                <td data-label="Value">{request.durationHours} hours</td>
              </tr>
              <tr>
                <td data-label="Detail">Compensation</td>
                <td data-label="Value">
                  {request.compensation
                    ? `KES ${request.compensation.toLocaleString()}`
                    : "Not set"}
                </td>
              </tr>
              <tr>
                <td data-label="Detail">Status</td>
                <td data-label="Value">
                  <span className="status-pill">{request.status}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="hero-actions" style={{ marginTop: "1.2rem" }}>
          <button className="primary" type="button" onClick={handleAccept}>
            Accept request
          </button>
          <button className="ghost" type="button" onClick={handleReject}>
            Reject request
          </button>
        </div>
      </section>
    </main>
  );
}
