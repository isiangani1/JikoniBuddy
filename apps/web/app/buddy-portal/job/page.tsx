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
        <section className="buddy-job-hero">
          <div>
            <p className="eyebrow">Active job</p>
            <h1>{currentJob.taskType} shift in {currentJob.location}</h1>
            <p className="muted">
              Keep the seller updated while you work. Status updates are shared
              automatically once you confirm completion.
            </p>
          </div>
          <div className="buddy-job-card">
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
              <button className="primary" type="button">
                Mark completed
              </button>
              <button className="ghost" type="button">
                Message seller
              </button>
            </div>
            <p className="muted">
              Seller notification: “{currentJob.taskType} job completed” will
              be sent once you mark the job done.
            </p>
          </div>
        </section>

        <section className="section fade-in">
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
                    <p className="muted">
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

        <section className="section fade-in">
          <div className="section-header">
            <h2>Need to update the seller?</h2>
            <p>Send a quick update so they can plan the next steps.</p>
          </div>
          <div className="job-update">
            <label className="field">
              <span>Quick message</span>
              <textarea placeholder="e.g. Prep started, packaging will be done in 45 minutes." />
            </label>
            <button className="primary" type="button">
              Send update
            </button>
          </div>
        </section>

        <section className="section fade-in">
          <div className="section-header">
            <h2>Back to your dashboard</h2>
            <p>Review new jobs or check your earnings after this shift.</p>
          </div>
          <div className="hero-actions">
            <Link className="primary" href="/buddy-portal/dashboard">
              View dashboard
            </Link>
            <Link className="ghost" href="/buddy-portal/earnings">
              Go to earnings
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
