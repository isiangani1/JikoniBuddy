"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { sellers } from "@/data/sellers";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export default function SellerDetailPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const seller = sellers.find((item) => item.id === params.id);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id
            ? { ...entry, qty: entry.qty + 1 }
            : entry
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      alert("Please log in to continue to checkout.");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (!seller) {
    return (
      <>
        <SiteHeader />
        <main className="category-page">
          <section className="section fade-in">
            <h2>Seller not found</h2>
            <p className="muted">Please return to available sellers.</p>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">{seller.availability}</p>
            <h1>{seller.name}</h1>
            <p className="subhead">
              Rating {seller.rating.toFixed(1)} ★ · {seller.eta} · {seller.priceRange}
            </p>
            <div className="hero-actions">
              {seller.services.map((service) => (
                <span key={service} className="badge">
                  {service}
                </span>
              ))}
            </div>
          </div>
          <div className="category-hero-card">
            <h3>Order Summary</h3>
            {cart.length === 0 ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
            )}
            <p className="muted">Total: KES {total.toFixed(0)}</p>
            <button className="primary full" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Menu</h2>
          <div className="category-grid">
            {seller.products.map((product) => (
              <div key={product.id} className="category-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="muted">KES {product.price}</p>
                <button
                  className="primary"
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
