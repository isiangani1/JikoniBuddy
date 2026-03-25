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
      `/users/${buddyId}/notifications`
    )
      .then((data) => {
        if (data?.length) setNotifications(data);
      })
      .catch(() => null);
  }, []);

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Notifications</p>
            <h1>Stay reachable for every request.</h1>
            <p className="text-white/70 m-0 text-lg">
              Real-time alerts keep you ahead of shifts, payments, and updates.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buddy-portal/dashboard">
                Back to dashboard
              </Link>
              <Link className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" href="/buddy-portal/settings">
                Notification settings
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Recent notifications</h2>
          <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <table className="w-full text-left text-sm text-white">
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
