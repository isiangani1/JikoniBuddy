"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";
import { useRouter } from "next/navigation";

type RequestRow = {
  id: string;
  taskType: string;
  locationLabel: string;
  startTime: string;
  durationHours: number;
  compensation?: number | null;
  status: string;
};

const fallbackRequests: RequestRow[] = [];

export default function BuddyPortalMyRequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>(fallbackRequests);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBuddyJson<RequestRow[]>(`/buddy/requests?status=open`)
      .then((data) => {
        setRequests(data ?? []);
      })
      .catch(() => setRequests([]));
  }, []);

  const handleAccept = async (requestId: string) => {
    const helperId = getBuddyId();
    if (!helperId) {
      setActionStatus("Please log in as a buddy to accept requests.");
      return;
    }
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;
      const response = await fetch(`${baseUrl}/buddy/requests/${requestId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, note: "Buddy accepted via dashboard." })
      });
      if (!response.ok) {
        throw new Error("Unable to accept request.");
      }
      setActionStatus("Request accepted. Moving to active jobs.");
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      router.push("/buddy-portal/active-jobs");
    } catch (error) {
      setActionStatus(
        error instanceof Error ? error.message : "Unable to accept request."
      );
    }
  };

  const handleReject = (requestId: string) => {
    const helperId = getBuddyId();
    if (!helperId) {
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
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        setActionStatus("Request declined.");
      })
      .catch(() => setActionStatus("Unable to decline request."));
  };

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Available Requests</p>
            <h1>Requests from sellers ready for buddies.</h1>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Open requests</h2>
          {actionStatus ? <p className="muted">{actionStatus}</p> : null}
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Location</th>
                  <th>Start time</th>
                  <th>Compensation</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="muted">
                      No open requests yet.
                    </td>
                  </tr>
                ) : null}
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="clickable-row"
                    onClick={() => router.push(`/buddy-portal/offers/${request.id}`)}
                    role="button"
                  >
                    <td data-label="Task">{request.taskType}</td>
                    <td data-label="Location">{request.locationLabel}</td>
                    <td data-label="Start time">
                      {new Date(request.startTime).toLocaleString()}
                    </td>
                    <td data-label="Compensation">
                      {request.compensation ? (
                        <div className="price-chip">
                          <strong>KES {request.compensation.toLocaleString()}</strong>
                          <span>{request.durationHours}h · fixed</span>
                        </div>
                      ) : (
                        "Not set"
                      )}
                    </td>
                    <td data-label="Action">
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAccept(request.id);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="ghost"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleReject(request.id);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                    <td data-label="View" onClick={(event) => event.stopPropagation()}>
                      <Link className="ghost" href={`/buddy-portal/offers/${request.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
