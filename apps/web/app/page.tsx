import Link from "next/link";
import { headers } from "next/headers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OrderWidget from "@/components/OrderWidget";
import HowItWorksFlow from "@/components/HowItWorksFlow";

const categories = [
  {
    title: "Meal Prep",
    note: "Weekly-ready meals",
    image: "/meal_prep.jpg",
    href: "/meal-prep"
  },
  {
    title: "Office Bites",
    note: "Team-friendly packs",
    image: "/office_bites.png",
    href: "/office-bites"
  },
  {
    title: "Picnic Snacks",
    note: "Fresh outdoor bites",
    image: "/picnic_snacks.jpg",
    href: "/picnic-snacks"
  },
  {
    title: "Catering",
    note: "Events and occasions",
    image: "/catering.jpg",
    href: "/catering"
  }
];

const availableNow = [
  { name: "TasteHub Express", window: "Ready in 60-90 min", badge: "Available Now" },
  { name: "Swahili Spice", window: "Ready in 45-60 min", badge: "Limited Slots" },
  { name: "Green Bowl Co.", window: "Ready in 60-75 min", badge: "Available Now" }
];

const reviews = [
  {
    name: "Joy W.",
    quote: "The scheduling flow is perfect for office lunches.",
    rating: "5.0"
  },
  {
    name: "Kevin M.",
    quote: "Loved the updates and the chef quality.",
    rating: "4.8"
  },
  {
    name: "Aisha N.",
    quote: "Buddy Pool makes it feel like a real kitchen network.",
    rating: "4.9"
  }
];

type ChefProfile = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  eta: string;
  price: string;
  highlightComment: string;
  isVerified: boolean;
};

async function getChefs(): Promise<ChefProfile[]> {
  const headerList = headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "http://127.0.0.1:3001";

  const response = await fetch(`${baseUrl}/api/chefs`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as { chefs: ChefProfile[] };
  return data.chefs ?? [];
}

export default async function HomePage() {
  const chefs = await getChefs();
  const featuredChefs = chefs
    .filter((chef) => chef.rating >= 4.8)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <main className="relative flex min-h-screen flex-col gap-10 overflow-hidden text-white sm:gap-12 lg:gap-14">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-purple-600/20 blur-[100px] animate-pulse" />
      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-140px] right-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]" />

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative z-10 mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-center gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-20">
        <div className="flex flex-col gap-6 max-w-2xl">
          <p className="inline-flex w-max items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-200 shadow-xl">
            <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            Kenya-first marketplace
          </p>
          <h1 className="m-0 text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
            Order fresh food, exactly when you need it.
          </h1>
          <p className="m-0 text-lg font-medium leading-relaxed text-white/70 sm:text-xl">
            Schedule meal prep, office bites, or picnic snacks with trusted
            local chefs. Reliable delivery, real-time updates, and safe
            payments.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link className="rounded-full bg-[#2dd4bf] px-8 py-3.5 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90" href="/buyer">
              Find Food
            </Link>
            <Link className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10" href="/start-selling">
              Become a Seller
            </Link>
            <Link className="rounded-full bg-[#2dd4bf] px-8 py-3.5 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90" href="/start-buddy">
              Become a Buddy
            </Link>
          </div>

          {/* Requested Rating Section */}
          <div className="flex items-center gap-6 mt-8 flex-wrap">
            <div className="flex -space-x-4">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" className="w-12 h-12 rounded-full border-2 border-[#090310] object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" className="w-12 h-12 rounded-full border-2 border-[#090310] object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" className="w-12 h-12 rounded-full border-2 border-[#090310] object-cover" alt="User" />
              <div className="w-12 h-12 rounded-full border-2 border-[#090310] bg-purple-600/80 backdrop-blur-md flex items-center justify-center font-bold text-xs uppercase text-white shadow-lg">10k+</div>
            </div>
            <p className="text-sm font-semibold text-white/50 m-0 leading-tight">
              <span className="block text-white">Rated 4.9/5</span>
              by extremely demanding customers
            </p>
          </div>
        </div>

        <div className="relative mt-12 flex w-full justify-center lg:mt-0 lg:justify-end">
          <div className="relative w-full max-w-[400px]">
            <div className="relative z-20 rounded-[32px] border border-white/10 bg-[#120c1c]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-2">
              <OrderWidget />
            </div>

            {/* Floating Toasts */}
            <div className="absolute -right-8 -top-12 z-30 hidden items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl md:flex">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-400/30 text-amber-400 font-bold text-lg">🛵</div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider m-0">Buddy Network</p>
                <p className="font-bold text-white text-sm m-0">14 Active nearby</p>
              </div>
            </div>

            <div className="absolute -left-12 -bottom-8 z-30 hidden items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl md:flex">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30 text-pink-400 font-bold text-lg">🍜</div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider m-0">Chef Joy</p>
                <p className="font-bold text-white text-sm m-0">Menu live • 15 left</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden sm:py-8">
        <h2 className="text-3xl font-extrabold m-0">Browse by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all flex flex-col gap-4 group overflow-hidden"
            >
              <div
                className="w-full h-44 rounded-2xl bg-cover bg-center transition-transform duration-500 group-hover:scale-110 shadow-lg"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold m-0 group-hover:text-purple-300 transition-colors uppercase tracking-wide">{category.title}</h3>
                <p className="text-white/60 text-sm m-0 font-medium">{category.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 flex flex-col gap-6 animate-in fade-in duration-500 sm:py-8">
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold m-0">Featured sellers</h2>
            <p className="text-white/50 m-0">Top-rated chefs fueling the Nairobi community.</p>
          </div>
          <button className="px-6 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-all backdrop-blur">View all cooks</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredChefs.map((seller) => {
            const isTopRated = seller.rating >= 4.8 && seller.reviewCount >= 150;
            const badgeLabel = isTopRated
              ? "Top Rated"
              : seller.isVerified
                ? "Verified"
                : "";

            return (
              <div key={seller.id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col gap-4 hover:border-teal-500/40 hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 shrink-0 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                  {seller.name.charAt(0)}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-extrabold m-0 text-white">{seller.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-400 font-bold">★ {seller.rating.toFixed(1)}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/60 font-medium">{seller.reviewCount} reviews</span>
                  </div>
                  <p className="text-sm font-semibold text-white/50 m-0 bg-white/5 px-2 py-1 rounded w-max">{seller.eta} · {seller.price}</p>
                  <p className="text-white/40 text-xs italic m-0 line-clamp-2 mt-2 font-medium">“{seller.highlightComment}”</p>
                </div>
                {badgeLabel && (
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase tracking-widest border border-purple-500/30 w-max shadow-lg shadow-purple-900/10">
                    {badgeLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <HowItWorksFlow />

      {/* Buddy Pool Promo */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
        <div className="text-center flex flex-col items-center gap-6 md:gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl md:text-5xl font-black m-0 mb-2">The Buddy Pool</h2>
            <p className="text-xl text-white/70 max-w-2xl leading-relaxed font-medium">
              Sellers can request trusted helpers when demand spikes, keeping
              quality high and delivery on time. Our active network is always ready.
            </p>
          </div>
          <Link className="w-full max-w-sm px-8 py-4 rounded-2xl bg-[#2dd4bf] text-[#0d0a14] font-black text-lg hover:shadow-[0_0_50px_rgba(45,212,191,0.3)] transition-all flex items-center justify-center gap-3" href="/buddy-pool">
            Learn About Buddy Pool <span className="text-2xl">→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />

    </main>
  );
}
