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
    fetchBuddyJson<RequestDetail>(`/requests/${requestId}`)
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
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      const response = await fetch(`${baseUrl}/api/buddy/requests/${requestId}/apply`, {
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
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    fetch(`${baseUrl}/api/buddy/requests/${requestId}/reject`, {
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
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Request details</p>
          <h1>
            {request.taskType} request · {request.locationLabel}
          </h1>
          <p className="text-white/70 m-0 text-lg">
            Review the task scope, time window, and compensation before you
            accept.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buddy-portal/my-requests">
              Back to requests
            </Link>
            <Link className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" href="/buddy-portal/active-jobs">
              View active jobs
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        {actionStatus ? <p className="text-white/50 text-sm">{actionStatus}</p> : null}
        <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
          <table className="w-full text-left text-sm text-white">
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
        <div className="flex flex-wrap gap-3 mt-5">
          <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button" onClick={handleAccept}>
            Accept request
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" type="button" onClick={handleReject}>
            Reject request
          </button>
        </div>
      </section>
    </main>
  );
}
