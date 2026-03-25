import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function ContactSupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Contact Support</p>
          <h1>We’re here to help, fast.</h1>
          <p className="text-white/70 m-0 text-lg">
            Reach our support team for orders, disputes, or seller onboarding.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">Open a Ticket</button>
            <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur">Chat on WhatsApp</button>
          </div>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>Support Channels</h3>
          <ul>
            <li>WhatsApp live support</li>
            <li>Email assistance</li>
            <li>Order dispute desk</li>
          </ul>
          <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">View Contact Options</button>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
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
          <button type="submit" className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">
            Send Message
          </button>
        </form>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}