import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function NearMePage() {
  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Near Me</p>
          <h1>Discover chefs and meals close to you.</h1>
          <p className="text-white/70 m-0 text-lg">
            Explore nearby kitchens, shorter delivery windows, and fast pickup
            options.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">Use My Location</button>
            <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur">Set Location Manually</button>
          </div>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>Quick Filters</h3>
          <ul>
            <li>Under 30 mins</li>
            <li>Verified sellers</li>
            <li>Budget-friendly</li>
          </ul>
          <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity">Browse Nearby</button>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2>Popular Near You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>City Bowl</h3>
            <p>Fast, healthy bowls around downtown.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Chef Amani</h3>
            <p>Reliable delivery within 30 minutes.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Swahili Spice</h3>
            <p>Signature flavors close to you.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}