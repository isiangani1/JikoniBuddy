import Link from "next/link";

const statusCards = [
  {
    title: "Pending",
    note: "Application submitted and awaiting review."
  },
  {
    title: "Approved",
    note: "Verification complete. You can go online."
  },
  {
    title: "Active",
    note: "Receiving buddy requests in your area."
  },
  {
    title: "Suspended",
    note: "Temporarily paused due to review or inactivity."
  }
];

const statusChecklist = [
  "Submitted application",
  "ID and photo verified",
  "Skills reviewed",
  "Location confirmed",
  "Buddy profile activated"
];

export default function BuddyPortalStatusPage() {
  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Status Lifecycle</p>
            <h1>Track your Buddy application in real time.</h1>
            <p className="text-white/70 m-0 text-lg">
              Every Buddy moves through a clear status journey. Once approved,
              you can go online and accept work instantly.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buddy-portal/signup">
                Complete your application
              </Link>
              <Link className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" href="/buddy-portal">
                Back to Buddy Portal
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Current placeholder</h3>
            <p className="text-white/70 m-0 text-lg">
              Status: Pending Review
            </p>
            <ul>
              {statusChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Status stages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusCards.map((status) => (
              <div key={status.title} className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
                <h3>{status.title}</h3>
                <p>{status.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2>Need help?</h2>
            <p>Reach the Buddy support team for fast verification updates.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/contact-support">
              Contact support
            </Link>
            <Link className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur" href="/faqs">
              View FAQs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
