"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sellers } from "@/data/sellers";
import {
  CheckoutDraft,
  clearBuyerCart,
  computeSubtotal,
  loadBuyerState,
  placeOrder,
  quoteDelivery,
  SavedAddress,
  setCheckoutDraft,
  updateCartQty
} from "@/data/buyerStorage";

export default function BuyerCheckoutPage() {
  const router = useRouter();
  const [cartVersion, setCartVersion] = useState(0);
  const buyerState = useMemo(() => loadBuyerState(), [cartVersion]);
  const [mpesaPhone, setMpesaPhone] = useState("");

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  const seller = useMemo(() => {
    if (!buyerState.sellerId) return null;
    return sellers.find((item) => item.id === buyerState.sellerId) ?? null;
  }, [buyerState.sellerId]);

  const subtotal = useMemo(
    () => computeSubtotal(buyerState.cart),
    [buyerState.cart]
  );

  const deliveryQuote = useMemo(() => quoteDelivery(subtotal), [subtotal]);

  const total = subtotal + deliveryQuote.fee;

  const [draft, setDraft] = useState<CheckoutDraft>(buyerState.checkout);

  useEffect(() => {
    setDraft(buyerState.checkout);
  }, [buyerState.checkout]);

  useEffect(() => {
    if (!buyerState.cart.length) {
      router.replace("/buyer");
    }
  }, [buyerState.cart.length, router]);

  const handleChange = (update: Partial<CheckoutDraft>) => {
    const next = { ...draft, ...update };
    setDraft(next);
    setCheckoutDraft(update);
  };

  const handlePlaceOrder = () => {
    if (!buyerState.sellerId || !buyerState.cart.length) return;

    if (!draft.deliveryLocation.trim()) {
      alert("Please enter a delivery location.");
      return;
    }

    if (!draft.scheduledDate.trim() || !draft.timeWindow.trim()) {
      alert("Please select a scheduled date and time window.");
      return;
    }

    const orderId = `ord-${Date.now()}`;

    const created = placeOrder({
      id: orderId,
      sellerId: buyerState.sellerId,
      items: buyerState.cart,
      subtotal,
      delivery: deliveryQuote,
      total,
      checkout: draft,
      payment: {
        method: draft.paymentMethod,
        status: "not_started",
        phoneNumber: draft.paymentMethod === "mpesa" ? mpesaPhone : undefined
      },
      status: "placed"
    });

    clearBuyerCart();
    setCartVersion((v) => v + 1);

    router.push(`/buyer/orders/${created.id}`);
  };

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-purple-800 to-[#12021f] border border-white/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10 w-full justify-between items-start md:items-center">
            <div className="flex flex-col gap-4 max-w-xl">
              <p className="text-purple-300 font-bold tracking-widest uppercase text-sm m-0">Scheduled Checkout</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white m-0">Confirm your order</h1>
              <p className="text-lg text-white/80 m-0">
                {seller ? (
                  <>Ordering from <strong className="text-white">{seller.name}</strong>.</>
                ) : (
                  <>Select a seller to begin.</>
                )}
              </p>
              <div className="flex mt-2">
                <Link className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors" href="/buyer">
                  Continue browsing
                </Link>
              </div>
            </div>

            <div className="bg-[#12021f]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-md">
              <h3 className="text-white font-bold text-xl m-0 mb-4 border-b border-white/10 pb-3">Order Summary</h3>
              {!buyerState.cart.length ? (
                <p className="text-white/60 text-sm">Your cart is empty.</p>
              ) : (
                <ul className="flex flex-col gap-3 m-0 p-0 mb-4 border-b border-white/10 pb-4">
                  {buyerState.cart.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <div className="text-white font-medium">
                        {item.name} <span className="text-white/50 text-sm ml-1">× {item.qty}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1 border border-white/5">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-white transition-colors"
                          type="button"
                          onClick={() => {
                            updateCartQty(item.id, item.qty - 1);
                            setCartVersion((v) => v + 1);
                          }}
                        >
                          -
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-white transition-colors"
                          type="button"
                          onClick={() => {
                            updateCartQty(item.id, item.qty + 1);
                            setCartVersion((v) => v + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Delivery ({deliveryQuote.label})</span>
                  <span>KES {deliveryQuote.fee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 mt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-purple-400">KES {total.toFixed(0)}</span>
                </div>
              </div>
              <button 
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95" 
                type="button" 
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="animate-in fade-in duration-500 bg-white/5 border border-white/10 p-6 md:p-8 rounded-[24px]">
            <h2 className="text-2xl font-bold text-white m-0 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg">📍</span>
              Delivery & Schedule
            </h2>
            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Saved addresses</span>
                <select
                  value={draft.deliveryAddressLabel}
                  onChange={(event) => {
                    const label = event.target.value;
                    const address = buyerState.addresses.find((item: SavedAddress) => item.label === label);
                    handleChange({
                      deliveryAddressLabel: label,
                      deliveryLocation: address ? address.location : draft.deliveryLocation
                    });
                  }}
                  className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium appearance-none"
                >
                  <option value="">Select a saved address</option>
                  {buyerState.addresses.map((address: SavedAddress) => (
                    <option key={address.id} value={address.label}>
                      {address.label}
                    </option>
                  ))}
                </select>
              </label>
              
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Delivery location</span>
                <input
                  value={draft.deliveryLocation}
                  onChange={(event) =>
                    handleChange({ deliveryLocation: event.target.value })
                  }
                  placeholder="Enter delivery location"
                  className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                />
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Date</span>
                  <input
                    type="date"
                    value={draft.scheduledDate}
                    onChange={(event) =>
                      handleChange({ scheduledDate: event.target.value })
                    }
                    className="w-full p-3.5 bg-black/30 border border-white/10 text-[15px] text-white/80 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Time window</span>
                  <input
                    value={draft.timeWindow}
                    onChange={(event) => handleChange({ timeWindow: event.target.value })}
                    placeholder="12:00 - 14:00"
                    className="w-full p-3.5 bg-black/30 border border-white/10 text-[15px] text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                  />
                </label>
              </div>
              
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Order notes</span>
                <textarea
                  value={draft.orderNotes}
                  onChange={(event) => handleChange({ orderNotes: event.target.value })}
                  placeholder="Special instructions, dietary requirements, landmarks..."
                  className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium resize-y min-h-[100px]"
                />
              </label>
            </div>
          </section>

          <section className="animate-in fade-in duration-500 bg-white/5 border border-white/10 p-6 md:p-8 rounded-[24px] h-fit">
            <h2 className="text-2xl font-bold text-white m-0 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-lg">💳</span>
              Payment
            </h2>
            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Payment method</span>
                <select
                  value={draft.paymentMethod}
                  onChange={(event) =>
                    handleChange({
                      paymentMethod: event.target.value as CheckoutDraft["paymentMethod"]
                    })
                  }
                  className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium appearance-none"
                >
                  <option value="mpesa">M-Pesa STK Push</option>
                  <option value="cash">Pay on delivery</option>
                </select>
              </label>

              {draft.paymentMethod === "mpesa" ? (
                <label className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                  <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">M-Pesa phone number</span>
                  <input
                    value={mpesaPhone}
                    onChange={(event) => setMpesaPhone(event.target.value)}
                    placeholder="07xx xxx xxx"
                    className="w-full p-3.5 bg-green-900/20 border border-green-500/30 text-[15px] text-white rounded-xl focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all font-medium placeholder:text-white/30"
                  />
                </label>
              ) : null}

              <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-2">
                <span className="text-purple-300 font-bold text-sm">Testing Mode</span>
                <p className="text-purple-200/70 text-sm m-0 leading-relaxed">
                  Payment is currently stubbed. This screen is ready for API wiring to
                  M-Pesa and pay-on-delivery records.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
