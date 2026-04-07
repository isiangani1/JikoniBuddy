"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";
import { io } from "socket.io-client";
import { pushToast } from "@/lib/toast-store";

type JobRow = {
  id: string;
  title: string;
  seller: string;
  sellerId: string;
  startTime: string;
  locationLabel: string;
  payAmount: number;
  currency: string;
  status: string;
};

const fallbackJobs: JobRow[] = [
  {
    id: "req-101",
    title: "Packaging shift",
    seller: "Chef Amani",
    sellerId: "test-seller-1",
    startTime: new Date(Date.now() - 3600000).toISOString(),
    locationLabel: "Westlands",
    payAmount: 800,
    currency: "KES",
    status: "in_progress"
  },
  {
    id: "req-102",
    title: "Prep Assistant",
    seller: "Nyama Choma Hub",
    sellerId: "seller-2",
    startTime: new Date(Date.now() + 7200000).toISOString(),
    locationLabel: "Kilimani",
    payAmount: 1200,
    currency: "KES",
    status: "scheduled"
  }
];

export default function BuddyPortalActiveJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>(fallbackJobs);
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [isSlideComplete, setIsSlideComplete] = useState(false);
  const lastSentRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [jobNote, setJobNote] = useState("");
  const [disputeNote, setDisputeNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) {
      setIsLoading(false);
      return;
    }
    fetchBuddyJson<JobRow[]>(
      `/users/${buddyId}/jobs?status=scheduled,in_progress`
    )
      .then((data) => {
        if (data?.length) setJobs(data);
      })
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    const socketUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/buddy`, {
      query: { userId: buddyId },
      transports: ["websocket"]
    });

    socket.on("buddy.job_status", (jobUpdate: JobRow) => {
      setJobs((prev) =>
        prev.some((job) => job.id === jobUpdate.id)
          ? prev.map((job) => (job.id === jobUpdate.id ? { ...job, ...jobUpdate } : job))
          : [jobUpdate, ...prev]
      );
      setSelectedJob((prev) =>
        prev?.id === jobUpdate.id ? { ...prev, ...jobUpdate } : prev
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedJob) return;
    if (!navigator.geolocation) return;
    const socketUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/buddy`, { transports: ["websocket"] });
    socket.emit("tracking:join", { orderId: selectedJob.id });

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        if (now - lastSentRef.current < 3000) return;
        lastSentRef.current = now;
        setLastCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        socket.emit("tracking:update", {
          orderId: selectedJob.id,
          buddyId: getBuddyId(),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        });
      },
      () => null,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      socket.emit("tracking:leave", { orderId: selectedJob.id });
      socket.disconnect();
      navigator.geolocation.clearWatch(watchId);
    };
  }, [selectedJob]);

  const handleSliderDrag = () => {
    setIsSlideComplete(true);
    setTimeout(() => {
      completeJob();
    }, 300);
  };

  const completeJob = () => {
    if (!selectedJob) return;
    const helperId = getBuddyId();
    if (!helperId) {
      pushToast({ title: "Login required", message: "Please log in as a buddy.", variant: "error" });
      return;
    }
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    setIsSubmitting(true);
    fetch(`${baseUrl}/api/buddy/jobs/${selectedJob.id}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ helperId, note: jobNote || undefined })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to complete job.");
        pushToast({ title: "Job completed", message: "Seller has been notified.", variant: "success" });
        setSelectedJob(null);
        setIsSlideComplete(false);
        setJobNote("");
        setJobs((prev) => prev.filter((j) => j.id !== selectedJob.id));
      })
      .catch(() =>
        pushToast({ title: "Completion failed", message: "Try again in a moment.", variant: "error" })
      )
      .finally(() => setIsSubmitting(false));
  };

  const handleCheckIn = async () => {
    if (!selectedJob) return;
    const helperId = getBuddyId();
    if (!helperId) return;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/buddy/jobs/${selectedJob.id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, ...lastCoords })
      });
      if (!res.ok) throw new Error();
      pushToast({ title: "Checked in", message: "Your arrival has been recorded.", variant: "success" });
    } catch {
      pushToast({ title: "Check-in failed", message: "Please try again.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedJob) return;
    const helperId = getBuddyId();
    if (!helperId) return;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/buddy/jobs/${selectedJob.id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, ...lastCoords })
      });
      if (!res.ok) throw new Error();
      pushToast({ title: "Checked out", message: "We’ve logged your checkout.", variant: "success" });
    } catch {
      pushToast({ title: "Checkout failed", message: "Please try again.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoteSubmit = async () => {
    if (!selectedJob || !jobNote.trim()) return;
    const helperId = getBuddyId();
    if (!helperId) return;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/buddy/jobs/${selectedJob.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, note: jobNote })
      });
      if (!res.ok) throw new Error();
      pushToast({ title: "Note sent", message: "Seller has been updated.", variant: "success" });
      setJobNote("");
    } catch {
      pushToast({ title: "Note failed", message: "Unable to send note.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!selectedJob || !disputeNote.trim()) return;
    const helperId = getBuddyId();
    if (!helperId) return;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/buddy/jobs/${selectedJob.id}/disputes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId, note: disputeNote })
      });
      if (!res.ok) throw new Error();
      pushToast({ title: "Dispute raised", message: "We’ll review this with the seller.", variant: "info" });
      setDisputeNote("");
    } catch {
      pushToast({ title: "Dispute failed", message: "Unable to submit dispute.", variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex w-full">
      <main
        className={`p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0 transition-[padding] duration-300 ${
          selectedJob ? "pr-[400px]" : ""
        }`}
      >
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0"></p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white m-0">Active Jobs</h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buddy-portal/my-requests">
                View requests
              </Link>
              <Link className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" href="/buddy-portal/history">
                Job history
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2 className="text-xl font-bold text-white m-0">Active job list</h2>
          <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/5 text-white/70 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Job</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Start time</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Pay</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="p-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-28 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-24 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-16 rounded bg-white/10" /></td>
                      </tr>
                    ))
                  : jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`cursor-pointer transition-colors ${
                      selectedJob?.id === job.id ? "bg-purple-500/10" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="p-4 text-teal-300 font-bold" data-label="Job">
                      {job.title}
                    </td>
                    <td className="p-4" data-label="Seller">{job.seller}</td>
                    <td className="p-4" data-label="Start time">
                      {new Date(job.startTime).toLocaleString()}
                    </td>
                    <td className="p-4" data-label="Location">{job.locationLabel}</td>
                    <td className="p-4" data-label="Pay">
                      {job.currency} {job.payAmount.toLocaleString()}
                    </td>
                    <td className="p-4" data-label="Status">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                          job.status === "in_progress"
                            ? "bg-teal-500/15 text-teal-200 border-teal-400/40"
                            : "bg-white/10 text-white/60 border-white/20"
                        }`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoading && jobs.length === 0 && (
              <p className="p-8 text-center text-white/50">You have no active or scheduled jobs.</p>
            )}
          </div>
        </section>
      </main>

      {selectedJob && (
        <aside className="fixed right-0 top-[80px] bottom-0 w-[360px] sm:w-[400px] bg-[#12021f] border-l border-white/10 flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-[#1a1026] to-[#12021f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(45,212,191,0.12)_1px,transparent_1px)] bg-[length:30px_30px] opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-teal-400 text-2xl">📍</div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 font-bold">Connecting to live GPS...</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-8 bg-[#12021f]/95 border-t border-purple-500/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white m-0 mb-2">{selectedJob.title}</h2>
                <p className="m-0 text-white/60 text-sm">
                  {selectedJob.seller} • {selectedJob.locationLabel}
                </p>
              </div>
              <button
                type="button"
                className="text-white/70 hover:text-white text-2xl"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </button>
            </div>

            <h3 className="text-teal-300 text-2xl font-bold m-0">
              {selectedJob.currency} {selectedJob.payAmount}
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-60"
                  onClick={handleCheckIn}
                  disabled={isSubmitting}
                >
                  Check in
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-60"
                  onClick={handleCheckOut}
                  disabled={isSubmitting}
                >
                  Check out
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 uppercase tracking-widest">Job note</label>
                <textarea
                  className="min-h-[80px] rounded-xl border border-white/10 bg-white/5 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add a quick update for the seller..."
                  value={jobNote}
                  onChange={(event) => setJobNote(event.target.value)}
                />
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-60"
                  onClick={handleNoteSubmit}
                  disabled={isSubmitting || !jobNote.trim()}
                >
                  Send note
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/60 uppercase tracking-widest">Dispute</label>
                <textarea
                  className="min-h-[80px] rounded-xl border border-rose-400/30 bg-rose-500/5 text-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Describe the issue if there is a dispute..."
                  value={disputeNote}
                  onChange={(event) => setDisputeNote(event.target.value)}
                />
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-100 font-semibold hover:bg-rose-500/20 transition-colors disabled:opacity-60"
                  onClick={handleDispute}
                  disabled={isSubmitting || !disputeNote.trim()}
                >
                  Raise dispute
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSliderDrag}
              className={`relative flex items-center ${
                isSlideComplete ? "justify-end" : "justify-start"
              } w-full h-12 rounded-full border border-purple-500/70 bg-purple-500/10 text-white/90 uppercase text-[11px] tracking-widest font-bold overflow-hidden transition-all`}
              disabled={isSubmitting}
            >
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                Click or swipe to complete
              </span>
              <span
                className={`h-10 w-10 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30 transition-transform ${
                  isSlideComplete ? "translate-x-0" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
