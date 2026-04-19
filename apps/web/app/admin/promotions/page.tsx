export default function AdminPromotionsPage() {
  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 m-0">Content Admin</p>
        <h1 className="text-3xl font-semibold text-white m-0 mt-2">Promotions & Featured Sellers</h1>
        <p className="text-white/60 text-sm m-0 mt-2">
          Promo targeting and featured placements live here.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-white/10 p-6 text-white/60">
        Promotions dashboard coming online in Phase 1.
      </div>
    </section>
  );
}
