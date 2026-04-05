"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sellers } from "@/data/sellers";
import { loadBuyerState, setCheckoutDraft, addCartItem } from "@/data/buyerStorage";

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
    setCheckoutDraft({ deliveryLocation });
  }, [deliveryLocation]);

  useEffect(() => {
    const state = loadBuyerState();
    if (state.checkout.deliveryLocation) {
      setDeliveryLocation(state.checkout.deliveryLocation);
    }
  }, []);

  useEffect(() => {
    const gatewayUrl =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";
    fetch(`${gatewayUrl}/api/buyer/categories/header`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setHeaderCategories(data))
      .catch(() => setHeaderCategories([]));
    fetch(`${gatewayUrl}/api/buyer/curated/home`)
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
      <main className="flex flex-col gap-8 min-w-0">
        <div className="mb-2">
          <div className="relative flex flex-col md:flex-row gap-3">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search meals, sellers, categories..."
            />
            <button 
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-medium transition-colors" 
              type="button" 
              onClick={handleSearch}
            >
              Search
            </button>
            {suggestions.length ? (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-[#12021f]/95 backdrop-blur-md border border-white/12 rounded-xl p-2 shadow-2xl flex flex-col gap-1">
                {suggestions.map((item) => (
                  <Link
                    key={item.href + item.label}
                    className="px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
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

        <section className="flex overflow-x-auto gap-4 pb-4 mb-2 snap-x snap-mandatory scrollbar-thin">
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
                className="flex flex-col gap-2.5 text-center text-[#f6efff] p-3 rounded-[18px] border border-white/12 bg-white/5 min-w-[120px] snap-center transition-all hover:-translate-y-1 hover:border-purple-500/45 hover:bg-white/10"
                href={`/buyer/sellers?category=${slug}`}
              >
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-white/15 bg-white/10 shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={imageUrl}
                    alt={name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </Link>
            );
          })}
        </section>

        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-800 to-[#12021f] border border-white/10 p-8 md:p-12 mb-4">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-xl flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold m-0 text-white">Free Delivery on Your First Order!</h2>
            <p className="text-lg text-white/80 m-0">Use code <strong className="text-purple-300">JIKONI-NEW</strong> at checkout to redeem.</p>
            <button className="bg-white text-purple-900 px-6 py-3 rounded-full font-bold self-start mt-2 hover:bg-purple-100 transition-colors">
              Order Now
            </button>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 rounded-[18px] border border-white/10 bg-white/5">
            <div>
              <h3 className="text-lg font-semibold m-0">Delivery location</h3>
              <p className="text-sm text-white/60 m-0 mt-1">Used for delivery pricing and nearby sellers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                className="bg-[#12021f]/50 border border-white/10 rounded-xl px-4 py-2.5 min-w-[240px] focus:outline-none focus:border-purple-500/50"
                value={deliveryLocation}
                onChange={(event) => {
                  const value = event.target.value;
                  setDeliveryLocation(value);
                  setCheckoutDraft({ deliveryLocation: value });
                }}
                placeholder="Enter your location"
              />
              <button
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 whitespace-nowrap transition-colors"
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
          <section key={section.id} className="mb-10 flex flex-col gap-4">
            <h2 id={section.id} className="text-2xl font-bold m-0">{section.title}</h2>
            <div className="flex overflow-x-auto gap-5 pb-4 snap-x pr-4 scrollbar-thin">
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
                  className="relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 transition-all hover:-translate-y-1 hover:border-purple-500/45 group shrink-0 w-[240px] snap-start"
                >
                  <div className="h-[160px] overflow-hidden bg-white/5 w-full">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={imageUrl}
                      alt={product.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <h3 className="m-0 text-[1.1rem] font-semibold line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-white/60 m-0 line-clamp-2 min-h-[40px]">
                      {"description" in product ? product.description : ""}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-white/80 font-medium truncate mr-2">
                        {"sellerName" in product ? product.sellerName : "Jikoni Buddy"}
                      </span>
                      <strong className="text-purple-300 whitespace-nowrap">KES {product.price}</strong>
                    </div>
                  </div>
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-purple-600/90 backdrop-blur hover:bg-purple-500 text-white shadow-lg opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" 
                    onClick={(e) => {
                      e.preventDefault();
                      if ("sellerId" in product) {
                        addCartItem(
                          product.sellerId, 
                          {
                            id: product.id,
                            name: product.name,
                            price: product.price
                          },
                          "sellerName" in product ? product.sellerName : "Jikoni Seller"
                        );
                      }
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
