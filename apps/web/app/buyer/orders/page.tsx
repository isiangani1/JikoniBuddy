"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { loadOrders, startReorder } from "@/data/buyerStorage";

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const orders = useMemo(() => loadOrders(), [version]);

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Orders</p>
            <h1>Order history</h1>
            <p className="subhead">Track past orders and reorder quickly.</p>
            <div className="hero-actions">
              <Link className="badge" href="/buyer">
                Back to dashboard
              </Link>
              <Link className="badge" href="/buyer/account">
                Account
              </Link>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Tips</h3>
            <p className="muted">Reorder refills your cart using the previous items.</p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Recent orders</h2>
          {orders.length ? (
            <div className="category-grid">
              {orders.slice(0, 12).map((order) => {
                const seller = sellers.find((item) => item.id === order.sellerId);
                return (
                  <div key={order.id} className="category-card">
                    <h3>Order #{order.id}</h3>
                    <p className="muted">Seller: {seller ? seller.name : order.sellerId}</p>
                    <p className="muted">Status: {order.status}</p>
                    <p className="muted">Total: KES {order.total.toFixed(0)}</p>
                    <div className="hero-actions">
                      <Link className="badge" href={`/buyer/orders/${order.id}`}>
                        View
                      </Link>
                      <button
                        className="primary"
                        type="button"
                        onClick={() => {
                          startReorder(order.id);
                          setVersion((v) => v + 1);
                          router.push("/buyer/checkout");
                        }}
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="muted">No orders yet. Place an order to see it here.</p>
          )}
        </section>
      </main>
    </>
  );
}
