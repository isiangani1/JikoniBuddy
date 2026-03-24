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

  const [addressLabel, setAddressLabel] = useState("");
  const [addressLocation, setAddressLocation] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("jb_auth") === "true";
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setName(buyerState.profile.name);
    setPhone(buyerState.profile.phone);
    setEmail(buyerState.profile.email);
  }, [buyerState.profile.email, buyerState.profile.name, buyerState.profile.phone]);

  const handleSaveProfile = () => {
    updateBuyerProfile({ name, phone, email });
    setVersion((v) => v + 1);
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
      <main className="category-page">
        <section className="category-hero">
          <div className="category-hero-content">
            <p className="eyebrow">Account</p>
            <h1>Profile & saved addresses</h1>
            <p className="subhead">Manage your details for faster checkout.</p>
            <div className="hero-actions">
              <Link className="badge" href="/buyer">
                Back to dashboard
              </Link>
              <Link className="badge" href="/buyer/orders">
                Order history
              </Link>
              <Link className="badge" href="/buyer/payments">
                Payment history
              </Link>
              <Link className="badge" href="/buyer/support">
                Support
              </Link>
            </div>
          </div>

          <div className="category-hero-card">
            <h3>Quick actions</h3>
            <Link className="primary full" href="/buyer/sellers">
              Browse sellers
            </Link>
          </div>
        </section>

        <section className="section fade-in">
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
            <button className="primary" type="button" onClick={handleSaveProfile}>
              Save profile
            </button>
            <p className="muted">Stored locally for now. Ready for API wiring.</p>
          </div>
        </section>

        <section className="section fade-in">
          <h2>Saved addresses</h2>
          <div className="category-grid">
            <div className="category-card">
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
                <button className="primary" type="button" onClick={handleAddAddress}>
                  Add address
                </button>
              </div>
            </div>

            <div className="category-card">
              <h3>Your addresses</h3>
              {buyerState.addresses.length ? (
                <ul>
                  {buyerState.addresses.map((address) => (
                    <li key={address.id}>
                      <p>
                        <strong>{address.label}</strong>
                      </p>
                      <p className="muted">{address.location}</p>
                      <div className="hero-actions">
                        <button
                          className="ghost"
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
                          className="ghost"
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
                <p className="muted">No saved addresses yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
