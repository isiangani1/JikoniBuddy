"use client";

import { useEffect, useState } from "react";
import { fetchBuddyJson, getBuddyId } from "@/lib/buddy-client";

type JobRow = {
  title: string;
  seller: string;
  time: string;
  pay: string;
  status: string;
};

const fallbackJobs: JobRow[] = [
  {
    title: "Packaging support",
    seller: "Nairobi Kitchen",
    time: "Mar 18, 2026 · 2 hours",
    pay: "KES 800",
    status: "completed"
  },
  {
    title: "Cooking shift",
    seller: "Chef Amani",
    time: "Mar 15, 2026 · 3 hours",
    pay: "KES 1,500",
    status: "completed"
  },
  {
    title: "Delivery run",
    seller: "Swahili Spice",
    time: "Mar 13, 2026 · 1 trip",
    pay: "KES 300",
    status: "completed"
  }
];

export default function BuddyPortalHistoryPage() {
  const [jobs, setJobs] = useState<JobRow[]>(fallbackJobs);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) return;
    fetchBuddyJson<
      {
        title: string;
        seller: string;
        startTime: string;
        endTime?: string | null;
        payAmount: number;
        currency: string;
        status: string;
      }[]
    >(`/buddy/users/${buddyId}/jobs?status=completed`)
      .then((data) => {
        if (!data?.length) return;
        const mapped = data.map((job) => ({
          title: job.title,
          seller: job.seller,
          time: `${new Date(job.startTime).toLocaleDateString()} · ${
            job.endTime
              ? `${Math.round(
                  (new Date(job.endTime).getTime() -
                    new Date(job.startTime).getTime()) /
                    (1000 * 60 * 60)
                )} hours`
              : "Shift"
          }`,
          pay: `${job.currency} ${job.payAmount.toLocaleString()}`,
          status: job.status
        }));
        setJobs(mapped);
      })
      .catch(() => null);
  }, []);

  return (
    <>
      <main className="category-page">
    

        <section className="section fade-in">
          <h2>Recent jobs</h2>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Seller</th>
                  <th>Time</th>
                  <th>Pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={`${job.title}-${job.seller}`}>
                    <td data-label="Job">{job.title}</td>
                    <td data-label="Seller">{job.seller}</td>
                    <td data-label="Time">{job.time}</td>
                    <td data-label="Pay">{job.pay}</td>
                    <td data-label="Status">
                      <span className="status-pill">{job.status}</span>
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
