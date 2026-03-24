export default function AdminDashboard() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Platform Operations</h1>
        </div>
        <button className="ghost">Review Sellers</button>
      </header>
      <section className="dashboard-grid">
        <div className="card">
          <h3>Orders Live</h3>
          <p>Monitor active, delayed, and cancelled orders.</p>
        </div>
        <div className="card">
          <h3>Disputes</h3>
          <p>Open cases, refunds, and resolution steps.</p>
        </div>
        <div className="card">
          <h3>Metrics</h3>
          <p>GMV, cancellations, and seller performance.</p>
        </div>
      </section>
    </main>
  );
}
