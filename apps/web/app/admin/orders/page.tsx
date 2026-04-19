"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AdminOrderRow = {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  buyer: { displayName?: string | null; email: string };
  seller: { displayName?: string | null; email: string };
  assignedBuddy?: { displayName?: string | null; email: string } | null;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (status) params.set("status", status);

    fetch(`/api/admin/orders?${params.toString()}`)
      .then(async (res) => (res.ok ? ((await res.json()) as AdminOrderRow[]) : []))
      .then((data) => {
        if (!active) return;
        setOrders(data ?? []);
      })
      .catch(() => {
        if (!active) return;
        setOrders([]);
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, status]);

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Phase 4</p>
        <h1 className="m-0 mt-2 text-3xl font-semibold text-white">Order Drill-Down</h1>
        <p className="m-0 mt-2 text-sm text-white/60">
          Search orders, open the debug view, and inspect the full timeline in one place.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-[1fr_220px]">
        <input
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by order ID, buyer email, or seller email"
          value={query}
        />
        <select
          className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          <option value="">All statuses</option>
          <option value="pending">pending</option>
          <option value="accepted">accepted</option>
          <option value="preparing">preparing</option>
          <option value="ready">ready</option>
          <option value="delivering">delivering</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        {isLoading ? (
          <p className="m-0 text-white/60">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="m-0 text-white/60">No orders matched this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-xs uppercase text-white/40">
                <tr>
                  <th className="py-2">Order</th>
                  <th className="py-2">Buyer</th>
                  <th className="py-2">Seller</th>
                  <th className="py-2">Buddy</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5">
                    <td className="py-3">
                      <Link className="font-semibold text-amber-200 underline" href={`/admin/orders/${order.id}`}>
                        {order.id}
                      </Link>
                      <div className="text-xs text-white/40">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3">{order.buyer.displayName ?? order.buyer.email}</td>
                    <td className="py-3">{order.seller.displayName ?? order.seller.email}</td>
                    <td className="py-3">
                      {order.assignedBuddy?.displayName ?? order.assignedBuddy?.email ?? "Unassigned"}
                    </td>
                    <td className="py-3 capitalize">{order.status}</td>
                    <td className="py-3">
                      {order.currency} {order.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
