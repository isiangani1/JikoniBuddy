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

const fallbackJobs: JobRow[] = [];

export default function BuddyPortalHistoryPage() {
  const [jobs, setJobs] = useState<JobRow[]>(fallbackJobs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buddyId = getBuddyId();
    if (!buddyId) {
      setIsLoading(false);
      return;
    }
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
    >(`/users/${buddyId}/jobs?status=completed`)
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
      .catch(() => null)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
    

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Recent jobs</h2>
          <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <table className="w-full text-left text-sm text-white">
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
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="p-4"><div className="h-4 w-32 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-28 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-40 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-4 w-20 rounded bg-white/10" /></td>
                        <td className="p-4"><div className="h-5 w-16 rounded bg-white/10" /></td>
                      </tr>
                    ))
                  : jobs.map((job) => (
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
          {!isLoading && jobs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white m-0">No completed jobs yet</h3>
              <p className="m-0 mt-2 text-sm text-white/60">
                Accept your first request and your history will show up here.
              </p>
              <a
                href="/buddy-portal/my-requests"
                className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
              >
                View open requests
              </a>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
