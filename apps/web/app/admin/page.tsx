export default function AdminDashboard() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-red-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
        <div className="flex flex-col gap-2">
          <p className="text-red-300 font-bold tracking-widest uppercase text-sm m-0">Admin Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white m-0">Platform Operations</h1>
        </div>
        <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap">Review Sellers</button>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-red-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white m-0 mb-2">Orders Live</h3>
          <p className="text-white/70 m-0">Monitor active, delayed, and cancelled orders.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-red-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white m-0 mb-2">Disputes</h3>
          <p className="text-white/70 m-0">Open cases, refunds, and resolution steps.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 hover:border-red-500/50 transition-colors">
          <h3 className="text-xl font-bold text-white m-0 mb-2">Metrics</h3>
          <p className="text-white/70 m-0">GMV, cancellations, and seller performance.</p>
        </div>
      </section>
    </main>
  );
}
