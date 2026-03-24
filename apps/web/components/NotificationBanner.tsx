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
              <Link className="badge" href={`/buyer/orders/${latest.orderId}`}>
                View
              </Link>
            </span>
          ) : null}
        </div>
        <button
          className="ghost"
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
