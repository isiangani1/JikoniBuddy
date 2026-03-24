import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { sellers } from "@/data/sellers";

export default function AvailableNowPage() {
  const availableChefs = sellers.filter((seller) =>
    seller.availability.toLowerCase().includes("available")
  );

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Available now</p>
            <h1>Chefs available right now</h1>
            <p className="subhead">
              These chefs can start immediately. For scheduling and full browsing,
              open the Buyer portal.
            </p>
            <div className="hero-actions">
              <Link className="badge" href="/buyer">
                Open Buyer portal
              </Link>
              <Link className="badge" href="/buyer/sellers">
                Browse all sellers
              </Link>
            </div>
          </div>

          <div className="category-hero-card">
            <h3>Live availability</h3>
            <p className="muted">This list is stubbed and ready for API wiring.</p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Available chefs</h2>
          <div className="seller-grid">
            {availableChefs.map((seller) => (
              <Link
                key={seller.id}
                href={`/buyer/sellers/${seller.id}`}
                className="seller-card"
              >
                <div className="seller-avatar" />
                <div>
                  <h3>{seller.name}</h3>
                  <p>
                    Rating {seller.rating.toFixed(1)} ★ · {seller.eta}
                  </p>
                  <p>{seller.priceRange}</p>
                  <p className="muted">{seller.availability}</p>
                </div>
                <span className="badge">View Menu</span>
              </Link>
            ))}
          </div>
          {!availableChefs.length ? (
            <p className="muted">No chefs are available right now.</p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
