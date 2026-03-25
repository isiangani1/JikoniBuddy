"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";
import { io } from "socket.io-client";

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
  const [sliderPos, setSliderPos] = useState(4); // For the UI slider
  const lastSentRef = useRef(0);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    fetchBuddyJson<JobRow[]>(
      `/users/${buddyId}/jobs?status=scheduled,in_progress`
    )
      .then((data) => {
        if (data?.length) setJobs(data);
      })
      .catch(() => null);
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
        socket.emit("tracking:update", {
          orderId: selectedJob.id,
          buddyId: getBuddyId(),
          lat: position.coords.latitude,
          lng: position.coords.longitude
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

  const handleSliderDrag = (e: React.TouchEvent | React.MouseEvent) => {
    // A simple mock for sliding to complete
    setSliderPos(200);
    setTimeout(() => {
      completeJob();
    }, 300);
  };

  const completeJob = () => {
    if (!selectedJob) return;
    const socketUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketUrl}/ws/buddy`, { transports: ["websocket"] });
    
    socket.emit("buddy.job_completed", {
      requestId: selectedJob.id,
      helperId: getBuddyId(),
      sellerId: selectedJob.sellerId,
      payAmount: selectedJob.payAmount
    });

    alert("Awesome! Job marked as complete. The Seller has been notified to approve your M-Pesa payout.");
    setSelectedJob(null);
    setSliderPos(4);
    
    // Optimistically update UI
    setJobs(prev => prev.filter(j => j.id !== selectedJob.id));
  };

  return (
    <div style={{ display: "flex", width: "100%", position: "relative" }}>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0" style={{ flex: 1, paddingRight: selectedJob ? "400px" : "0", transition: "padding 0.3s" }}>
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0"></p>
            <h1>Active Jobs</h1>
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
          <h2>Active job list</h2>
          <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <table className="w-full text-left text-sm text-white" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Seller</th>
                  <th>Start time</th>
                  <th>Location</th>
                  <th>Pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    style={{ cursor: "pointer", background: selectedJob?.id === job.id ? "rgba(124, 92, 255, 0.1)" : "transparent" }}
                  >
                    <td data-label="Job" style={{ fontWeight: "bold", color: "#2dd4bf" }}>{job.title}</td>
                    <td data-label="Seller">{job.seller}</td>
                    <td data-label="Start time">
                      {new Date(job.startTime).toLocaleString()}
                    </td>
                    <td data-label="Location">{job.locationLabel}</td>
                    <td data-label="Pay">
                      {job.currency} {job.payAmount.toLocaleString()}
                    </td>
                    <td data-label="Status">
                      <span className="status-pill" style={{ background: job.status === 'in_progress' ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.1)' }}>
                        {job.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>You have no active or scheduled jobs.</p>}
          </div>
        </section>
      </main>

      {/* Side Panel Split View */}
      {selectedJob && (
        <aside style={{ 
          position: "fixed", right: 0, top: "80px", bottom: 0, width: "400px", 
          background: "#12021f", borderLeft: "1px solid rgba(255,255,255,0.1)", 
          display: "flex", flexDirection: "column", zIndex: 10,
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
          animation: "slideInRight 0.3s ease-out"
        }}>
          <div style={{ 
            flex: 1, 
            background: "linear-gradient(135deg, #1a1026 0%, #12021f 100%)", 
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Subtle Map Grid/Scan Effect */}
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              backgroundImage: "radial-gradient(circle, rgba(45, 212, 191, 0.1) 1px, transparent 1px)", 
              backgroundSize: "30px 30px" 
            }}></div>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center"
            }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                borderRadius: "50%", 
                border: "2px solid #2DD4BF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                animation: "pulse 2s infinite"
              }}>
                <span style={{ fontSize: "1.5rem" }}>📍</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", fontWeight: "bold", letterSpacing: "1px" }}>CONNECTING TO LIVE GPS...</p>
            </div>
          </div>
          
          <div style={{ padding: "2rem", background: "rgba(18, 2, 31, 0.95)", borderTop: "1px solid #7C5CFF", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ margin: "0 0 0.5rem" }}>{selectedJob.title}</h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>{selectedJob.seller} • {selectedJob.locationLabel}</p>
              </div>
              <button 
                onClick={() => setSelectedJob(null)} 
                style={{ background: "transparent", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}
              >×</button>
            </div>

            <h3 style={{ color: "#2dd4bf", margin: "0 0 1.5rem", fontSize: "1.5rem" }}>{selectedJob.currency} {selectedJob.payAmount}</h3>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input type="checkbox" id="task1" style={{ width: "20px", height: "20px" }} />
                <label htmlFor="task1">Arrive at {selectedJob.seller}'s kitchen</label>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input type="checkbox" id="task2" style={{ width: "20px", height: "20px" }} />
                <label htmlFor="task2">Complete required shift duties</label>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input type="checkbox" id="task3" style={{ width: "20px", height: "20px" }} />
                <label htmlFor="task3">Clean workstation and clock out</label>
              </li>
            </ul>

            <div 
              className="swipe-to-complete" 
              style={{ background: "rgba(124, 92, 255, 0.1)", border: "1px solid #7C5CFF", marginTop: "2rem", cursor: "pointer" }}
              onClick={handleSliderDrag}
            >
              <span style={{ color: "#fff", zIndex: 1 }}>CLICK OR SWIPE TO COMPLETE</span>
              <div 
                className="swipe-slider" 
                style={{ background: "#7C5CFF", left: `${sliderPos}px`, transition: "left 0.3s" }}
              >
                ➔
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
