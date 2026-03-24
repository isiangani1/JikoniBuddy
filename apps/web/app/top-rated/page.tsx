import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function TopRatedPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Top Rated</p>
          <h1>Experience the highest-rated chefs in Nairobi.</h1>
          <p className="subhead">
            Verified reviews, consistent delivery, and top-tier culinary teams.
          </p>
          <div className="hero-actions">
            <button className="primary">Browse Top Rated</button>
            <button className="ghost">See Reviews</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Quality Signals</h3>
          <ul>
            <li>4.8+ rating</li>
            <li>150+ reviews</li>
            <li>Verified sellers</li>
          </ul>
          <button className="primary full">Explore Chefs</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Elite Sellers</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Chef Amani</h3>
            <p>Consistently high reviews across weekly plans.</p>
          </div>
          <div className="category-card">
            <h3>Mama Jay</h3>
            <p>Known for reliable delivery and customer love.</p>
          </div>
          <div className="category-card">
            <h3>Swahili Spice</h3>
            <p>Premium taste with top-tier service.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}