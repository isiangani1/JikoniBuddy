export default function BuyerProfilePage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Buyer Profile</p>
          <h1>Your buyer account</h1>
          <p className="text-white/70 m-0 text-lg">
            Track saved addresses, preferences, and payment methods.
          </p>
        </div>
        <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
          <h3>Account snapshot</h3>
          <ul>
            <li>Orders placed: 24</li>
            <li>Saved locations: 3</li>
            <li>Payment methods: 2</li>
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-6 animate-in fade-in duration-500">
        <h2>Profile details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Primary address</h3>
            <p>Westlands, Nairobi</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Preferences</h3>
            <p>Weekly meal prep, office lunches</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
            <h3>Support tier</h3>
            <p>Standard buyer support</p>
          </div>
        </div>
      </section>
    </main>
  );
}
