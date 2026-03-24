"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createRefundRequest,
  getOrder,
  getRefundRequestForOrder,
  RefundRequest
} from "@/data/buyerStorage";

export default function BuyerOrderRefundPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [reason, setReason] = useState<RefundRequest["reason"]>("missing_items");
  const [details, setDetails] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const order = useMemo(() => getOrder(params.id), [params.id, version]);
  const existing = useMemo(() => getRefundRequestForOrder(params.id), [params.id, version]);

  useEffect(() => {
    if (existing && details === "") {
      setReason(existing.reason);
      setDetails(existing.details);
    }
  }, [existing, details]);

  if (!order) {
    return (
      <>
        <main className="category-page">
          <section className="section fade-in">
            <h2>Refund request</h2>
            <p className="muted">Order not found.</p>
            <Link className="primary" href="/buyer/orders">
              Back to orders
            </Link>
          </section>
        </main>
      </>
    );
  }

  const handleSubmit = () => {
    if (!details.trim()) {
      alert("Please enter refund details.");
      return;
    }
    createRefundRequest({ orderId: order.id, reason, details: details.trim() });
    setVersion((v) => v + 1);
    alert("Refund request submitted (stub). Support will review.");
  };

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Refund</p>
            <h1>Request a refund</h1>
            <p className="subhead">Order #{order.id}</p>
            <div className="hero-actions">
              <Link className="badge" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
              <Link className="badge" href={`/buyer/support?orderId=${order.id}`}>
                Contact support
              </Link>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Status</h3>
            <p className="muted">{existing ? existing.status : "Not requested"}</p>
            <p className="muted">
              This is a stub for API wiring to disputes/refunds workflow.
            </p>
          </div>
        </section>

        <section className="section fade-in">
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
            <button className="primary" type="button" onClick={handleSubmit}>
              Submit refund request
            </button>
            {existing ? (
              <p className="muted">You already submitted a request for this order.</p>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
