import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">How It Works</p>
          <h1 className="flow-reveal">From browse to delivery, it’s seamless.</h1>
          <p className="subhead">
            Choose a seller, schedule delivery, pay with M-Pesa or on delivery,
            and track your order in real time.
          </p>
          <div className="hero-actions">
            <button className="primary">Start Ordering</button>
            <button className="ghost">Browse Sellers</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>3 Simple Steps</h3>
          <ul>
            <li>Browse & schedule</li>
            <li>Pay securely</li>
            <li>Track & enjoy</li>
          </ul>
          <button className="primary full">See Live Orders</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Your journey</h2>
        <div className="steps">
          <div className="step-card">
            <span>1</span>
            <h3>Discover trusted sellers</h3>
            <p>Filter by category, location, and availability.</p>
          </div>
          <div className="step-card">
            <span>2</span>
            <h3>Schedule delivery</h3>
            <p>Choose the exact date and time window you need.</p>
          </div>
          <div className="step-card">
            <span>3</span>
            <h3>Pay and track</h3>
            <p>M-Pesa or pay on delivery with real-time updates.</p>
          </div>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Trust built in</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Verified sellers</h3>
            <p>Onboarding checks and admin approvals.</p>
          </div>
          <div className="category-card">
            <h3>Real reviews</h3>
            <p>Only completed orders can leave ratings.</p>
          </div>
          <div className="category-card">
            <h3>Dispute support</h3>
            <p>Clear timelines and evidence-based decisions.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
