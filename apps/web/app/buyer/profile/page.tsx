export default function BuyerProfilePage() {
  return (
    <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Buyer Profile</p>
          <h1>Your buyer account</h1>
          <p className="subhead">
            Track saved addresses, preferences, and payment methods.
          </p>
        </div>
        <div className="category-hero-card">
          <h3>Account snapshot</h3>
          <ul>
            <li>Orders placed: 24</li>
            <li>Saved locations: 3</li>
            <li>Payment methods: 2</li>
          </ul>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Profile details</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Primary address</h3>
            <p>Westlands, Nairobi</p>
          </div>
          <div className="category-card">
            <h3>Preferences</h3>
            <p>Weekly meal prep, office lunches</p>
          </div>
          <div className="category-card">
            <h3>Support tier</h3>
            <p>Standard buyer support</p>
          </div>
        </div>
      </section>
    </main>
  );
}
