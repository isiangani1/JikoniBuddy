"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  addSavedAddress,
  deleteSavedAddress,
  loadBuyerState,
  updateBuyerProfile,
  updateSavedAddress
} from "@/data/buyerStorage";

export default function BuyerAccountPage() {
  const router = useRouter();
  const [version, setVersion] = useState(0);
  const buyerState = useMemo(() => loadBuyerState(), [version]);

  const [name, setName] = useState(buyerState.profile.name);
  const [phone, setPhone] = useState(buyerState.profile.phone);
  const [email, setEmail] = useState(buyerState.profile.email);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [addressLabel, setAddressLabel] = useState("");
  const [addressLocation, setAddressLocation] = useState("");

  useEffect(() => {
    setName(buyerState.profile.name);
    setPhone(buyerState.profile.phone);
    setEmail(buyerState.profile.email);
  }, [buyerState.profile.email, buyerState.profile.name, buyerState.profile.phone]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const userId =
      sessionStorage.getItem("jb_user_id") ??
      sessionStorage.getItem("jb_buyer_id");
    if (!userId) return;
    let isMounted = true;
    setIsSyncing(true);
    setSyncError(null);
    fetch(`/api/user/${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!isMounted || !payload) return;
        updateBuyerProfile({
          name: payload.name ?? "",
          phone: payload.phone ?? "",
          email: payload.email ?? ""
        });
        setVersion((v) => v + 1);
      })
      .catch(() => {
        if (!isMounted) return;
        setSyncError("Could not sync profile from the server.");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsSyncing(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async () => {
    const userId =
      sessionStorage.getItem("jb_user_id") ??
      sessionStorage.getItem("jb_buyer_id");
    updateBuyerProfile({ name, phone, email });
    setVersion((v) => v + 1);
    if (!userId) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email })
      });
      if (!res.ok) {
        throw new Error("Failed");
      }
    } catch {
      setSyncError("Could not save profile changes.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddAddress = () => {
    if (!addressLabel.trim() || !addressLocation.trim()) {
      alert("Please enter a label and location.");
      return;
    }
    addSavedAddress({ label: addressLabel.trim(), location: addressLocation.trim() });
    setAddressLabel("");
    setAddressLocation("");
    setVersion((v) => v + 1);
  };

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0">
        <section className="flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10">
          <div className="flex-1 flex flex-col gap-2 justify-center">
            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs m-0">Account</p>
            <h1>Profile & saved addresses</h1>
            <p className="text-white/70 m-0 text-lg">Manage your details for faster checkout.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer">
                Back to dashboard
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/orders">
                Order history
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/payments">
                Payment history
              </Link>
              <Link className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30" href="/buyer/support">
                Support
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
            <h3>Quick actions</h3>
            <Link className="w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity" href="/buyer/sellers">
              Browse sellers
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Profile info</h2>
          <div className="form">
            <label className="field">
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>
            <label className="field">
              <span>Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxx" />
            </label>
            <label className="field">
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
            <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button" onClick={handleSaveProfile}>
              Save profile
            </button>
            <p className="text-white/50 text-sm">
              {isSyncing ? "Syncing with your account..." : "Profile synced through the gateway."}
            </p>
            {syncError ? <p className="text-rose-300 text-sm m-0">{syncError}</p> : null}
          </div>
        </section>

        <section className="flex flex-col gap-6 animate-in fade-in duration-500">
          <h2>Saved addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Add new address</h3>
              <div className="form">
                <label className="field">
                  <span>Label</span>
                  <input
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                    placeholder="Home, Work..."
                  />
                </label>
                <label className="field">
                  <span>Location</span>
                  <input
                    value={addressLocation}
                    onChange={(e) => setAddressLocation(e.target.value)}
                    placeholder="Kilimani, Nairobi"
                  />
                </label>
                <button className="px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" type="button" onClick={handleAddAddress}>
                  Add address
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2">
              <h3>Your addresses</h3>
              {buyerState.addresses.length ? (
                <ul>
                  {buyerState.addresses.map((address) => (
                    <li key={address.id}>
                      <p>
                        <strong>{address.label}</strong>
                      </p>
                      <p className="text-white/50 text-sm">{address.location}</p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur"
                          type="button"
                          onClick={() => {
                            const nextLabel = window.prompt("Edit label", address.label);
                            if (nextLabel === null) return;
                            const nextLocation = window.prompt("Edit location", address.location);
                            if (nextLocation === null) return;
                            updateSavedAddress(address.id, {
                              label: nextLabel,
                              location: nextLocation
                            });
                            setVersion((v) => v + 1);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur"
                          type="button"
                          onClick={() => {
                            if (!confirm("Delete this address?")) return;
                            deleteSavedAddress(address.id);
                            setVersion((v) => v + 1);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/50 text-sm">No saved addresses yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
