"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
};

const fallbackNotifications: NotificationRow[] = [
  {
    id: "note-1",
    title: "New cooking job",
    message: "Kilimani · 2h · KES 1,500",
    type: "job_request",
    status: "unread",
    createdAt: "2026-03-19T10:00:00.000Z"
  },
  {
    id: "note-2",
    title: "Payment received",
    message: "KES 800 · 15 mins ago",
    type: "payment",
    status: "read",
    createdAt: "2026-03-19T08:30:00.000Z"
  }
];

export default function BuddyPortalNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRow[]>(
    fallbackNotifications
  );

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    fetchBuddyJson<NotificationRow[]>(
      `/buddy/users/${buddyId}/notifications`
    )
      .then((data) => {
        if (data?.length) setNotifications(data);
      })
      .catch(() => null);
  }, []);

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Notifications</p>
            <h1>Stay reachable for every request.</h1>
            <p className="subhead">
              Real-time alerts keep you ahead of shifts, payments, and updates.
            </p>
            <div className="hero-actions">
              <Link className="primary" href="/buddy-portal/dashboard">
                Back to dashboard
              </Link>
              <Link className="ghost" href="/buddy-portal/settings">
                Notification settings
              </Link>
            </div>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Recent notifications</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td data-label="Title">{notification.title}</td>
                    <td data-label="Message">{notification.message}</td>
                    <td data-label="Type">{notification.type}</td>
                    <td data-label="Status">
                      <span className="status-pill">{notification.status}</span>
                    </td>
                    <td data-label="Date">
                      {new Date(notification.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
