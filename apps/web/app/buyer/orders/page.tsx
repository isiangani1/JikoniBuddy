"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { loadOrders, startReorder } from "@/data/buyerStorage";

export default function BuyerOrdersPage() {
  const router = useRouter();
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const orders = useMemo(() => loadOrders(), [version]);

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-800 to-[#12021f] border border-white/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10 w-full justify-between items-center">
            <div className="flex flex-col gap-4 max-w-xl">
              <p className="text-purple-300 font-bold tracking-widest uppercase text-sm m-0">Orders</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white m-0">Order history</h1>
              <p className="text-lg text-white/80 m-0">Track past orders and reorder quickly.</p>
              <div className="flex gap-3 mt-2">
                <Link className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href="/buyer">
                  Back to dashboard
                </Link>
                <Link className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href="/buyer/account">
                  Account
                </Link>
              </div>
            </div>
            
            <div className="bg-[#12021f]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-sm w-full">
              <h3 className="text-white font-bold text-lg m-0 mb-2">Tips</h3>
              <p className="text-white/60 text-sm m-0">Reorder refills your cart using the previous items.</p>
            </div>
          </div>
        </section>

        <section className="animate-in fade-in duration-500 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white m-0">Recent orders</h2>
          {orders.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 12).map((order) => {
                const seller = sellers.find((item) => item.id === order.sellerId);
                return (
                  <div key={order.id} className="relative flex flex-col rounded-[20px] overflow-hidden border border-white/12 bg-white/5 transition-all hover:-translate-y-1 hover:border-purple-500/45 p-6 group">
                    <h3 className="text-lg font-bold text-white m-0 mb-2">Order #{order.id}</h3>
                    <p className="text-white/60 text-sm m-0 mb-1">Seller: <strong className="text-white">{seller ? seller.name : order.sellerId}</strong></p>
                    <p className="text-white/60 text-sm m-0 mb-1">Status: <strong className="text-white capitalize">{order.status.replace(/_/g, " ")}</strong></p>
                    <p className="text-white/60 text-sm m-0 mb-4">Total: <strong className="text-purple-400">KES {order.total.toFixed(0)}</strong></p>
                    
                    <div className="flex gap-3 mt-auto pt-4 border-t border-white/10">
                      <Link className="flex-1 text-center px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href={`/buyer/orders/${order.id}`}>
                        View
                      </Link>
                      <button
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer"
                        type="button"
                        onClick={() => {
                          startReorder(order.id);
                          setVersion((v) => v + 1);
                          router.push("/buyer/checkout");
                        }}
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white/5 rounded-[24px] border-2 border-dashed border-white/10">
              <p className="text-white/60 m-0 text-lg">No orders yet. Place an order to see it here.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
