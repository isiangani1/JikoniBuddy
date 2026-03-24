import Link from "next/link";

const statusCards = [
  {
    title: "Pending",
    note: "Application submitted and awaiting review."
  },
  {
    title: "Approved",
    note: "Verification complete. You can go online."
  },
  {
    title: "Active",
    note: "Receiving buddy requests in your area."
  },
  {
    title: "Suspended",
    note: "Temporarily paused due to review or inactivity."
  }
];

const statusChecklist = [
  "Submitted application",
  "ID and photo verified",
  "Skills reviewed",
  "Location confirmed",
  "Buddy profile activated"
];

export default function BuddyPortalStatusPage() {
  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Status Lifecycle</p>
            <h1>Track your Buddy application in real time.</h1>
            <p className="subhead">
              Every Buddy moves through a clear status journey. Once approved,
              you can go online and accept work instantly.
            </p>
            <div className="hero-actions">
              <Link className="primary" href="/buddy-portal/signup">
                Complete your application
              </Link>
              <Link className="ghost" href="/buddy-portal">
                Back to Buddy Portal
              </Link>
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Current placeholder</h3>
            <p className="subhead">
              Status: Pending Review
            </p>
            <ul>
              {statusChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Status stages</h2>
          <div className="category-grid">
            {statusCards.map((status) => (
              <div key={status.title} className="category-card">
                <h3>{status.title}</h3>
                <p>{status.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section fade-in">
          <div className="section-header">
            <h2>Need help?</h2>
            <p>Reach the Buddy support team for fast verification updates.</p>
          </div>
          <div className="hero-actions">
            <Link className="primary" href="/contact-support">
              Contact support
            </Link>
            <Link className="ghost" href="/faqs">
              View FAQs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
