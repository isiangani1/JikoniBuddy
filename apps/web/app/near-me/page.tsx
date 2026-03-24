import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function NearMePage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Near Me</p>
          <h1>Discover chefs and meals close to you.</h1>
          <p className="subhead">
            Explore nearby kitchens, shorter delivery windows, and fast pickup
            options.
          </p>
          <div className="hero-actions">
            <button className="primary">Use My Location</button>
            <button className="ghost">Set Location Manually</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Quick Filters</h3>
          <ul>
            <li>Under 30 mins</li>
            <li>Verified sellers</li>
            <li>Budget-friendly</li>
          </ul>
          <button className="primary full">Browse Nearby</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Popular Near You</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>City Bowl</h3>
            <p>Fast, healthy bowls around downtown.</p>
          </div>
          <div className="category-card">
            <h3>Chef Amani</h3>
            <p>Reliable delivery within 30 minutes.</p>
          </div>
          <div className="category-card">
            <h3>Swahili Spice</h3>
            <p>Signature flavors close to you.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}