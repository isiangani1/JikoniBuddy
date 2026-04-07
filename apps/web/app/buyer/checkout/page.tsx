"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("jb_auth") === "true";
    setIsLoggedIn(loggedIn);
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
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ label: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(buyerState.checkout);
  }, [buyerState.checkout]);

  useEffect(() => {
    if (!buyerState.cart.length) {
      router.replace("/buyer");
    }
  }, [buyerState.cart.length, router]);

  useEffect(() => {
    if (buyerState.addresses.length > 0) return;
    if (draft.deliveryLocation.trim()) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoError(null);
        const label = `Current location (${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)})`;
        setMapCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        handleChange({
          deliveryLocation: label,
          deliveryLat: position.coords.latitude,
          deliveryLng: position.coords.longitude
        });
      },
      () => setGeoError("We could not access your location. You can search or pin it on the map.")
    );
  }, [buyerState.addresses.length, draft.deliveryLocation]);

  useEffect(() => {
    if (draft.deliveryLat !== null && draft.deliveryLng !== null) {
      setMapCoords({ lat: draft.deliveryLat, lng: draft.deliveryLng });
    }
  }, [draft.deliveryLat, draft.deliveryLng]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchQuery.trim().length < 3) return;
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data?.results ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const applyLocation = (label: string, lat: number, lng: number) => {
    handleChange({ deliveryLocation: label, deliveryLat: lat, deliveryLng: lng });
    setMapCoords({ lat, lng });
    setSearchResults([]);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      return data?.label ?? null;
    } catch {
      return null;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGeoError(null);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const label =
          (await reverseGeocode(lat, lng)) ??
          `Current location (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
        setMapCoords({ lat, lng });
        handleChange({ deliveryLocation: label, deliveryLat: lat, deliveryLng: lng });
      },
      () => {
        setGeoError("Unable to fetch current location.");
        alert("Unable to fetch current location.");
      }
    );
  };

  const MapPicker = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setMapCoords({ lat, lng });
        handleChange({
          deliveryLocation: `Pin at ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
          deliveryLat: lat,
          deliveryLng: lng
        });
      }
    });
    return mapCoords ? <Marker position={[mapCoords.lat, mapCoords.lng]} /> : null;
  };

  const handleChange = (update: Partial<CheckoutDraft>) => {
    const next = { ...draft, ...update };
    setDraft(next);
    setCheckoutDraft(update);
  };

  const handlePlaceOrder = async () => {
    if (!buyerState.cart.length) return;

    const isScheduled =
      draft.scheduledDate.trim().length > 0 && draft.timeWindow.trim().length > 0;

    if (isScheduled && !isLoggedIn) {
      alert("Please log in to schedule a delivery or service.");
      router.push("/login");
      return;
    }

    if (isScheduled && draft.paymentMethod !== "mpesa") {
      alert("Scheduled deliveries require at least a 45% advance payment via M-Pesa.");
      return;
    }

    if (!isLoggedIn && draft.paymentMethod !== "cash") {
      alert("Please log in to pay with M-Pesa. You can still choose Pay on delivery.");
      router.push("/login");
      return;
    }

    if (draft.paymentMethod === "mpesa" && !mpesaPhone.trim()) {
      alert("Please enter an M-Pesa phone number.");
      return;
    }

    if (!draft.deliveryLocation.trim()) {
      alert("Please enter a delivery location.");
      return;
    }

    if (isScheduled && (!draft.scheduledDate.trim() || !draft.timeWindow.trim())) {
      alert("Please select a scheduled date and time window.");
      return;
    }

    const orderId = `ord-${Date.now()}`;
    const buyerId =
      sessionStorage.getItem("jb_user_id") ||
      sessionStorage.getItem("jb_buyer_id") ||
      localStorage.getItem("jb_session");

    setIsSubmittingPayment(true);
    try {
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: buyerId,
          amount: total,
          method: draft.paymentMethod,
          phone: draft.paymentMethod === "mpesa" ? mpesaPhone : undefined,
          orderId
        })
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to create payment record.");
      }

      const paymentPayload = await paymentRes.json();

      const firstSellerId = buyerState.cart[0]?.sellerId || "unknown";
      const created = placeOrder({
        id: orderId,
        sellerId: firstSellerId,
        items: buyerState.cart,
        subtotal,
        delivery: deliveryQuote,
        total,
        checkout: draft,
        payment: {
          method: draft.paymentMethod,
          status: "pending",
          receiptId: paymentPayload?.paymentId,
          phoneNumber: draft.paymentMethod === "mpesa" ? mpesaPhone : undefined
        },
        status: "placed"
      });

      clearBuyerCart();
      setCartVersion((v) => v + 1);

      router.push(`/buyer/orders/${created.id}`);
    } catch (error) {
      console.error(error);
      alert("Could not initiate payment. Please try again.");
    } finally {
      setIsSubmittingPayment(false);
    }
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
                    <li key={item.id} className="flex justify-between items-center py-1">
                      <div className="flex flex-col">
                        <div className="text-white font-medium">
                          {item.name} <span className="text-white/50 text-sm ml-1">× {item.qty}</span>
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-tighter font-bold uppercase">{item.sellerName}</span>
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
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors ml-1"
                          type="button"
                          onClick={() => {
                            updateCartQty(item.id, 0);
                            setCartVersion((v) => v + 1);
                          }}
                          title="Remove item"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-60" 
                type="button" 
                onClick={handlePlaceOrder}
                disabled={isSubmittingPayment}
              >
                {isSubmittingPayment ? "Processing payment..." : "Place order"}
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
                      deliveryLocation: address ? address.location : draft.deliveryLocation,
                      deliveryLat: address?.lat ?? null,
                      deliveryLng: address?.lng ?? null
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
                <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Search address</span>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search for a place or landmark"
                  className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                />
                {isSearching ? (
                  <p className="text-xs text-white/50">Searching...</p>
                ) : null}
                {searchResults.length ? (
                  <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-3">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.lat}-${result.lng}`}
                        type="button"
                        onClick={() => applyLocation(result.label, result.lat, result.lng)}
                        className="text-left text-sm text-white/80 hover:text-white"
                      >
                        {result.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white/70 uppercase tracking-widest text-[11px]">Delivery location</span>
                <input
                  value={draft.deliveryLocation}
                  onChange={(event) =>
                    handleChange({ deliveryLocation: event.target.value, deliveryLat: null, deliveryLng: null })
                  }
                  placeholder="Enter delivery location"
                  className="w-full p-3.5 bg-black/30 border border-white/10 text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                />
                {geoError ? <p className="text-xs text-orange-200">{geoError}</p> : null}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    Use my location
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMapOpen((value) => !value)}
                    className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    {isMapOpen ? "Hide map" : "Pick on map"}
                  </button>
                </div>
                {isMapOpen ? (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-white/10">
                    <MapContainer
                      center={[mapCoords?.lat ?? -1.286389, mapCoords?.lng ?? 36.817223]}
                      zoom={13}
                      className="h-[240px] w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <MapPicker />
                    </MapContainer>
                  </div>
                ) : null}
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
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                      Delivery location for pay on delivery
                    </span>
                    {buyerState.addresses.length ? (
                      <select
                        value={draft.deliveryAddressLabel}
                        onChange={(event) => {
                          const label = event.target.value;
                          const address = buyerState.addresses.find((item: SavedAddress) => item.label === label);
                          handleChange({
                            deliveryAddressLabel: label,
                            deliveryLocation: address ? address.location : draft.deliveryLocation,
                            deliveryLat: address?.lat ?? null,
                            deliveryLng: address?.lng ?? null
                          });
                        }}
                        className="w-full p-3.5 bg-black/30 border border-white/10 text-[15px] text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                      >
                        <option value="">Select saved location</option>
                        {buyerState.addresses.map((address: SavedAddress) => (
                          <option key={address.id} value={address.label}>
                            {address.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    <input
                      value={draft.deliveryLocation}
                      onChange={(event) => handleChange({ deliveryLocation: event.target.value })}
                      placeholder="Enter delivery location"
                      className="w-full p-3.5 bg-black/30 border border-white/10 text-[15px] text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                    />
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors"
                      >
                        Use my location
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMapOpen((value) => !value)}
                        className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors"
                      >
                        {isMapOpen ? "Hide map" : "Pick on map"}
                      </button>
                    </div>
                    {isMapOpen ? (
                      <div className="mt-2 overflow-hidden rounded-2xl border border-white/10">
                        <MapContainer
                          center={[mapCoords?.lat ?? -1.286389, mapCoords?.lng ?? 36.817223]}
                          zoom={13}
                          className="h-[220px] w-full"
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <MapPicker />
                        </MapContainer>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {draft.scheduledDate.trim() && draft.timeWindow.trim() ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  Scheduled orders require at least a 45% advance payment. M-Pesa
                  will cover this deposit at checkout.
                </div>
              ) : null}

              {!isLoggedIn && draft.paymentMethod !== "cash" ? (
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                  <Link href="/login" className="font-semibold underline decoration-amber-300 underline-offset-4 hover:text-white">
                    Log in
                  </Link>{" "}
                  to complete M-Pesa checkout. Pay on delivery works without login.
                </div>
              ) : null}

              <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-2">
                <span className="text-purple-300 font-bold text-sm">Payments</span>
                <p className="text-purple-200/70 text-sm m-0 leading-relaxed">
                  We record M-Pesa and pay-on-delivery selections here. M-Pesa STK
                  Push will fire once Daraja credentials are configured.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
