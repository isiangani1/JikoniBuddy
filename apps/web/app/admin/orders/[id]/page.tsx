"use client";

import { useEffect, useState } from "react";

type TimelineEvent = {
  id: string;
  type: string;
  label: string;
  note?: string | null;
  actorId?: string | null;
  actorRole?: string | null;
  createdAt: string;
};

type OrderDebugPayload = {
  order: {
    id: string;
    status: string;
    totalAmount: number;
    currency: string;
    createdAt: string;
    buyer: { displayName?: string | null; email: string };
    seller: { displayName?: string | null; email: string };
    assignedBuddy?: { displayName?: string | null; email: string } | null;
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      product?: { name: string } | null;
    }>;
    messages: Array<{
      id: string;
      text: string;
      senderId: string;
      receiverId: string;
      createdAt: string;
    }>;
    trackingPoints: Array<{
      id: string;
      lat: number;
      lng: number;
      accuracy?: number | null;
      recordedAt: string;
    }>;
  };
  payments: Array<{
    id: string;
    method: string;
    status: string;
    amount: number;
    currency: string;
    createdAt: string;
    events: Array<{ id: string; status: string; note?: string | null; createdAt: string }>;
  }>;
  buddyActions: Array<{
    id: string;
    action: string;
    note?: string | null;
    createdAt: string;
  }>;
  timeline: TimelineEvent[];
  traceSummary: {
    totalPoints: number;
    firstSeenAt?: string | null;
    lastSeenAt?: string | null;
  };
};

export default function AdminOrderDebugPage({
  params
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<OrderDebugPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetch(`/api/admin/orders/${params.id}`)
      .then(async (res) => (res.ok ? ((await res.json()) as OrderDebugPayload) : null))
      .then((payload) => {
        if (!active) return;
        setData(payload);
      })
      .catch(() => {
        if (!active) return;
        setData(null);
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  if (isLoading) {
    return <p className="text-white/60">Loading debug view…</p>;
  }

  if (!data) {
    return <p className="text-white/60">Order debug data is unavailable.</p>;
  }

  const { order, payments, buddyActions, timeline, traceSummary } = data;

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="m-0 text-xs uppercase tracking-[0.2em] text-white/50">Order Debug View</p>
        <h1 className="m-0 mt-2 text-3xl font-semibold text-white">{order.id}</h1>
        <p className="m-0 mt-2 text-sm text-white/60">
          {order.status} · {order.currency} {order.totalAmount.toLocaleString()}
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="m-0 text-xl font-semibold text-white">Timeline</h2>
          <div className="mt-4 flex flex-col gap-4">
            {timeline.map((event) => (
              <div key={event.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="capitalize text-white">
                    {event.label.replace(/_/g, " ")}
                  </strong>
                  <span className="text-xs text-white/40">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="m-0 mt-2 text-sm text-white/60">
                  {event.type.replace(/_/g, " ")}
                  {event.actorRole ? ` · ${event.actorRole}` : ""}
                </p>
                {event.note ? <p className="m-0 mt-2 text-sm text-white/75">{event.note}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="m-0 text-xl font-semibold text-white">Order Parties</h2>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p className="m-0">Buyer: {order.buyer.displayName ?? order.buyer.email}</p>
              <p className="m-0">Seller: {order.seller.displayName ?? order.seller.email}</p>
              <p className="m-0">
                Buddy: {order.assignedBuddy?.displayName ?? order.assignedBuddy?.email ?? "Unassigned"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="m-0 text-xl font-semibold text-white">Location Trace</h2>
            <p className="m-0 mt-3 text-sm text-white/60">
              {traceSummary.totalPoints} points captured
              {traceSummary.lastSeenAt
                ? ` · last seen ${new Date(traceSummary.lastSeenAt).toLocaleString()}`
                : ""}
            </p>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {order.trackingPoints.length === 0 ? (
                <p className="m-0 text-sm text-white/50">No trace points yet.</p>
              ) : (
                order.trackingPoints.map((point) => (
                  <div key={point.id} className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/75">
                    <div>
                      {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                    </div>
                    <div className="mt-1 text-xs text-white/40">
                      {new Date(point.recordedAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="m-0 text-xl font-semibold text-white">Chat Logs</h2>
          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {order.messages.length === 0 ? (
              <p className="m-0 text-sm text-white/50">No chat messages for this order.</p>
            ) : (
              order.messages.map((message) => (
                <div key={message.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="m-0 text-sm text-white">{message.text}</p>
                  <p className="m-0 mt-2 text-xs text-white/40">
                    {message.senderId} {"->"} {message.receiverId} · {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="m-0 text-xl font-semibold text-white">Payment Logs</h2>
          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {payments.length === 0 ? (
              <p className="m-0 text-sm text-white/50">No payments linked to this order yet.</p>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="m-0 text-sm text-white">
                    {payment.method} · {payment.currency} {payment.amount.toLocaleString()}
                  </p>
                  <p className="m-0 mt-1 text-xs text-white/40">Status: {payment.status}</p>
                  <div className="mt-3 space-y-2">
                    {payment.events.map((event) => (
                      <div key={event.id} className="text-xs text-white/60">
                        {new Date(event.createdAt).toLocaleString()} · {event.status}
                        {event.note ? ` · ${event.note}` : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="m-0 text-xl font-semibold text-white">Buddy Actions</h2>
          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {buddyActions.length === 0 ? (
              <p className="m-0 text-sm text-white/50">No buddy actions recorded yet.</p>
            ) : (
              buddyActions.map((action) => (
                <div key={action.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="m-0 text-sm capitalize text-white">{action.action.replace(/_/g, " ")}</p>
                  {action.note ? <p className="m-0 mt-1 text-sm text-white/70">{action.note}</p> : null}
                  <p className="m-0 mt-2 text-xs text-white/40">
                    {new Date(action.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
