import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">How It Works</p>
          <h1 className="flow-reveal">From browse to delivery, it’s seamless.</h1>
          <p className="text-white/70 m-0 text-lg">
            Choose a seller, schedule delivery, pay with M-Pesa or on delivery,
            and track your order in real time.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">Start Ordering</button>
            <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur">Browse Sellers</button>
          </div>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>3 Simple Steps</h3>
          <ul>
            <li>Browse & schedule</li>
            <li>Pay securely</li>
            <li>Track & enjoy</li>
          </ul>
          <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">See Live Orders</button>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2>Your journey</h2>
        <div className="steps">
          <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <span>1</span>
            <h3>Discover trusted sellers</h3>
            <p>Filter by category, location, and availability.</p>
          </div>
          <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <span>2</span>
            <h3>Schedule delivery</h3>
            <p>Choose the exact date and time window you need.</p>
          </div>
          <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
            <span>3</span>
            <h3>Pay and track</h3>
            <p>M-Pesa or pay on delivery with real-time updates.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2>Trust built in</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Verified sellers</h3>
            <p>Onboarding checks and admin approvals.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Real reviews</h3>
            <p>Only completed orders can leave ratings.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
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
