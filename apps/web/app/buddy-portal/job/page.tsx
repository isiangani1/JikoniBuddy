import Link from "next/link";
import { currentJob } from "@/data/buddy-jobs";

const statusLabels: Record<(typeof currentJob.statuses)[number], string> = {
  requested: "Requested",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  paid: "Paid"
};

export default function BuddyPortalJobPage() {
  return (
    <>
      <main className="buddy-job">
        <section className="flex w-full flex-col gap-6 bg-gradient-to-br from-violet-900/40 to-[#120c1c]/90 px-6 py-10 shadow-[0_20px_60px_rgba(30,15,60,0.5)] md:flex-row">
          <div>
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Active job</p>
            <h1>{currentJob.taskType} shift in {currentJob.location}</h1>
            <p className="text-white/50 text-sm">
              Keep the seller updated while you work. Status updates are shared
              automatically once you confirm completion.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6">
            <h3>Job summary</h3>
            <div className="job-summary-grid">
              <div>
                <span>Seller</span>
                <p>{currentJob.seller}</p>
              </div>
              <div>
                <span>Time window</span>
                <p>{currentJob.timeWindow}</p>
              </div>
              <div>
                <span>Pay</span>
                <p>KES {currentJob.pay}</p>
              </div>
              <div>
                <span>Status</span>
                <p className="status-chip">{statusLabels[currentJob.status]}</p>
              </div>
            </div>
            <div className="job-actions">
              <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button">
                Mark completed
              </button>
              <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" type="button">
                Message seller
              </button>
            </div>
            <p className="text-white/50 text-sm">
              Seller notification: “{currentJob.taskType} job completed” will
              be sent once you mark the job done.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Job status lifecycle</h2>
          <div className="job-status-list">
            {currentJob.statuses.map((status, index) => {
              const isActive = status === currentJob.status;
              const isComplete =
                currentJob.statuses.indexOf(currentJob.status) > index;
              return (
                <div
                  key={status}
                  className={`job-status-card ${isActive ? "active" : ""} ${
                    isComplete ? "complete" : ""
                  }`}
                >
                  <div className="status-dot" />
                  <div>
                    <h3>{statusLabels[status]}</h3>
                    <p className="text-white/50 text-sm">
                      {status === "requested" && "Seller created the request."}
                      {status === "accepted" &&
                        "You accepted and reserved the job."}
                      {status === "in_progress" &&
                        "You are on site and working the shift."}
                      {status === "completed" &&
                        "Job completed and seller notified."}
                      {status === "paid" &&
                        "Payment confirmed and logged in earnings."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2>Need to update the seller?</h2>
            <p>Send a quick update so they can plan the next steps.</p>
          </div>
          <div className="job-update">
            <label className="field">
              <span>Quick message</span>
              <textarea placeholder="e.g. Prep started, packaging will be done in 45 minutes." />
            </label>
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button">
              Send update
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2>Back to your dashboard</h2>
            <p>Review new jobs or check your earnings after this shift.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buddy-portal/dashboard">
              View dashboard
            </Link>
            <Link className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" href="/buddy-portal/earnings">
              Go to earnings
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
