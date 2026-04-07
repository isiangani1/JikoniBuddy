import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { sellers } from "@/data/sellers";

export default function AvailableNowPage() {
  const availableChefs = sellers.filter((seller) =>
    seller.availability.toLowerCase().includes("available")
  );

  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Available now</p>
            <h1>Chefs available right now</h1>
            <p className="text-white/70 m-0 text-lg">
              These chefs can start immediately. For scheduling and full browsing,
              open the Buyer portal.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer">
                Open Buyer portal
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/sellers">
                Browse all sellers
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Live availability</h3>
            <p className="text-white/50 text-sm">Live list updates as sellers come online.</p>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Available chefs</h2>
          <div className="seller-grid">
            {availableChefs.map((seller) => (
              <Link
                key={seller.id}
                href={`/buyer/sellers/${seller.id}`}
                className="seller- bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors"
              >
                <div className="seller-avatar" />
                <div>
                  <h3>{seller.name}</h3>
                  <p>
                    Rating {seller.rating.toFixed(1)} ★ · {seller.eta}
                  </p>
                  <p>{seller.priceRange}</p>
                  <p className="text-white/50 text-sm">{seller.availability}</p>
                </div>
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30">View Menu</span>
              </Link>
            ))}
          </div>
          {!availableChefs.length ? (
            <p className="text-white/50 text-sm">No chefs are available right now.</p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
