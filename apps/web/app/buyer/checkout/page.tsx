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
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
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
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Scheduled Checkout</p>
            <h1>Confirm your order</h1>
            <p className="subhead">
              {seller ? (
                <>Ordering from {seller.name}.</>
              ) : (
                <>Select a seller to begin.</>
              )}
            </p>
            <div className="hero-actions">
              <Link className="badge" href="/buyer">
                Continue browsing
              </Link>
            </div>
          </div>

          <div className="category-hero-card">
            <h3>Order Summary</h3>
            {!buyerState.cart.length ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              <ul>
                {buyerState.cart.map((item) => (
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
            <p className="muted">Subtotal: KES {subtotal.toFixed(0)}</p>
            <p className="muted">
              Delivery fee: KES {deliveryQuote.fee.toFixed(0)} · {deliveryQuote.label}
            </p>
            <p className="muted">Total: KES {total.toFixed(0)}</p>
            <button className="primary full" type="button" onClick={handlePlaceOrder}>
              Place order
            </button>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Delivery & schedule</h2>
          <div className="form">
            <label className="field">
              <span>Saved addresses</span>
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
              >
                <option value="">Select a saved address</option>
                {buyerState.addresses.map((address: SavedAddress) => (
                  <option key={address.id} value={address.label}>
                    {address.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Delivery location</span>
              <input
                value={draft.deliveryLocation}
                onChange={(event) =>
                  handleChange({ deliveryLocation: event.target.value })
                }
                placeholder="Enter delivery location"
              />
            </label>
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={draft.scheduledDate}
                onChange={(event) =>
                  handleChange({ scheduledDate: event.target.value })
                }
              />
            </label>
            <label className="field">
              <span>Time window</span>
              <input
                value={draft.timeWindow}
                onChange={(event) => handleChange({ timeWindow: event.target.value })}
                placeholder="12:00 - 14:00"
              />
            </label>
            <label className="field">
              <span>Order notes</span>
              <textarea
                value={draft.orderNotes}
                onChange={(event) => handleChange({ orderNotes: event.target.value })}
                placeholder="Special instructions, dietary requirements, landmarks..."
              />
            </label>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Payment</h2>
          <div className="form">
            <label className="field">
              <span>Payment method</span>
              <select
                value={draft.paymentMethod}
                onChange={(event) =>
                  handleChange({
                    paymentMethod: event.target.value as CheckoutDraft["paymentMethod"]
                  })
                }
              >
                <option value="mpesa">M-Pesa STK Push</option>
                <option value="cash">Pay on delivery</option>
              </select>
            </label>

            {draft.paymentMethod === "mpesa" ? (
              <label className="field">
                <span>M-Pesa phone number</span>
                <input
                  value={mpesaPhone}
                  onChange={(event) => setMpesaPhone(event.target.value)}
                  placeholder="07xx xxx xxx"
                />
              </label>
            ) : null}

            <p className="muted">
              Payment is currently stubbed. This screen is ready for API wiring to
              M-Pesa and pay-on-delivery records.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
