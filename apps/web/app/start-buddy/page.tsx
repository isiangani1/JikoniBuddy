import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const perks = [
  {
    title: "Choose your skill",
    description: "Cooking, packaging, or delivery. Pick what suits you best."
  },
  {
    title: "Go online on your terms",
    description: "Toggle availability and accept offers you want."
  },
  {
    title: "Fast, reliable payouts",
    description: "Track earnings, pending balance, and weekly payouts."
  }
];

const steps = [
  {
    title: "Create your Buddy profile",
    description: "Add your contact, ID, and skill type to get approved."
  },
  {
    title: "Go online when you’re ready",
    description: "Control your hours and receive nearby requests instantly."
  },
  {
    title: "Complete jobs and get paid",
    description: "Finish tasks, get rated, and see your wallet grow."
  }
];

export default function StartBuddyPage() {
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
              Become a buddy
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Earn on your schedule with Jikoni Buddy Pool.
            </h1>
            <p className="text-lg text-white/70">
              Join Nairobi’s trusted helper network. Pick your skills, accept
              nearby requests, and keep every shift transparent and rewarding.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {perks.map((item) => (
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
                href="/register?role=buddy"
                className="rounded-full bg-[#2dd4bf] px-8 py-3 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90"
              >
                Apply as a buddy
              </Link>
              <Link
                href="/buddy-portal"
                className="rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Buddy Portal
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute -top-10 right-4 hidden rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 shadow-xl backdrop-blur-xl lg:block">
              Active buddies online right now: 42
            </div>
            <div className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#120c1c]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
              <h2 className="text-2xl font-bold">Join the Buddy Pool</h2>
              <p className="mt-2 text-sm text-white/60">
                Tell us your skills and we’ll match you with the right jobs.
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
                  placeholder="Phone number"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                    placeholder="Preferred area"
                  />
                  <select className="rounded-2xl border border-white/10 bg-[#120c1c]/80 px-4 py-3 text-sm text-white/80 focus:border-white/30 focus:outline-none">
                    <option>Primary skill</option>
                    <option>Cooking</option>
                    <option>Packaging</option>
                    <option>Delivery</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="mt-2 rounded-2xl bg-[#2dd4bf] py-3 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90"
                >
                  Get started
                </button>
                <p className="text-xs text-white/50">
                  Already a buddy?{" "}
                  <Link href="/login" className="text-teal-300 hover:text-teal-200">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>

            <div className="mt-6 flex w-full max-w-lg items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
                alt="Buddy spotlight"
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  “I toggle online during lunch rush and earn fast.”
                </p>
                <p className="text-xs text-white/60">Ian · Westlands</p>
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
              <h2 className="text-3xl font-bold">Ready to join the Buddy Pool?</h2>
              <p className="mt-2 text-white/60">
                Apply once and start accepting requests whenever you want.
              </p>
            </div>
            <Link
              href="/register?role=buddy"
              className="w-max rounded-full bg-[#2dd4bf] px-8 py-3 text-sm font-semibold text-[#0d0a14] transition hover:opacity-90"
            >
              Create buddy account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
