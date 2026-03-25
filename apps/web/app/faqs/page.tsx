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
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">FAQs</p>
          <h1>Quick answers to common questions.</h1>
          <p className="text-white/70 m-0 text-lg">
            Find information on scheduling, payments, refunds, and delivery.
          </p>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>Need more help?</h3>
          <ul>
            <li>Live chat support</li>
            <li>WhatsApp assistance</li>
            <li>Email response within 24h</li>
          </ul>
          <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">Contact Support</button>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2>Frequently asked</h2>
        <div className="faq-grid">
          {faqs.map((item) => (
            <div key={item.q} className="faq- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
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