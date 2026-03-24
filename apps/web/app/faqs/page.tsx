import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
const faqs = [
  {
    q: "How do I schedule an order?",
    a: "Choose a seller, select your date and time window, then confirm checkout."
  },
  {
    q: "Can I pay on delivery?",
    a: "Yes, pay on delivery is available for eligible sellers and orders."
  },
  {
    q: "How do ratings work?",
    a: "Only completed orders can leave ratings to keep reviews reliable."
  },
  {
    q: "What if my order is late?",
    a: "Use the in-app chat or open a dispute for quick support."
  },
  {
    q: "How do I become a seller?",
    a: "Select 'Become a Seller' and complete onboarding and verification."
  }
];

export default function FaqsPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">FAQs</p>
          <h1>Quick answers to common questions.</h1>
          <p className="subhead">
            Find information on scheduling, payments, refunds, and delivery.
          </p>
        </div>
        <div className="category-hero-card">
          <h3>Need more help?</h3>
          <ul>
            <li>Live chat support</li>
            <li>WhatsApp assistance</li>
            <li>Email response within 24h</li>
          </ul>
          <button className="primary full">Contact Support</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Frequently asked</h2>
        <div className="faq-grid">
          {faqs.map((item) => (
            <div key={item.q} className="faq-card">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}