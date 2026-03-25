import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function DisputesRefundsPage() {
  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Disputes & Refunds</p>
          <h1>Clear steps for quick resolutions.</h1>
          <p className="text-white/70 m-0 text-lg">
            Submit evidence, track timelines, and get fair decisions with
            transparent policies.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">Open a Case</button>
            <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur">View Policy</button>
          </div>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>Resolution Steps</h3>
          <ul>
            <li>Submit a dispute</li>
            <li>Provide evidence</li>
            <li>Track status</li>
          </ul>
          <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">Start Now</button>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
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
          <button type="submit" className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">
            Submit Dispute
          </button>
        </form>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}