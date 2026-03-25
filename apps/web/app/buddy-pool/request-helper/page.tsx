import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BuddyPoolRequestForm from "@/components/BuddyPoolRequestForm";

export default function RequestHelperPage() {
  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Buddy Pool</p>
            <h1>Request a Helper</h1>
            <p className="text-white/70 m-0 text-lg">
              Tell us what you need, when you need it, and we’ll match you with
              trusted helpers.
            </p>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Fast matching</h3>
            <p className="text-white/50 text-sm">Matches are ranked by distance, skill, and rating.</p>
            <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">Learn Matching</button>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Request details</h2>
          <BuddyPoolRequestForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
