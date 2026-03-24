"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadOrders } from "@/data/buyerStorage";

export default function BuyerPaymentsPage() {
  const router = useRouter();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const interval = window.setInterval(() => setVersion((v) => v + 1), 3000);
    return () => window.clearInterval(interval);
  }, []);

  const payments = useMemo(() => {
    const orders = loadOrders();
    return orders
      .map((order) => ({ order, payment: order.payment }))
      .sort((a, b) => b.order.createdAt.localeCompare(a.order.createdAt));
  }, [version]);

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Payments</p>
            <h1>Payment history</h1>
            <p className="subhead">View payment status and receipts for your orders.</p>
            <div className="hero-actions">
              <Link className="badge" href="/buyer/account">
                Account
              </Link>
              <Link className="badge" href="/buyer/orders">
                Orders
              </Link>
              <Link className="badge" href="/buyer">
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="category-hero-card">
            <h3>API wiring</h3>
            <p className="muted">
              This page is backed by local order records and is ready for payment
              service integration.
            </p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Recent payments</h2>
          {payments.length ? (
            <div className="category-grid">
              {payments.slice(0, 20).map(({ order, payment }) => (
                <div key={order.id} className="category-card">
                  <h3>Order #{order.id}</h3>
                  <p className="muted">Method: {payment.method}</p>
                  <p className="muted">Status: {payment.status}</p>
                  {payment.receiptId ? <p className="muted">Receipt: {payment.receiptId}</p> : null}
                  {payment.phoneNumber ? <p className="muted">Phone: {payment.phoneNumber}</p> : null}
                  <div className="hero-actions">
                    <Link className="badge" href={`/buyer/orders/${order.id}`}>
                      View order
                    </Link>
                    <Link className="badge" href={`/buyer/orders/${order.id}/receipt`}>
                      Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No payments yet. Place an order to see it here.</p>
          )}
        </section>
      </main>
    </>
  );
}
