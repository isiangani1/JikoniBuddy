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
    router.push("/buyer/checkout");
  };

  const handlePreOrderMessage = () => {
    alert(
      "Pre-order messaging will be available once an order is placed. For now, place an order to unlock order chat."
    );
  };

  if (!seller) {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Seller not found</h2>
            <p className="text-white/50 text-sm">Please return to available sellers.</p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">{seller.availability}</p>
            <h1>{seller.name}</h1>
            <p className="text-white/70 m-0 text-lg">
              Rating {(averageRating ?? seller.rating).toFixed(1)} ★ · {seller.eta} · {seller.priceRange}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {seller.services.map((service) => (
                <span key={service} className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30">
                  {service}
                </span>
              ))}
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/sellers">
                Back to sellers
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Order Summary</h3>
            {cart.length === 0 ? (
              <p className="text-white/50 text-sm">Your cart is empty.</p>
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
                          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur"
                          type="button"
                          onClick={() => {
                            updateCartQty(item.id, item.qty - 1);
                            setCartVersion((v) => v + 1);
                          }}
                        >
                          -
                        </button>
                        <button
                          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur"
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
            <p className="text-white/50 text-sm">Total: KES {total.toFixed(0)}</p>
            <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur full" type="button" onClick={handlePreOrderMessage}>
              Message seller
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Availability & scheduling</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Next available</h3>
              <p className="text-white/50 text-sm">Today · 12:00 - 14:00</p>
              <p className="text-white/50 text-sm">Lead time: {seller.eta}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Blackout periods</h3>
              <p className="text-white/50 text-sm">No blackout periods listed.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Service area</h3>
              <p className="text-white/50 text-sm">Nairobi metro area</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {seller.products.map((product) => (
              <div key={product.id} className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="text-white/50 text-sm">KES {product.price}</p>
                <button
                  className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
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

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Verified buyer reviews</h3>
              {reviews.length ? (
                <div>
                  <p className="text-white/50 text-sm">Average: {(averageRating ?? 0).toFixed(1)} ★</p>
                  <ul>
                    {reviews.slice(0, 3).map((review) => (
                      <li key={review.id}>
                        <p>
                          {review.rating} ★ — {review.comment || "(no comment)"}
                        </p>
                        <p className="text-white/50 text-sm">Order #{review.orderId}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-white/50 text-sm">No reviews yet.</p>
              )}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Leave a review</h3>
              <p className="text-white/50 text-sm">Only available after order completion.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
