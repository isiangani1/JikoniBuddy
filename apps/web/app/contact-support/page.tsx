import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function ContactSupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Contact Support</p>
          <h1>We’re here to help, fast.</h1>
          <p className="subhead">
            Reach our support team for orders, disputes, or seller onboarding.
          </p>
          <div className="hero-actions">
            <button className="primary">Open a Ticket</button>
            <button className="ghost">Chat on WhatsApp</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Support Channels</h3>
          <ul>
            <li>WhatsApp live support</li>
            <li>Email assistance</li>
            <li>Order dispute desk</li>
          </ul>
          <button className="primary full">View Contact Options</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Send a message</h2>
        <form className="support-form">
          <label className="field">
            <span>Full name</span>
            <input placeholder="Your name" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="you@jikoni.buddy" required />
          </label>
          <label className="field">
            <span>Order ID (optional)</span>
            <input placeholder="JB-000123" />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea placeholder="Tell us how we can help." rows={5} />
          </label>
          <button type="submit" className="primary full">
            Send Message
          </button>
        </form>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}