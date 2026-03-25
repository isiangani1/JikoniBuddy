import Link from "next/link";

const skillTiles = [
  {
    title: "Cooking",
    note: "Prep, cook, and plate orders for busy sellers."
  },
  {
    title: "Packaging",
    note: "Handle boxing, labeling, and sealing with care."
  },
  {
    title: "Delivery",
    note: "Move orders quickly while keeping them secure."
  }
];

const portalSteps = [
  {
    title: "Apply & verify",
    note: "Submit your ID, photo, and contact details for review."
  },
  {
    title: "Go online",
    note: "Set your availability so sellers can find you instantly."
  },
  {
    title: "Accept jobs",
    note: "Pick work that matches your skill and location."
  },
  {
    title: "Get paid",
    note: "Track earnings and payout status in one place."
  }
];

export default function BuddyPortalLandingPage() {
  return (
    <>
      <main className="flex flex-col gap-12 sm:gap-16 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-gradient-to-br from-[#1a0b2e] to-[#0c0612] p-6 sm:p-8 md:p-12 rounded-[24px] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="flex flex-col gap-4 sm:gap-5 max-w-xl z-10">
            <p className="text-pink-400 font-bold tracking-widest uppercase text-xs sm:text-sm m-0">Buddy Portal</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] m-0 tracking-tight">Step into the Buddy Pool and get booked fast.</h1>
            <p className="text-lg text-white/70 m-0 leading-relaxed max-w-lg">
              Turn your cooking, packaging, or delivery skills into reliable work.
              Go online, accept requests, and build your rating.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-lg shadow-purple-500/25" href="/buddy-portal/signup">
                Start Buddy Onboarding
              </Link>
              <Link className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors" href="/buddy-portal/status">
                Check Application Status
              </Link>
            </div>
          </div>
          <div className="bg-[#12021f]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[20px] shadow-2xl z-10 w-full lg:w-96 flex flex-col gap-6 ml-auto">
            <h3 className="text-xl font-bold text-white m-0">What you control</h3>
            <ul className="flex flex-col gap-3.5 text-white/80 m-0 p-0 list-none">
              <li className="flex items-center gap-3 text-sm sm:text-base before:content-['✓'] before:text-green-400 before:font-bold before:bg-green-400/10 before:w-6 before:h-6 before:rounded-full before:flex before:items-center before:justify-center">Skills and job types</li>
              <li className="flex items-center gap-3 text-sm sm:text-base before:content-['✓'] before:text-green-400 before:font-bold before:bg-green-400/10 before:w-6 before:h-6 before:rounded-full before:flex before:items-center before:justify-center">Preferred locations</li>
              <li className="flex items-center gap-3 text-sm sm:text-base before:content-['✓'] before:text-green-400 before:font-bold before:bg-green-400/10 before:w-6 before:h-6 before:rounded-full before:flex before:items-center before:justify-center">Online hours</li>
              <li className="flex items-center gap-3 text-sm sm:text-base before:content-['✓'] before:text-green-400 before:font-bold before:bg-green-400/10 before:w-6 before:h-6 before:rounded-full before:flex before:items-center before:justify-center">Job acceptance</li>
            </ul>
            <Link className="inline-flex items-center justify-center w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 mt-2 rounded-xl transition-colors" href="/buddy-portal/signup">
              Become a Buddy
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white m-0">Choose your skill track</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {skillTiles.map((skill) => (
              <div key={skill.title} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[20px] hover:bg-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-white m-0">{skill.title}</h3>
                <p className="text-white/60 m-0 leading-relaxed">{skill.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 sm:gap-8 animate-in fade-in duration-500">
          <h2 className="text-2xl sm:text-3xl font-bold text-white m-0">Your Buddy journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {portalSteps.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-3 sm:gap-4 bg-[#12021f]/50 p-6 sm:p-8 rounded-[20px] border border-white/10 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xl mb-2 group-hover:scale-110 transition-transform">{index + 1}</div>
                <h3 className="text-xl font-bold text-white m-0">{step.title}</h3>
                <p className="text-white/60 m-0 leading-relaxed text-sm">{step.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 bg-gradient-to-r from-purple-900/40 to-pink-900/20 p-8 sm:p-12 rounded-[24px] border border-purple-500/20 items-center text-center animate-in fade-in duration-500 mb-8 sm:mb-12">
          <div className="flex flex-col gap-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white m-0">Ready to get verified?</h2>
            <p className="text-lg text-white/70 m-0">Fast verification helps you accept requests sooner.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-purple-500/25" href="/buddy-portal/signup">
              Submit your application
            </Link>
            <Link className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold py-3.5 px-8 rounded-xl transition-colors" href="/buddy-portal/status">
              View status lifecycle
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
