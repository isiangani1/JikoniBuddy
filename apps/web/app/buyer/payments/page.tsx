"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadOrders } from "@/data/buyerStorage";

export default function BuyerPaymentsPage() {
  const router = useRouter();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
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
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Payments</p>
            <h1>Payment history</h1>
            <p className="text-white/70 m-0 text-lg">View payment status and receipts for your orders.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/account">
                Account
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/orders">
                Orders
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer">
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>API wiring</h3>
            <p className="text-white/50 text-sm">
              This page is backed by local order records and is ready for payment
              service integration.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Recent payments</h2>
          {payments.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.slice(0, 20).map(({ order, payment }) => (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
                  <h3>Order #{order.id}</h3>
                  <p className="text-white/50 text-sm">Method: {payment.method}</p>
                  <p className="text-white/50 text-sm">Status: {payment.status}</p>
                  {payment.receiptId ? <p className="text-white/50 text-sm">Receipt: {payment.receiptId}</p> : null}
                  {payment.phoneNumber ? <p className="text-white/50 text-sm">Phone: {payment.phoneNumber}</p> : null}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}`}>
                      View order
                    </Link>
                    <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}/receipt`}>
                      Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm">No payments yet. Place an order to see it here.</p>
          )}
        </section>
      </main>
    </>
  );
}
