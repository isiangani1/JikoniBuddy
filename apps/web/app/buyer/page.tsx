"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sellers } from "@/data/sellers";
import { loadBuyerState, setCheckoutDraft } from "@/data/buyerStorage";

export default function BuyerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const fallbackCategories = [
    "Grocery",
    "Pizza",
    "Chicken",
    "Sushi",
    "Chinese",
    "Wings",
    "Burgers",
    "Indian",
    "Soup",
    "Fast Food",
    "Sandwich",
    "Thai",
    "Korean",
    "Halal",
    "Italian",
    "Healthy",
    "Japanese",
    "Mexican",
    "BBQ",
    "Vegan",
    "Asian",
    "Seafood",
    "Bakery",
    "Vietnamese",
    "Bubble Tea",
    "Comfort Food",
    "Greek",
    "American",
    "Ice Cream",
    "Coffee",
    "Poke",
    "Salads",
    "Smoothies",
    "Breakfast",
    "Caribbean",
    "Street Food",
    "Hawaiian"
  ];
  type HeaderCategory = {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
  };
  type CatalogProduct = {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
  };
  type HomeSection = {
    id: string;
    name: string;
    slug: string;
    products: CatalogProduct[];
  };

  const [headerCategories, setHeaderCategories] = useState<HeaderCategory[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const state = loadBuyerState();
    if (state.checkout.deliveryLocation) {
      setDeliveryLocation(state.checkout.deliveryLocation);
    }
  }, []);

  useEffect(() => {
    const buyerServiceUrl =
      process.env.NEXT_PUBLIC_BUYER_SERVICE_URL!;
    fetch(`${buyerServiceUrl}/buyer/categories/header`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setHeaderCategories(data))
      .catch(() => setHeaderCategories([]));
    fetch(`${buyerServiceUrl}/buyer/curated/home`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setHomeSections(data))
      .catch(() => setHomeSections([]));
  }, []);

  const featuredSellers = useMemo(
    () => [...sellers].sort((a, b) => b.rating - a.rating).slice(0, 4),
    []
  );

  const popularProducts = useMemo(
    () => sellers.flatMap((seller) =>
      seller.products.map((product) => ({
        sellerId: seller.id,
        sellerName: seller.name,
        ...product
      }))
    ),
    []
  );

  const availableNowSellers = useMemo(
    () => sellers.filter((seller) => seller.availability.toLowerCase().includes("available")),
    []
  );

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [] as Array<{ label: string; href: string }>;

    const sellerMatches = sellers
      .filter((seller) => seller.name.toLowerCase().includes(query))
      .slice(0, 5)
      .map((seller) => ({
        label: `Seller: ${seller.name}`,
        href: `/buyer/sellers/${seller.id}`
      }));

    const productMatches = sellers
      .flatMap((seller) =>
        seller.products.map((product) => ({ seller, product }))
      )
      .filter(({ product }) => product.name.toLowerCase().includes(query))
      .slice(0, 5)
      .map(({ seller, product }) => ({
        label: `${product.name} · ${seller.name}`,
        href: `/buyer/sellers/${seller.id}`
      }));

    return [...sellerMatches, ...productMatches].slice(0, 8);
  }, [search]);

  const handleSearch = () => {
    if (!search.trim()) return;
    const first = suggestions[0];
    if (first) {
      router.push(first.href);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const label = `Current location (${position.coords.latitude.toFixed(5)}, ${
          position.coords.longitude.toFixed(5)
        })`;
        setDeliveryLocation(label);
        setCheckoutDraft({ deliveryLocation: label });
      },
      () => {
        alert("Unable to fetch current location.");
      }
    );
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const imageForCategory = (name: string) => {
    const slug = slugify(name);
    return `/buyer-categories/${slug}.jpg`;
  };

  const imageForProduct = (name: string, section?: string) => {
    const text = `${section ?? ""} ${name}`.toLowerCase();
    const matched = fallbackCategories.find((category) =>
      text.includes(category.toLowerCase())
    );
    const slug = matched ? slugify(matched) : "grocery";
    return `/buyer-categories/${slug}.jpg`;
  };


  return (
    <>
      <main className="browse-content">
        <div className="browse-header">
          <div className="browse-search" style={{ position: "relative" }}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meals, sellers, categories..."
            />
            <button className="primary" type="button" onClick={handleSearch}>
              Search
            </button>
            {suggestions.length ? (
              <div className="dropdown-panel" style={{ opacity: 1, pointerEvents: "auto" }}>
                {suggestions.map((item) => (
                  <Link
                    key={item.href + item.label}
                    className="dropdown-item"
                    href={item.href}
                    onClick={() => setSearch("")}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section className="category-strip">
          {(headerCategories.length ? headerCategories : fallbackCategories).map(
            (category) => {
              const name = typeof category === "string" ? category : category.name;
              const slug =
                typeof category === "string" ? slugify(category) : category.slug;
              const imageUrl =
                typeof category === "string"
                  ? imageForCategory(name)
                  : category.imageUrl && category.imageUrl.startsWith("http")
                    ? imageForCategory(name)
                    : category.imageUrl ?? imageForCategory(name);
            return (
              <Link
                key={slug}
                className="category-pill"
                href={`/buyer/sellers?category=${slug}`}
              >
                <div className="category-pill-image">
                  <img
                    src={imageUrl}
                    alt={name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span>{name}</span>
              </Link>
            );
          })}
        </section>

        <section className="hero-banner">
          <div className="hero-content">
            <h2>Free Delivery on Your First Order!</h2>
            <p>Use code <strong>JIKONI-NEW</strong> at checkout to redeem.</p>
            <button className="primary">Order Now</button>
          </div>
        </section>

        <section className="browse-section">
          <div className="buyer-location-card">
            <div>
              <h3>Delivery location</h3>
              <p className="muted">Used for delivery pricing and nearby sellers.</p>
            </div>
            <div className="location-inputs">
              <input
                value={deliveryLocation}
                onChange={(event) => {
                  const value = event.target.value;
                  setDeliveryLocation(value);
                  setCheckoutDraft({ deliveryLocation: value });
                }}
                placeholder="Enter your location"
              />
              <button
                className="ghost"
                type="button"
                onClick={handleUseCurrentLocation}
              >
                Use my location
              </button>
            </div>
          </div>
        </section>

        {(homeSections.length
          ? homeSections.map((section) => ({
              id: section.slug,
              title: section.name,
              products: section.products
            }))
          : [
              { id: "special-today", title: "Special today", products: popularProducts.slice(0, 6) },
              { id: "fast-deliveries", title: "Fast deliveries", products: popularProducts.slice(6, 12) },
              { id: "near-you", title: "Sellers near you", products: popularProducts.slice(12, 18) },
              { id: "highest-rated", title: "Highest rated", products: popularProducts.slice(18, 24) },
              { id: "todays-offers", title: "Today's offers", products: popularProducts.slice(24, 30) },
              { id: "local-legends", title: "Local legends", products: popularProducts.slice(30, 36) },
              { id: "most-viewed", title: "Most viewed", products: popularProducts.slice(36, 42) },
              { id: "picnic-greats", title: "Great for picnics", products: popularProducts.slice(0, 6) },
              { id: "stock-up", title: "Stock up groceries", products: popularProducts.slice(6, 12) }
            ]
        ).map((section) => (
          <section key={section.id} className="browse-section">
            <h2 id={section.id}>{section.title}</h2>
            <div className="product-carousel">
              {section.products.map((product) => {
                const link =
                  "sellerId" in product
                    ? `/buyer/sellers/${product.sellerId}`
                    : `/buyer/sellers?category=${section.id}`;
                const imageUrl =
                  "imageUrl" in product && product.imageUrl && !product.imageUrl.startsWith("http")
                    ? product.imageUrl
                    : imageForProduct(product.name, section.title);
                return (
                <Link
                  key={product.id}
                  href={link}
                  className="product-card"
                >
                  <div className="product-image">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="product-meta">
                    <h3>{product.name}</h3>
                    <p className="muted">
                      {"description" in product ? product.description : ""}
                    </p>
                    <div className="product-footer">
                      <span>
                        {"sellerName" in product ? product.sellerName : "Jikoni Buddy"}
                      </span>
                      <strong>KES {product.price}</strong>
                    </div>
                  </div>
                  <button 
                    className="quick-add-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      // Prevent navigation and add to cart
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
