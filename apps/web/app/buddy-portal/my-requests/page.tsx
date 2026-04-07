"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";
import { pushToast } from "@/lib/toast-store";
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBuddyJson<RequestRow[]>(`/requests?status=open`)
      .then((data) => {
        setRequests(data ?? []);
      })
      .catch(() => setRequests([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAccept = async (requestId: string) => {
    const helperId = getBuddyId();
    if (!helperId) {
      setActionStatus("Please log in as a buddy to accept requests.");
      pushToast({ title: "Login required", message: "Please log in as a buddy to accept requests.", variant: "error" });
      return;
    }
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      const response = await fetch(`${baseUrl}/api/buddy/requests/${requestId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, note: "Buddy accepted via dashboard." })
      });
      if (!response.ok) {
        throw new Error("Unable to accept request.");
      }
      setActionStatus("Request accepted. Moving to active jobs.");
      pushToast({ title: "Request accepted", message: "You are now assigned to this job.", variant: "success" });
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      router.push("/buddy-portal/active-jobs");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to accept request.";
      setActionStatus(message);
      pushToast({ title: "Request failed", message, variant: "error" });
    }
  };

  const handleReject = (requestId: string) => {
    const helperId = getBuddyId();
    if (!helperId) {
      setActionStatus("Please log in as a buddy to reject requests.");
      pushToast({ title: "Login required", message: "Please log in as a buddy to reject requests.", variant: "error" });
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
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        setActionStatus("Request declined.");
        pushToast({ title: "Request declined", message: "We’ll stop showing this request.", variant: "info" });
      })
      .catch(() => {
        setActionStatus("Unable to decline request.");
        pushToast({ title: "Decline failed", message: "Unable to decline request.", variant: "error" });
      });
  };

  return (
    <>
      <main className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <section className="flex flex-col gap-4 bg-gradient-to-br from-[#1a0b2e] to-[#0c0612] p-8 md:p-12 rounded-[24px] border border-white/10 relative overflow-hidden">
          <div className="flex flex-col gap-2 z-10">
            <p className="text-pink-400 font-bold tracking-widest uppercase text-sm m-0">Available Requests</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white m-0">Requests from sellers ready for buddies.</h1>
          </div>
        </section>

        <section className="flex flex-col gap-4 animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-white m-0">Open requests</h2>
          {actionStatus ? <p className="text-sm text-white/60 m-0">{actionStatus}</p> : null}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Task</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Location</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Start time</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Compensation</th>
                  <th className="p-4 border-b border-white/10 text-white/50 text-xs font-bold uppercase tracking-wider bg-[#12021f]/50">Action</th>
                  <th className="p-4 border-b border-white/10 bg-[#12021f]/50"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="p-4"><div className="h-4 w-32 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-40 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-36 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-8 w-32 rounded bg-white/10" /></td>
                      <td className="p-4"><div className="h-4 w-16 rounded bg-white/10" /></td>
                    </tr>
                  ))
                ) : null}
                {!isLoading && requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-white/40 italic">
                      No open requests yet.
                    </td>
                  </tr>
                ) : null}
                {!isLoading && requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/buddy-portal/offers/${request.id}`)}
                    role="button"
                  >
                    <td className="p-4 text-white font-medium" data-label="Task">{request.taskType}</td>
                    <td className="p-4 text-white/80" data-label="Location">{request.locationLabel}</td>
                    <td className="p-4 text-white/80" data-label="Start time">
                      {new Date(request.startTime).toLocaleString()}
                    </td>
                    <td className="p-4" data-label="Compensation">
                      {request.compensation ? (
                        <div className="inline-flex flex-col gap-1">
                          <strong className="text-white">KES {request.compensation.toLocaleString()}</strong>
                          <span className="text-[11px] text-white/50 uppercase tracking-wider">{request.durationHours}h · fixed</span>
                        </div>
                      ) : (
                        <span className="text-white/40 italic">Not set</span>
                      )}
                    </td>
                    <td className="p-4" data-label="Action">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAccept(request.id);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleReject(request.id);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                    <td className="p-4" data-label="View" onClick={(event) => event.stopPropagation()}>
                      <Link className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors" href={`/buddy-portal/offers/${request.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && requests.length === 0 ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div>
                <h3 className="text-lg font-semibold text-white m-0">No requests in your area yet</h3>
                <p className="m-0 mt-2 text-sm text-white/60">
                  Stay online and we’ll notify you the moment a seller needs help.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
                <Link
                  href="/buddy-portal/status"
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                >
                  Update status
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
