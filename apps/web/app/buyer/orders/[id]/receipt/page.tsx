"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { getOrder } from "@/data/buyerStorage";

export default function BuyerReceiptPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const order = useMemo(() => getOrder(params.id), [params.id]);
  const seller = useMemo(() => {
    if (!order) return null;
    return sellers.find((item) => item.id === order.sellerId) ?? null;
  }, [order]);

  if (!order) {
    return (
      <>
        <main className="category-page">
          <section className="section fade-in">
            <h2>Receipt not available</h2>
            <p className="muted">Order not found.</p>
            <Link className="primary" href="/buyer">
              Back to buyer
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Receipt</p>
            <h1>Payment receipt</h1>
            <p className="subhead">Order #{order.id}</p>
            <div className="hero-actions">
              <Link className="badge" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
              <Link className="badge" href="/buyer">
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="category-hero-card">
            <h3>Payment</h3>
            <p className="muted">Method: {order.payment.method}</p>
            <p className="muted">Status: {order.payment.status}</p>
            {order.payment.receiptId ? (
              <p className="muted">Receipt: {order.payment.receiptId}</p>
            ) : (
              <p className="muted">Receipt: (pending)</p>
            )}
          </div>
        </section>

        <section className="section fade-in">
          <h2>Summary</h2>
          <div className="category-grid">
            <div className="category-card">
              <h3>Seller</h3>
              <p className="muted">{seller ? seller.name : order.sellerId}</p>
            </div>
            <div className="category-card">
              <h3>Total</h3>
              <p className="muted">KES {order.total.toFixed(0)}</p>
            </div>
            <div className="category-card">
              <h3>Delivery</h3>
              <p className="muted">{order.checkout.deliveryLocation}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
