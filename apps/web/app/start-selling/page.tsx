import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const highlights = [
  {
    title: "More predictable orders",
    description:
      "Structured scheduling keeps your kitchen calm while still boosting volume."
  },
  {
    title: "Buddy Pool delivery",
    description:
      "Access vetted helpers for prep, packaging, and deliveries when demand spikes."
  },
  {
    title: "Real-time earnings",
    description:
      "Track payouts, pending balance, and performance in one crisp dashboard."
  }
];

const steps = [
  {
    title: "Create your storefront",
    description:
      "Upload menus, set lead times, and tell Nairobi what you’re cooking next."
  },
  {
    title: "Activate Buddy support",
    description:
      "Turn on on-demand helpers so you never miss peak lunch rush."
  },
  {
    title: "Deliver with confidence",
    description:
      "Live order tracking + guaranteed payout windows keep you in control."
  }
];

export default function StartSellingPage() {
  return (
    <main className="relative flex min-h-screen flex-col gap-10 overflow-hidden text-white sm:gap-12 lg:gap-14">
      <div className="pointer-events-none absolute -top-24 right-[-120px] h-72 w-72 rounded-full bg-purple-600/20 blur-[100px] animate-pulse" />
      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-140px] right-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-[100px]" />

      <SiteHeader />

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-20">
          <div className="flex flex-col gap-6">
            <p className="inline-flex w-max items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-200 shadow-xl">
              <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              Start selling
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Grow your kitchen business with Jikoni Buddy.
            </h1>
            <p className="text-lg text-white/70">
              Jikoni Buddy is built for Nairobi-first food creators. Schedule
              orders, tap Buddy Pool support, and deliver confidently while we
              handle payouts and customer updates.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-white/60">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/register?role=seller"
                className="rounded-full bg-[#2dd4bf] px-8 py-3 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90"
              >
                Apply as a seller
              </Link>
              <Link
                href="/seller"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View seller dashboard
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute -top-10 right-2 hidden rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 shadow-xl backdrop-blur-xl lg:block">
              Nairobi kitchens onboarded this week: 28
            </div>
            <div className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#120c1c]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              <h2 className="text-2xl font-bold">Start selling on Jikoni Buddy</h2>
              <p className="mt-2 text-sm text-white/60">
                Tell us about your kitchen and we’ll set you up in minutes.
              </p>
              <form className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                    placeholder="First name"
                  />
                  <input
                    className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                    placeholder="Last name"
                  />
                </div>
                <input
                  className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                  placeholder="Kitchen or brand name"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                    placeholder="Business email"
                    type="email"
                  />
                  <input
                    className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                    placeholder="Phone number"
                  />
                </div>
                <select className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white/80 focus:border-white/30 focus:outline-none">
                  <option>What do you sell most?</option>
                  <option>Meal prep & bundles</option>
                  <option>Corporate lunches</option>
                  <option>Quick bites & snacks</option>
                  <option>Event catering</option>
                </select>
                <button
                  type="button"
                  className="mt-2 rounded-2xl bg-[#2dd4bf] py-3 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90"
                >
                  Get started
                </button>
                <p className="text-xs text-white/50">
                  Already a partner?{" "}
                  <Link href="/login" className="text-teal-300 hover:text-teal-200">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>

            <div className="mt-6 flex w-full max-w-lg items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                alt="Seller spotlight"
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  “Jikoni Buddy doubled our weekday volume.”
                </p>
                <p className="text-xs text-white/60">
                  Amina’s Kitchen · Kilimani
                </p>
              </div>
            </div>
          </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Step {index + 1}
            </p>
            <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-white/60">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Ready to start selling?</h2>
              <p className="mt-2 text-white/60">
                We’ll help you go live, staff with buddies, and grow revenue.
              </p>
            </div>
            <Link
              href="/register?role=seller"
              className="w-max rounded-full bg-[#2dd4bf] px-8 py-3 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90"
            >
              Create seller account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
