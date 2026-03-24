import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function PicnicSnacksPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Picnic Snacks</p>
          <h1>Fresh outdoor bites for relaxed weekends.</h1>
          <p className="subhead">
            Curated picnic baskets, finger foods, and refreshing drinks ready
            for your next outing.
          </p>
          <div className="hero-actions">
            <button className="primary">Browse Picnic Snacks</button>
            <button className="ghost">Plan a Picnic</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Picnic Highlights</h3>
          <ul>
            <li>Fresh fruit boxes</li>
            <li>Charcuterie boards</li>
            <li>Cold drinks & dips</li>
          </ul>
          <button className="primary full">Reserve a Basket</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Outdoor Favorites</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Green Bowl Co.</h3>
            <p>Healthy bites with vibrant flavors.</p>
          </div>
          <div className="category-card">
            <h3>Urban Plates</h3>
            <p>Stylish spreads for memorable moments.</p>
          </div>
          <div className="category-card">
            <h3>Chef Amani</h3>
            <p>Refreshing trays packed for travel.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}