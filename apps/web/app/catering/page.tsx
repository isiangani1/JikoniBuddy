import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function CateringPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Catering</p>
          <h1>Events and occasions served with elegance.</h1>
          <p className="subhead">
            From corporate gatherings to celebrations, book full-service
            catering with flexible menus and staffing support.
          </p>
          <div className="hero-actions">
            <button className="primary">Explore Catering</button>
            <button className="ghost">Request a Quote</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Event Types</h3>
          <ul>
            <li>Corporate events</li>
            <li>Private celebrations</li>
            <li>Weekend gatherings</li>
          </ul>
          <button className="primary full">Book Catering</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Trusted Catering Teams</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Urban Plates</h3>
            <p>Polished service and refined menus.</p>
          </div>
          <div className="category-card">
            <h3>Nairobi Kitchen</h3>
            <p>Flexible setups for any venue.</p>
          </div>
          <div className="category-card">
            <h3>Swahili Spice</h3>
            <p>Rich flavors with premium presentation.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}