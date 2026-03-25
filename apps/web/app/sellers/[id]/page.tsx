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
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
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
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Seller not found</h2>
            <p className="text-white/50 text-sm">Please return to available sellers.</p>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">{seller.availability}</p>
            <h1>{seller.name}</h1>
            <p className="text-white/70 m-0 text-lg">
              Rating {seller.rating.toFixed(1)} ★ · {seller.eta} · {seller.priceRange}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {seller.services.map((service) => (
                <span key={service} className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30">
                  {service}
                </span>
              ))}
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
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-white/50 text-sm">Total: KES {total.toFixed(0)}</p>
            <button className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
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
