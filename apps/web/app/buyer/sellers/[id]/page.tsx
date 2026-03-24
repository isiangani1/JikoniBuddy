"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import {
  addCartItem,
  computeSellerAverageRating,
  computeSubtotal,
  getSellerReviews,
  loadBuyerState,
  updateCartQty
} from "@/data/buyerStorage";

export default function BuyerSellerDetailPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const seller = sellers.find((item) => item.id === params.id);
  const [cartVersion, setCartVersion] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === "jb_buyer_state") {
        setCartVersion((v) => v + 1);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const buyerState = useMemo(() => loadBuyerState(), [cartVersion]);
  const cart = buyerState.cart;

  const total = useMemo(
    () => computeSubtotal(cart),
    [cart]
  );

  const reviews = useMemo(
    () => (seller ? getSellerReviews(seller.id) : []),
    [seller, cartVersion]
  );

  const averageRating = useMemo(
    () => (seller ? computeSellerAverageRating(seller.id) : null),
    [seller, cartVersion]
  );

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      alert("Please log in to continue to checkout.");
      router.push("/login");
      return;
    }
    router.push("/buyer/checkout");
  };

  const handlePreOrderMessage = () => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      alert("Please log in to message this seller.");
      router.push("/login");
      return;
    }
    alert(
      "Pre-order messaging will be available once an order is placed. For now, place an order to unlock order chat."
    );
  };

  if (!seller) {
    return (
      <>
        <main className="category-page">
          <section className="section fade-in">
            <h2>Seller not found</h2>
            <p className="muted">Please return to available sellers.</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">{seller.availability}</p>
            <h1>{seller.name}</h1>
            <p className="subhead">
              Rating {(averageRating ?? seller.rating).toFixed(1)} ★ · {seller.eta} · {seller.priceRange}
            </p>
            <div className="hero-actions">
              {seller.services.map((service) => (
                <span key={service} className="badge">
                  {service}
                </span>
              ))}
              <Link className="badge" href="/buyer/sellers">
                Back to sellers
              </Link>
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
                    <div className="cart-line">
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <div className="cart-actions">
                        <button
                          className="ghost"
                          type="button"
                          onClick={() => {
                            updateCartQty(item.id, item.qty - 1);
                            setCartVersion((v) => v + 1);
                          }}
                        >
                          -
                        </button>
                        <button
                          className="ghost"
                          type="button"
                          onClick={() => {
                            updateCartQty(item.id, item.qty + 1);
                            setCartVersion((v) => v + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="muted">Total: KES {total.toFixed(0)}</p>
            <button className="primary full" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="ghost full" type="button" onClick={handlePreOrderMessage}>
              Message seller
            </button>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Availability & scheduling</h2>
          <div className="category-grid">
            <div className="category-card">
              <h3>Next available</h3>
              <p className="muted">Today · 12:00 - 14:00</p>
              <p className="muted">Lead time: 60-90 minutes (stub)</p>
            </div>
            <div className="category-card">
              <h3>Blackout periods</h3>
              <p className="muted">None configured (stub)</p>
            </div>
            <div className="category-card">
              <h3>Service area</h3>
              <p className="muted">Nairobi (stub)</p>
            </div>
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
                  onClick={() => {
                    addCartItem(seller.id, product);
                    setCartVersion((v) => v + 1);
                  }}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="section fade-in">
          <h2>Reviews</h2>
          <div className="category-grid">
            <div className="category-card">
              <h3>Verified buyer reviews</h3>
              {reviews.length ? (
                <div>
                  <p className="muted">Average: {(averageRating ?? 0).toFixed(1)} ★</p>
                  <ul>
                    {reviews.slice(0, 3).map((review) => (
                      <li key={review.id}>
                        <p>
                          {review.rating} ★ — {review.comment || "(no comment)"}
                        </p>
                        <p className="muted">Order #{review.orderId}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="muted">No reviews yet.</p>
              )}
            </div>
            <div className="category-card">
              <h3>Leave a review</h3>
              <p className="muted">Only available after order completion.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
