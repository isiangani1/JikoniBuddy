"use client";

import { useState, useEffect } from "react";
import BuddyPoolModal from "./BuddyPoolModal";
import BuddyPoolRequestForm from "./BuddyPoolRequestForm";
import ApplicantRadar from "./ApplicantRadar";
import { io } from "socket.io-client";

export default function SellerSOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<{ id: string; sellerId: string } | null>(null);
  const [approvalJob, setApprovalJob] = useState<{ requestId: string; helperId: string; payAmount: number } | null>(null);
  
  const sellerId = "test-seller-1"; // MVP Mock seller ID

  useEffect(() => {
    // Listen for jobs completed by buddies targeted to this seller
    const socketBase =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    const socket = io(`${socketBase}/ws/buddy`, {
      query: { userId: sellerId },
      transports: ["websocket"]
    });

    socket.on('seller.job_awaiting_approval', (payload) => {
      setApprovalJob(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [sellerId]);

  const handleSuccess = (requestId: string) => {
    setActiveRequest({ id: requestId, sellerId });
  };

  const handleConfirm = async (helperId: string) => {
    if (!activeRequest) return;
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      await fetch(`${baseUrl}/api/buddy/requests/${activeRequest.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helperId })
      });
      alert(`Buddy ${helperId.substring(0, 4)} confirmed! They will arrive shortly.`);
      setIsOpen(false);
      setActiveRequest(null);
    } catch (error) {
      alert("Failed to confirm buddy.");
    }
  };

  return (
    <>
      <button
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          background: "#ff4e50",
          color: "white",
          border: "none",
          borderRadius: "999px",
          padding: "1rem 1.5rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
          boxShadow: "0 8px 30px rgba(255, 78, 80, 0.4)",
          cursor: "pointer",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
        onClick={() => setIsOpen(true)}
      >
        <span style={{ fontSize: "1.4rem" }}>🆘</span>
        SOS Help
      </button>

      {approvalJob && (
        <BuddyPoolModal
          title="Approve Buddy Work"
          description={`Your Buddy ${approvalJob.helperId.substring(0,6)} has swiped to complete the job.`}
          onClose={() => setApprovalJob(null)}
        >
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <h3 style={{ color: "#2dd4bf", fontSize: "2rem", margin: "1rem 0" }}>KES {approvalJob.payAmount}</h3>
            <p style={{ marginBottom: "2rem", color: "rgba(255,255,255,0.7)" }}>
              Please confirm the work was completed satisfactorily before we release the funds to their M-Pesa.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" 
                style={{ flex: 1 }} 
                onClick={() => {
                  alert(`Payout of KES ${approvalJob.payAmount} released!`);
                  setApprovalJob(null);
                }}
              >Approve & Release Funds</button>
              <button className="base" style={{ background: "rgba(255,78,80,0.2)", color: "#ff4e50" }} onClick={() => setApprovalJob(null)}>Dispute</button>
            </div>
          </div>
        </BuddyPoolModal>
      )}

      {isOpen && !approvalJob && (
        <BuddyPoolModal
          title={activeRequest ? "Buddy Radar" : "Request a Buddy"}
          description={
            activeRequest
              ? "Scanning for available helpers..."
              : "Instantly request a helper for your peak hours."
          }
          onClose={() => {
            setIsOpen(false);
            setActiveRequest(null);
          }}
        >
          {activeRequest ? (
            <ApplicantRadar
              requestId={activeRequest.id}
              sellerId={activeRequest.sellerId}
              onConfirm={handleConfirm}
            />
          ) : (
            <BuddyPoolRequestForm onSuccess={handleSuccess} sellerId={sellerId} />
          )}
        </BuddyPoolModal>
      )}
    </>
  );
}
