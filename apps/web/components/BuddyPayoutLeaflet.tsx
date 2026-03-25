"use client";

import { useEffect, useState } from "react";

type BuddyPayoutLeafletProps = {
  isOpen: boolean;
  onClose: () => void;
  buddyId?: string | null;
  buddyName?: string;
  availableBalance?: number;
  onSubmitted?: () => void;
};

export default function BuddyPayoutLeaflet({
  isOpen,
  onClose,
  buddyId,
  buddyName = "Buddy",
  availableBalance = 0,
  onSubmitted
}: BuddyPayoutLeafletProps) {
  const [amount, setAmount] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setMpesaNumber("");
      setNote("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!amount || !mpesaNumber) return alert("Enter amount and M-Pesa number.");
    if (!buddyId) return alert("Buddy profile not found. Please re-login.");
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
      const res = await fetch(`${baseUrl}/api/buddy/users/${buddyId}/payouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          mpesaNumber,
          note
        })
      });
      if (!res.ok) throw new Error("Payout request failed");
      alert("Payout request submitted. We will confirm via M-Pesa.");
      onSubmitted?.();
      onClose();
    } catch {
      alert("Payout request failed. Please try again.");
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(8,6,12,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 50
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(420px, 92vw)",
          background: "rgba(18,12,28,0.98)",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          padding: "2rem",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0" style={{ marginBottom: "0.4rem" }}>Buddy Payout</p>
            <h2 style={{ margin: 0 }}>Request payout</h2>
            <p style={{ margin: "0.4rem 0 0", color: "rgba(255,255,255,0.6)" }}>
              Hi {buddyName}, available balance: KES {availableBalance.toLocaleString()}
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" onClick={onClose} style={{ borderRadius: "999px" }}>
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form" style={{ display: "grid", gap: "1rem" }}>
          <label className="field">
            <span>Amount (KES)</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1200"
              inputMode="numeric"
            />
          </label>
          <label className="field">
            <span>M-Pesa Number</span>
            <input
              value={mpesaNumber}
              onChange={(e) => setMpesaNumber(e.target.value)}
              placeholder="e.g. 07xx xxx xxx"
            />
          </label>
          <label className="field">
            <span>Note (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything the finance team should know?"
              rows={3}
            />
          </label>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="submit">
              Submit payout request
            </button>
            <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        <div style={{ marginTop: "auto", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
          Payouts are processed within 24 hours. You will receive an M-Pesa confirmation.
        </div>
      </aside>
    </>
  );
}
