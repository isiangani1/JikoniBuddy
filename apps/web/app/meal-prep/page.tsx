import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function MealPrepPage() {
  return (
    <>
      <SiteHeader />
      <main className="category-page">
      <section className="category-hero">
        <div className="category-hero-content">
          <p className="eyebrow">Meal Prep</p>
          <h1>Weekly-ready meals, curated for busy weeks.</h1>
          <p className="subhead">
            Balanced menus, portioned packs, and consistent delivery windows for
            families and professionals.
          </p>
          <div className="hero-actions">
            <button className="primary">Browse Meal Prep</button>
            <button className="ghost">Set Weekly Schedule</button>
          </div>
        </div>
        <div className="category-hero-card">
          <h3>Popular Plans</h3>
          <ul>
            <li>5-day lunch packs</li>
            <li>Family dinner bundles</li>
            <li>High-protein sets</li>
          </ul>
          <button className="primary full">Request Menu</button>
        </div>
      </section>

      <section className="section fade-in">
        <h2>Featured Meal Prep Chefs</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Chef Amani</h3>
            <p>Portioned, vibrant meals with weekly planning.</p>
          </div>
          <div className="category-card">
            <h3>Mama Jay</h3>
            <p>Comfort meals designed for families and teams.</p>
          </div>
          <div className="category-card">
            <h3>Urban Plates</h3>
            <p>High-protein menus for busy professionals.</p>
          </div>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}