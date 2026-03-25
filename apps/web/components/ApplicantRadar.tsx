"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Applicant = {
  id: string;
  name: string;
  rating: number;
  distance: string;
};

export default function ApplicantRadar({
  requestId,
  sellerId,
  onConfirm
}: {
  requestId: string;
  sellerId: string;
  onConfirm: (helperId: string) => void;
}) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket: Socket = io(`${baseUrl}/ws/buddy`, {
      query: { userId: sellerId },
      transports: ["websocket"]
    });

    socket.on("seller.applicant_found", (helperId: string) => {
      // Instead of an extra fetch for MVP, we simulate some details 
      // based on the ID that just applied.
      setApplicants((prev) => {
        if (prev.find((a) => a.id === helperId)) return prev;
        return [
          ...prev,
          {
            id: helperId,
            name: `Buddy ${helperId.substring(0, 4).toUpperCase()}`,
            rating: 4.8 + Math.random() * 0.2, // Simulate rating
            distance: `${(Math.random() * 5).toFixed(1)}km away`
          }
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [sellerId]);

  return (
    <div className="applicant-radar" style={{ padding: "1rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(45, 212, 191, 0.2)",
          border: "2px solid #2dd4bf",
          margin: "0 auto 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "pulse 2s infinite"
        }}>
          <span style={{ fontSize: "1.5rem" }}>📡</span>
        </div>
        <p className="text-white/50 text-sm" style={{ margin: 0 }}>Broadcasting SOS to nearby buddies...</p>
      </div>

      <div className="radar-results" style={{ display: "grid", gap: "1rem" }}>
        {applicants.map((app) => (
          <div
            key={app.id}
            className="applicant- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid rgba(45, 212, 191, 0.3)"
            }}
          >
            <div>
              <strong style={{ display: "block", fontSize: "1.1rem" }}>{app.name}</strong>
              <span className="text-white/50 text-sm" style={{ fontSize: "0.9rem" }}>
                ⭐ {app.rating.toFixed(1)} · {app.distance}
              </span>
            </div>
            <button
              className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: "#2dd4bf", color: "#12021f" }}
              onClick={() => onConfirm(app.id)}
            >
              Confirm
            </button>
          </div>
        ))}
        {applicants.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem" }} className="text-white/50 text-sm">
            Waiting for helpers to accept your request.
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(45, 212, 191, 0); }
          100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); }
        }
      `}} />
    </div>
  );
}
