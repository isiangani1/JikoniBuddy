"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sellers } from "@/data/sellers";

type SortKey = "rating" | "eta" | "price";

function parsePriceRange(range: string) {
  // expects something like "KES 350-900"
  const match = range.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return { min: Number.POSITIVE_INFINITY, max: Number.POSITIVE_INFINITY };
  return { min: Number(match[1]), max: Number(match[2]) };
}

function parseEtaMinutes(eta: string) {
  // expects something like "30-45 min"
  const match = eta.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]);
}

export default function BuyerSellerListingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<"all" | "available_now">("all");
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = sellers.filter((seller) => {
      const matchesQuery =
        !q ||
        seller.name.toLowerCase().includes(q) ||
        seller.services.some((service) => service.toLowerCase().includes(q)) ||
        seller.products.some((product) => product.name.toLowerCase().includes(q));

      const matchesAvailability =
        availability === "all"
          ? true
          : seller.availability.toLowerCase().includes("available");

      return matchesQuery && matchesAvailability;
    });

    const sorted = [...base].sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "eta") return parseEtaMinutes(a.eta) - parseEtaMinutes(b.eta);
      const ap = parsePriceRange(a.priceRange);
      const bp = parsePriceRange(b.priceRange);
      return ap.min - bp.min;
    });

    return sorted;
  }, [availability, query, sortKey]);

  return (
    <>
      <main className="browse-page">
        <aside className="browse-sidebar">
          <div className="sidebar-title">Discover</div>

          <div className="sidebar-section">
            <h4>Search</h4>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sellers, meals, services..."
            />
          </div>

          <div className="sidebar-section">
            <h4>Availability</h4>
            <div className="sidebar-nav">
              <button
                className={`sidebar-item ${availability === "all" ? "active" : ""}`}
                type="button"
                onClick={() => setAvailability("all")}
              >
                All
              </button>
              <button
                className={`sidebar-item ${availability === "available_now" ? "active" : ""}`}
                type="button"
                onClick={() => setAvailability("available_now")}
              >
                Available now
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h4>Sort by</h4>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
            >
              <option value="rating">Top rated</option>
              <option value="eta">Fastest delivery</option>
              <option value="price">Lowest price</option>
            </select>
          </div>

          <div className="sidebar-section">
            <h4>Map view</h4>
            <button
              className="ghost full"
              type="button"
              onClick={() => setShowMap((value) => !value)}
            >
              {showMap ? "Hide map" : "Show map"}
            </button>
            <p className="muted">
              Map is a placeholder for later Google Maps integration.
            </p>
          </div>

          <div className="sidebar-section">
            <Link className="ghost full" href="/buyer">
              Back to dashboard
            </Link>
          </div>
        </aside>

        <section className="browse-content">
          <div className="browse-header">
            <div>
              <p className="eyebrow">Seller discovery</p>
              <h1>Browse sellers</h1>
              <p className="subhead">
                Compare sellers by rating, delivery time, price range, and
                availability.
              </p>
            </div>
            <div className="browse-search">
              <button className="primary" type="button" onClick={() => router.push("/buyer")}>
                Schedule an order
              </button>
            </div>
          </div>

          {showMap ? (
            <section className="browse-section">
              <h2>Map view</h2>
              <div className="category-grid">
                <div className="category-card">
                  <h3>Map placeholder</h3>
                  <p className="muted">
                    Add Google Maps here later (buyer location + seller markers).
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <section className="browse-section">
            <h2>Results ({filtered.length})</h2>
            <div className="seller-grid">
              {filtered.map((seller) => (
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
                  <span className="badge">View menu</span>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
