import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function DisputesRefundsPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Disputes & Refunds</p>
          <h1>Clear steps for quick resolutions.</h1>
          <p className="subhead">
            Submit evidence, track timelines, and get fair decisions with
            transparent policies.
          </p>
          <div className="hero-actions">
            <button className="primary">Open a Case</button>
            <button className="ghost">View Policy</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Resolution Steps</h3>
          <ul>
            <li>Submit a dispute</li>
            <li>Provide evidence</li>
            <li>Track status</li>
          </ul>
          <button className="primary full">Start Now</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Open a dispute</h2>
        <form className="support-form">
          <label className="field">
            <span>Order ID</span>
            <input placeholder="JB-000123" required />
          </label>
          <label className="field">
            <span>Issue type</span>
            <select required>
              <option value="">Select an issue</option>
              <option value="late">Late delivery</option>
              <option value="missing">Missing items</option>
              <option value="quality">Quality concerns</option>
              <option value="billing">Billing issue</option>
            </select>
          </label>
          <label className="field">
            <span>Describe the issue</span>
            <textarea rows={5} placeholder="Tell us what happened." required />
          </label>
          <label className="field">
            <span>Preferred resolution</span>
            <select required>
              <option value="">Select a resolution</option>
              <option value="refund">Refund</option>
              <option value="credit">Credit</option>
              <option value="replacement">Replacement order</option>
            </select>
          </label>
          <button type="submit" className="primary full">
            Submit Dispute
          </button>
        </form>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}