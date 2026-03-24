export default function AdminProfilePage() {
  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Admin Profile</p>
          <h1>Administrator access</h1>
          <p className="subhead">
            Review approvals, disputes, and platform metrics.
          </p>
        </div>
        <div className="category-hero-card">
          <h3>Admin snapshot</h3>
          <ul>
            <li>Role: Platform Admin</li>
            <li>Approvals pending: 8</li>
            <li>Open disputes: 3</li>
          </ul>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Admin details</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Region</h3>
            <p>Nairobi</p>
          </div>
          <div className="category-card">
            <h3>Permissions</h3>
            <p>Full moderation & payouts</p>
          </div>
          <div className="category-card">
            <h3>Last login</h3>
            <p>Today, 09:12</p>
          </div>
        </div>
      </section>
    </main>
  );
}
