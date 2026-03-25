import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function HowMatchingWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Buddy Pool</p>
            <h1>How Matching Works</h1>
            <p className="text-white/70 m-0 text-lg">
              We match helpers based on distance, skills, availability, and
              rating. The best fit gets priority.
            </p>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Matching signals</h3>
            <ul>
              <li>Location proximity</li>
              <li>Skill match</li>
              <li>Availability</li>
              <li>Ratings</li>
            </ul>
            <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">View Request Flow</button>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Step-by-step</h2>
          <div className="steps">
            <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
              <span>1</span>
              <h3>Request created</h3>
              <p>Seller specifies task, time, and location.</p>
            </div>
            <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
              <span>2</span>
              <h3>Helpers ranked</h3>
              <p>System scores helpers and notifies the best ones.</p>
            </div>
            <div className="step- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors">
              <span>3</span>
              <h3>Seller confirms</h3>
              <p>Seller chooses a helper and confirms assignment.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
