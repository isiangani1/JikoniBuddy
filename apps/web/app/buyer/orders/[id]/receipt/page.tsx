"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import { getOrder } from "@/data/buyerStorage";

export default function BuyerReceiptPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const order = useMemo(() => getOrder(params.id), [params.id]);
  const seller = useMemo(() => {
    if (!order) return null;
    return sellers.find((item) => item.id === order.sellerId) ?? null;
  }, [order]);

  if (!order) {
    return (
      <>
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
          <section className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2>Receipt not available</h2>
            <p className="text-white/50 text-sm">Order not found.</p>
            <Link className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" href="/buyer">
              Back to buyer
            </Link>
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
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Receipt</p>
            <h1>Payment receipt</h1>
            <p className="text-white/70 m-0 text-lg">Order #{order.id}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href={`/buyer/orders/${order.id}`}>
                Back to tracking
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer">
                Back to dashboard
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Payment</h3>
            <p className="text-white/50 text-sm">Method: {order.payment.method}</p>
            <p className="text-white/50 text-sm">Status: {order.payment.status}</p>
            {order.payment.receiptId ? (
              <p className="text-white/50 text-sm">Receipt: {order.payment.receiptId}</p>
            ) : (
              <p className="text-white/50 text-sm">Receipt: (pending)</p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Seller</h3>
              <p className="text-white/50 text-sm">{seller ? seller.name : order.sellerId}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Total</h3>
              <p className="text-white/50 text-sm">KES {order.total.toFixed(0)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Delivery</h3>
              <p className="text-white/50 text-sm">{order.checkout.deliveryLocation}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
