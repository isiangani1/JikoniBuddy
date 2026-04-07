"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOrder, RefundRequest } from "@/data/buyerStorage";

export default function BuyerOrderRefundPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [reason, setReason] = useState<RefundRequest["reason"]>("missing_items");
  const [details, setDetails] = useState("");
  const [version, setVersion] = useState(0);
  const [remoteRefund, setRemoteRefund] = useState<RefundRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const order = useMemo(() => getOrder(params.id), [params.id, version]);
  const buyerId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("jb_user_id") ?? ""
      : "";

  const existing = remoteRefund;

  useEffect(() => {
    if (!buyerId) return;
    fetch(`/api/refunds?orderId=${params.id}&userId=${buyerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const first = data?.refunds?.[0] ?? null;
        setRemoteRefund(first);
      })
      .catch(() => null);
  }, [buyerId, params.id, version]);

  useEffect(() => {
    if (existing && details === "") {
      setReason(existing.reason);
      setDetails(existing.details);
    }
  }, [existing, details]);

  if (!order) {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Refund request</h2>
            <p className="text-white/50 text-sm">Order not found.</p>
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buyer/orders">
              Back to orders
            </Link>
          </section>
        </main>
      </>
    );
  }

  const handleSubmit = async () => {
    if (!details.trim()) {
      alert("Please enter refund details.");
      return;
    }
    if (!buyerId) {
      alert("Please log in to submit a refund request.");
      router.push("/login");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          userId: buyerId,
          reason,
          details: details.trim()
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message ?? "Refund request failed.");
      }
      const created = await res.json();
      setRemoteRefund(created);
      setVersion((v) => v + 1);
      alert("Refund request submitted. Support will review.");
    } catch (error) {
      console.error(error);
      alert("Unable to submit refund request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Refund</p>
            <h1>Request a refund</h1>
            <p className="text-white/70 m-0 text-lg">Order #{order.id}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/support?orderId=${order.id}`}>
                Contact support
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Status</h3>
            <p className="text-white/50 text-sm">{existing ? existing.status : "Not requested"}</p>
            {existing ? (
              <p className="text-white/50 text-sm">We will update you once this is reviewed.</p>
            ) : (
              <p className="text-white/50 text-sm">Submit a request to begin review.</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Refund details</h2>
          <div className="form">
            <label className="field">
              <span>Reason</span>
              <select value={reason} onChange={(e) => setReason(e.target.value as any)}>
                <option value="late_delivery">Late delivery</option>
                <option value="missing_items">Missing items</option>
                <option value="quality">Quality issue</option>
                <option value="payment">Payment issue</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="field">
              <span>What happened?</span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue and what refund you expect."
              />
            </label>
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit refund request"}
            </button>
            {existing ? (
              <p className="text-white/50 text-sm">You already submitted a request for this order.</p>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
