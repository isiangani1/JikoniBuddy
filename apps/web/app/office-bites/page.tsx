import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function OfficeBitesPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Office Bites</p>
          <h1>Team-friendly packs for productive days.</h1>
          <p className="subhead">
            Curated platters, energizing snacks, and shared meals for meetings
            and office teams.
          </p>
          <div className="hero-actions">
            <button className="primary">Browse Office Bites</button>
            <button className="ghost">Plan a Meeting Order</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Corporate Favorites</h3>
          <ul>
            <li>Meeting snack boxes</li>
            <li>Office lunch trays</li>
            <li>Tea break bundles</li>
          </ul>
          <button className="primary full">Build an Order</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Top Office Partners</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Nairobi Kitchen</h3>
            <p>Reliable trays and on-time delivery.</p>
          </div>
          <div className="category-card">
            <h3>Swahili Spice</h3>
            <p>Flavors that keep teams energized.</p>
          </div>
          <div className="category-card">
            <h3>TasteHub Express</h3>
            <p>Fast turnaround for last-minute orders.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}