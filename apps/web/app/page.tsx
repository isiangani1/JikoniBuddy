import Link from "next/link";
import { headers } from "next/headers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import OrderWidget from "@/components/OrderWidget";

const categories = [
  {
    title: "Meal Prep",
    note: "Weekly-ready meals",
    image: "/meal_prep.jpg",
    href: "/meal-prep"
  },
  {
    title: "Office Bites",
    note: "Team-friendly packs",
    image: "/office_bites.png",
    href: "/office-bites"
  },
  {
    title: "Picnic Snacks",
    note: "Fresh outdoor bites",
    image: "/picnic_snacks.jpg",
    href: "/picnic-snacks"
  },
  {
    title: "Catering",
    note: "Events and occasions",
    image: "/catering.jpg",
    href: "/catering"
  }
];

const availableNow = [
  { name: "TasteHub Express", window: "Ready in 60-90 min", badge: "Available Now" },
  { name: "Swahili Spice", window: "Ready in 45-60 min", badge: "Limited Slots" },
  { name: "Green Bowl Co.", window: "Ready in 60-75 min", badge: "Available Now" }
];

const reviews = [
  {
    name: "Joy W.",
    quote: "The scheduling flow is perfect for office lunches.",
    rating: "5.0"
  },
  {
    name: "Kevin M.",
    quote: "Loved the updates and the chef quality.",
    rating: "4.8"
  },
  {
    name: "Aisha N.",
    quote: "Buddy Pool makes it feel like a real kitchen network.",
    rating: "4.9"
  }
];

type ChefProfile = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  eta: string;
  price: string;
  highlightComment: string;
  isVerified: boolean;
};

async function getChefs(): Promise<ChefProfile[]> {
  const headerList = headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "http://127.0.0.1:3001";

  const response = await fetch(`${baseUrl}/api/chefs`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }
  const data = (await response.json()) as { chefs: ChefProfile[] };
  return data.chefs ?? [];
}

export default async function HomePage() {
  const chefs = await getChefs();
  const featuredChefs = chefs
    .filter((chef) => chef.rating >= 4.8)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <main className="landing">
      <SiteHeader />

      <section className="hero hero-landing">
        <div className="hero-content">
          <p className="eyebrow">Nairobi-first marketplace</p>
          <h1>Order fresh food, exactly when you need it.</h1>
          <p className="subhead">
            Schedule meal prep, office bites, or picnic snacks with trusted
            local chefs. Reliable delivery, real-time updates, and safe
            payments.
          </p>
          <div className="hero-actions">
            <Link className="primary" href="/buyer">
              Find Food
            </Link>
            <Link className="ghost" href="/seller">
              Become a Seller
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <OrderWidget />
        </div>
      </section>

      <section className="section fade-in">
        <h2>Browse by category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="category-card"
            >
              <div
                className="category-image"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="category-content">
                <h3>{category.title}</h3>
                <p>{category.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section fade-in">
        <div className="section-header">
          <h2>Featured sellers</h2>
          <button className="ghost">View all</button>
        </div>
        <div className="seller-grid">
          {featuredChefs.map((seller) => {
            const isTopRated = seller.rating >= 4.8 && seller.reviewCount >= 150;
            const badgeLabel = isTopRated
              ? "Top Rated"
              : seller.isVerified
              ? "Verified"
              : "";

            return (
              <div key={seller.id} className="seller-card">
                <div className="seller-avatar" />
                <div>
                  <h3>{seller.name}</h3>
                  <p>
                    Rating {seller.rating.toFixed(1)} ★ · {seller.reviewCount} reviews
                  </p>
                  <p>{seller.eta}</p>
                  <p>{seller.price}</p>
                  <p className="muted">“{seller.highlightComment}”</p>
                </div>
                {badgeLabel ? <span className="badge">{badgeLabel}</span> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section highlight fade-in">
        <div className="section-header">
          <h2>Available now</h2>
          <p>Ready to deliver within the next 1-2 hours.</p>
        </div>
        <div className="available-grid">
          {availableNow.map((item) => (
            <div key={item.name} className="available-card">
              <h3>{item.name}</h3>
              <p>{item.window}</p>
              <span className="badge">{item.badge}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section fade-in">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step-card">
            <span>1</span>
            <h3>Browse & Schedule</h3>
            <p>Choose meals and set your exact delivery window.</p>
          </div>
          <div className="step-card">
            <span>2</span>
            <h3>Pay Securely</h3>
            <p>Pay with M-Pesa or select pay on delivery.</p>
          </div>
          <div className="step-card">
            <span>3</span>
            <h3>Track & Enjoy</h3>
            <p>Real-time updates from prep to delivery.</p>
          </div>
        </div>
      </section>

      <section className="section buddy fade-in">
        <div>
          <h2>Buddy Pool</h2>
          <p>
            Sellers can request trusted helpers when demand spikes, keeping
            quality high and delivery on time.
          </p>
        </div>
        <Link className="primary" href="/buddy-pool">
          Learn About Buddy Pool
        </Link>
      </section>

      <section className="section fade-in">
        <div className="section-header">
          <h2>Reviews & trust</h2>
          <p>Verified buyers and real ratings after completion.</p>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <div key={review.name} className="review-card">
              <h3>{review.name}</h3>
              <p>Rating {review.rating} ★</p>
              <p className="quote">“{review.quote}”</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section support fade-in">
        <div>
          <h2>Need help fast?</h2>
          <p>Chat with us or reach out on WhatsApp for quick support.</p>
        </div>
        <button className="ghost">Contact Support</button>
      </section>

      <SiteFooter />
    </main>
  );
}
