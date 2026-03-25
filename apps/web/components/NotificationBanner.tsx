"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  loadNotifications,
  markNotificationRead,
  BuyerNotification
} from "@/data/buyerStorage";

export default function NotificationBanner() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setVersion((v) => v + 1), 3000);
    return () => window.clearInterval(interval);
  }, []);

  const notifications = useMemo(() => loadNotifications(), [version]);
  const unread = notifications.filter((item) => !item.readAt);
  const latest: BuyerNotification | null = unread[0] ?? null;

  if (!latest) return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 20px"
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ minWidth: 0 }}>
          <strong>{latest.title}</strong>
          <span style={{ marginLeft: 8 }}>{latest.message}</span>
          {latest.orderId ? (
            <span style={{ marginLeft: 10 }}>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${latest.orderId}`}>
                View
              </Link>
            </span>
          ) : null}
        </div>
        <button
          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur"
          type="button"
          onClick={() => {
            markNotificationRead(latest.id);
            setVersion((v) => v + 1);
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
