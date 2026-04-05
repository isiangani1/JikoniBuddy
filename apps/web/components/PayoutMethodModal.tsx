"use client";

import { useEffect, useState } from "react";

type PayoutMethodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  roleLabel?: string;
  onSaved?: () => void;
};

export default function PayoutMethodModal({
  isOpen,
  onClose,
  userId,
  roleLabel = "Buddy",
  onSaved
}: PayoutMethodModalProps) {
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [label, setLabel] = useState("M-Pesa");

  useEffect(() => {
    if (!isOpen) {
      setMpesaNumber("");
      setLabel("M-Pesa");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return alert("Missing user id.");
    if (!mpesaNumber) return alert("Enter M-Pesa number.");

    const res = await fetch("/api/payout/payout-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        type: "mpesa",
        label,
        details: { phone: mpesaNumber },
        isDefault: true
      })
    });

    if (!res.ok) {
      alert("Failed to save payout method.");
      return;
    }
    onSaved?.();
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#120c1c] p-6 shadow-[0_24px_60px_rgba(20,6,40,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {roleLabel} payout method
              </p>
              <h3 className="text-lg font-semibold text-white">
                Update M-Pesa details
              </h3>
              <p className="text-sm text-white/60">
                This will be used for scheduled and instant payouts.
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              <span>Label</span>
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              <span>M-Pesa Number</span>
              <input
                value={mpesaNumber}
                onChange={(event) => setMpesaNumber(event.target.value)}
                placeholder="07xx xxx xxx"
                className="rounded-xl border border-white/10 bg-[#1a1026] px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-[#2dd4bf] px-4 py-3 text-sm font-semibold text-[#0d0a14] hover:opacity-90"
            >
              Save payout method
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
